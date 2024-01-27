import json, os
import requests as r
from bs4 import BeautifulSoup
from tqdm import tqdm
import markdown

def scrape_ollama_models():
    base_url = 'https://ollama.ai'
    _url = 'https://ollama.ai/library'
    response = r.get(_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    model_count = len(soup.select("#repo > ul > li"))  # Update selector if necessary
    models = []

    for index, model_div in enumerate(tqdm(soup.select("#repo > ul > li > a"), total=model_count)):
        model_url = base_url + model_div['href']
        model = {
            'href': model_url,
            'name': model_div.findChild('h2').text.strip(),
            'description': '',
            'tags': [],
        }

        model_response = r.get(model_url)
        soup = BeautifulSoup(model_response.content, 'html.parser')

        description_div = soup.find("div", id="display")
        if description_div is not None:
            markdown_content = description_div.get_text(strip=True)
            model['description'] = process_markdown(markdown_content)

        tag_response = r.get(model_url + '/tags')
        tag_soup = BeautifulSoup(tag_response.content, 'html.parser')
        tag_child_divs = tag_soup.find_all('div', class_='flex-1 ext-sm font-medium text-gray-900')

        for child in tag_child_divs:
            name = child.select_one('a.group > div').text.strip()
            size = child.select_one('a.group > div > span').text.strip().split('•')[0].strip()
            id = child.select_one('a.group > div > span').text.strip().split('•')[1].strip()
            last_updated = child.select_one('a.group > div > span').text.strip().split('•')[2].strip()

            model['tags'].append({
                'name': name,
                'size': size,
                'id': id,
                'last_updated': last_updated
            })


        models.append(model)

    # Save to JSON file with timestamp
    filename = os.path.join(os.path.dirname(__file__), 'ollama-models.json')
    with open(filename, 'w') as file:
        json.dump(models, file, indent=2)

    print('done ({} models processed)'.format(len(models)))

def process_markdown(model_html):
    """
    Convert markdown formatted text to a formatted string for display.
    :param markdown: str - Markdown-formatted text as a string.
    :return: str - Formatted string representation of the given markdown text.
    """
    md = markdown.Markdown(extensions=['tables'])  # Update extensions if necessary
    formatted_text = md.convert(model_html)
    return formatted_text

if __name__ == '__main__':
    scrape_ollama_models()
