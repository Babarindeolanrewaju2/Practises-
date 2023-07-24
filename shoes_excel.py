import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_shoes_below_price(url, max_price=60):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        shoes_list = soup.find_all('li', class_='productListItem')

        result_data = []

        for shoe in shoes_list:
            name_element = shoe.find('a', attrs={"data-e2e": "product-listing-name"})
            price_element = shoe.find('span', class_='pri', attrs={"data-e2e": "product-listing-price"})
            img_element = shoe.find('img', class_='thumbnail')
            source_element = shoe.find('source')

            if name_element and price_element:
                name = name_element.text.strip()
                price_text = price_element.text.strip()
                price = float(price_text.replace('£', '').replace(',', ''))

                if price <= max_price:
                    img_url = None
                    if source_element and source_element.has_attr('data-srcset'):
                        img_url = source_element['data-srcset'].split(' ')[0]
                    elif img_element and img_element.has_attr('src'):
                        img_url = img_element['src']

                    result_data.append((name, price, img_url))

        return result_data

    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return None

def save_to_excel(data, filename):
    df = pd.DataFrame(data, columns=['Name', 'Price', 'Image URL'])
    df.to_excel(filename, index=False, engine='openpyxl')

if __name__ == "__main__":
    url = "https://www.jdsports.co.uk/men/mens-footwear/"
    shoes_data = scrape_shoes_below_price(url, max_price=60)

    if shoes_data:
        output_filename = "shoes_below_60.xlsx"
        save_to_excel(shoes_data, output_filename)
        print(f"Scraped data saved to '{output_filename}'.")
    else:
        print("No data found.")
