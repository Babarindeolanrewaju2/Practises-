import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse


def get_highest_resolution_image_url(instagram_url):
    try:
        # Fetch the HTML content of the Instagram post using requests
        response = requests.get(instagram_url)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch URL: {instagram_url}")

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the image element
        image_element = soup.find('meta', property='og:image')
        if not image_element:
            raise ValueError("Image not found on the page")

        # Get the image URL from the 'content' attribute of the meta tag
        image_url = image_element['content']

        # Find the highest resolution image URL from the 'srcset' attribute of the img tag
        image_element = soup.find('img', srcset=True)
        if image_element:
            srcset = image_element['srcset']
            highest_resolution_url = srcset.split(',')[-1].split()[0]
            return highest_resolution_url.strip()
        else:
            return image_url
    except Exception as e:
        print(f"Failed to get the highest resolution image URL: {e}")
        return None


def download_image(image_url, output_folder):
    try:
        # Remove query parameters from the image URL
        parsed_url = urlparse(image_url)
        image_filename = os.path.basename(parsed_url.path)

        # Get the image headers to retrieve the original height and width
        headers = requests.head(image_url).headers
        original_height = headers.get('Content-Length')
        original_width = headers.get('Content-Length')

        # Create the filename based on the image URL
        filename = os.path.join(output_folder, image_filename)

        # Download the image while preserving its original size
        image_response = requests.get(image_url, stream=True)
        if image_response.status_code == 200:
            with open(filename, 'wb') as f:
                for chunk in image_response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(
                f"Image downloaded and saved with original dimensions: {original_width}x{original_height}")
        else:
            print("Failed to download the image.")
    except Exception as e:
        print(f"Failed to download the image: {e}")


if __name__ == "__main__":
    instagram_url = "https://www.instagram.com/p/Cu9bt07NKR8/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA=="
    output_folder = "downloaded_images"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    highest_resolution_image_url = get_highest_resolution_image_url(
        instagram_url)
    if highest_resolution_image_url:
        download_image(highest_resolution_image_url, output_folder)
