import requests
from bs4 import BeautifulSoup

# Send a GET request to the website URL
url = 'https://www.jdsports.co.uk/sale/'
response = requests.get(url)

# Create a BeautifulSoup object to parse the HTML content
soup = BeautifulSoup(response.content, 'html.parser')

# Find and extract specific data from the HTML
products = []

# Example: Extract product details such as name, price, and discount
product_elements = soup.find_all('div', class_='product')
for product in product_elements:
    name = product.find('h2').text.strip()
    price = product.find('span', class_='nowprice').text.strip()
    savings_element = product.find('span', class_='pcSavings')
    if savings_element:
        savings_text = savings_element.text.strip()
        savings = int(savings_text.replace('%', ''))
        if savings > 50:
            products.append({
                'name': name,
                'price': price,
                'savings': savings_text
            })

# Print the collected product data
for product in products:
    print(product)
