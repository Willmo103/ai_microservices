// window.addEventListener('load', (event) => {
//     const ollamaUrl = 'https://ollama.ai/library';
//     let output = {};

//     fetch(ollamaUrl)
//         // we want to parse the html response as a html document const doc = new DOMParser().parseFromString(html, 'text/html');
//         .then(response => response.text())
//         .then(html => {
//             const doc = new DOMParser().parseFromString(html, 'text/html')
//                 .then(doc => {
//                     let models = []
//                     // this is our selector for one item. we need to use this logic to create a query for all items
//                     //	document.querySelector("#repo > ul > li:nth-child(1) > a")
//                     // this is our selector for all items
//                     //	document.querySelectorAll("#repo > ul > li > a")
//                     let modelDivs = doc.querySelectorAll("#repo > ul > li > a")
//                     // now we have all the items in an array, we can loop over them
//                     modelDivs.forEach((modelDiv) => {
//                         // we want to create a model object to add to our models array
//                         let model = {}
//                         // we want to add the href to the model object
//                         model.href = modelDiv.href

//                         let modelInfo = modelDiv.firstElementChild
//                         // we want to get the text content of the first element child
//                         model.name = modelInfo.firstElementChild.textContent.trim()
//                         // we want to get the text content of the second element child
//                         model.description = modelInfo.children[1].textContent.trim()
//                         // we want to get the text content of the third element child
//                         model.pulls = modelInfo.children[2].children[0].children[1].textContent.trim()
//                         // we want to get the text content of the fourth element child
//                         model.tags = modelInfo.children[2].children[1].children[1].textContent.trim()
//                         // we want to get the text content of the fifth element child
//                         model.updated = modelInfo.children[2].children[2].textContent.trim()
//                         // we want to add the model object to our models array
//                         models.push(model)
//                     }, output)
//                     // we want to add the models array to our output object
//                     output.models = models
//                     // we want to return the output object
//                     return output
//                 }).then(output => {
//                     // then we are going to loop through the output.models array
//                     // and use each models href to fetch the model page
//                     // and update the model object with the model page data
//                     // then we are going to return the output object
//                     output = output.models.forEach((model) => {
//                         const tagsPage = model.href + '/tags'
//                         // fetch the model page and the entire description page - the style tags and the script tags
//                         fetch(model.hre)
//                             .then(response => response.text())
//                             .then(html => {
//                                 const doc = new DOMParser().parseFromString(html, 'text/html')
//                                 let infoSection = doc.document.querySelector("body > main > section.flex.flex-1.flex-col.pb-8")
//                                 //remove a div id: "display" from the infoSection object
//                                 infoSection.removeChild(infoSection.querySelector("#display"))
//                                 model.description = infoSection.innerHTML
//                                 // we want to return the output object
//                                 return output
//                             }).then(output => {
//                                 output = output.models.forEach((model) => {
//                                     const tagsPage = model.href + '/tags'
//                                     // fetch the model page and the entire description page - the style tags and the script tags
//                                     fetch(tagsPage)
//                                         .then(response => response.text())
//                                         .then(html => {
//                                             const doc = new DOMParser().parseFromString(html, 'text/html')
//                                             // all of these document.querySelector("body > main > section.w-full.max-w-full > div:nth-child(2) > div.flex-1.ext-sm.font-medium.text-gray-900") inner most text parsed into three strings from the dot
//                                             /**<div class="flex-1 ext-sm font-medium text-gray-900">
//               <a class="group" href="/library/llama2:text">
//                 <div class="break-all text-lg text-gray-900 group-hover:underline">text</div>
//                 <div class="flex items-baseline space-x-1 text-sm font-normal text-neutral-500">
//                   <span>
//                     3.8GB • 53b394a404fd •
//                     4 weeks ago
//                   </span>
//                 </div>
//               </a>
//             </div> */
//                                             const tagsList = doc.querySelectorAll("body > main > section.w-full.max-w-full > div:nth-child(2) > div.flex-1.ext-sm.font-medium.text-gray-900")
//                                             model.tags = tagsList.forEach((tag) => {
//                                                 // we want to create a model object to add to our models array
//                                                 let tag = {}
//                                                 // we want to add the href to the model object
//                                                 tag.href = tag.href
//                                                 // we want to get the text content of the first element child
//                                                 tag.name = tag.firstElementChild.textContent.trim()
//                                                 // we want to get the text content of the second element child
//                                                 tag.description = tag.children[1].textContent.trim()
//                                                 // we want to get the text content of the third element child
//                                                 tag.pulls = tag.children[2].children[0].children[1].textContent.trim()
//                                                 // we want to get the text content of the fourth element child
//                                                 tag.tags = tag.children[2].children[1].children[1].textContent.trim()
//                                                 // we want to get the text content of the fifth element child
//                                                 tag.updated = tag.children[2].children[2].textContent.trim()
//                                                 // we want to add the model object to our models array
//                                                 tags.push(tag)
//                                             }, output)

//                                         }
//                                         )

const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const ollamaUrl = 'https://ollama.ai/library';

axios.get(ollamaUrl)
    .then(response => {
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        let modelDivs = document.querySelectorAll("#repo > ul > li > a");
        let models = [];

        modelDivs.forEach((modelDiv) => {
            let model = {};
            model.href = modelDiv.href;
            let modelInfo = modelDiv.firstElementChild;
            model.name = modelInfo.firstElementChild.textContent.trim();
            model.description = modelInfo.children[1].textContent.trim();
            model.pulls = modelInfo.children[2].children[0].children[1].textContent.trim();
            model.tags = modelInfo.children[2].children[1].children[1].textContent.trim();
            model.updated = modelInfo.children[2].children[2].textContent.trim();
            models.push(model);
        });

        return models;
    })
    .then(models => Promise.all(models.map(model => {
        return axios.get(model.href)
            .then(response => {
                const dom = new JSDOM(response.data);
                let infoSection = dom.window.document.querySelector("selector-for-model-info");
                model.fullDescription = infoSection.textContent.trim(); // Update this selector
                return model;
            });
    })))
    .then(models => Promise.all(models.map(model => {
        return axios.get(model.href + '/tags')
            .then(response => {
                const dom = new JSDOM(response.data);
                const tagsElements = dom.window.document.querySelectorAll("selector-for-tags");
                model.tags = Array.from(tagsElements).map(tagElement => {
                    let tag = {};
                    tag.href = tagElement.href;
                    tag.name = tagElement.firstElementChild.textContent.trim();
                    tag.description = tagElement.children[1].textContent.trim();
                    tag.pulls = tagElement.children[2].children[0].children[1].textContent.trim();
                    tag.updated = tagElement.children[2].children[2].textContent.trim();
                    return tag;
                });
                return model;
            });
    })))
    .then(models => {
        fs.writeFileSync('ollama-models.json', JSON.stringify(models, null, 2));
        console.log('Data saved to ollama-models.json');
    })
    .catch(error => {
        console.error('Error:', error);
    });
