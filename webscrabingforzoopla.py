from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

# create a new Chrome browser instance
driver = webdriver.Chrome()

# navigate to the Zoopla website
driver.get("https://www.zoopla.co.uk/")

# wait for the page to load
time.sleep(5)

# enter a search query for properties in London
search_box = driver.find_element_by_name("q")
search_box.send_keys("London")
search_box.send_keys(Keys.RETURN)

# wait for the search results page to load
time.sleep(5)

# find all property listings on the page
listings = driver.find_elements_by_class_name("listing-results-wrapper")

# loop through each property listing and print out some details
for listing in listings:
    address = listing.find_element_by_class_name("listing-results-address").text
    price = listing.find_element_by_class_name("listing-results-price").text
    bedrooms = listing.find_element_by_class_name("num-icon.num-beds").text
    bathrooms = listing.find_element_by_class_name("num-icon.num-baths").text

    print(f"Address: {address}")
    print(f"Price: {price}")
    print(f"Bedrooms: {bedrooms}")
    print(f"Bathrooms: {bathrooms}")
    print("----")

# close the browser
driver.close()
