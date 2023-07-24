import requests
from bs4 import BeautifulSoup


def scrape_shoes_below_price(url, max_price=60):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        shoes_list = soup.find_all('li', class_='productListItem')

        result_data = []

        for shoe in shoes_list:
            name_element = shoe.find(
                'a', attrs={"data-e2e": "product-listing-name"})
            price_element = shoe.find('span', class_='pri', attrs={
                                      "data-e2e": "product-listing-price"})

            if name_element and price_element:
                name = name_element.text.strip()
                price_text = price_element.text.strip()
                price = float(price_text.replace('£', '').replace(',', ''))

                if price <= max_price:
                    result_data.append((name, price))

        return result_data

    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return None


def write_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        for name, price in data:
            file.write(f"{name} - £{price:.2f}\n")


if __name__ == "__main__":
    url = "https://www.jdsports.co.uk/men/mens-footwear/"
    shoes_data = scrape_shoes_below_price(url, max_price=60)

    if shoes_data:
        output_filename = "shoes_below_60.txt"
        write_to_file(shoes_data, output_filename)
        print(f"Scraped data saved to '{output_filename}'.")
    else:
        print("No data found.")
