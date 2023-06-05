import json
import requests

# Step 1: Extract data from an API
def extract_data_from_api(api_url):
    response = requests.get(api_url)
    data = response.json()
    return data

# Step 2: Transform the data
def transform_data(data):
    transformed_data = []
    for item in data:
        transformed_item = {
            'id': item['id'],
            'name': item['name'].upper(),
            'price': float(item['price']),
            'quantity': int(item['quantity'])
        }
        transformed_data.append(transformed_item)
    return transformed_data

# Step 3: Load the transformed data to a file
def load_data_to_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file)

# Main function to orchestrate the pipeline
def main():
    # Step 1: Extract data from an API
    api_url = 'https://api.example.com/products'
    data = extract_data_from_api(api_url)

    # Step 2: Transform the data
    transformed_data = transform_data(data)

    # Step 3: Load the transformed data to a file
    file_path = 'transformed_data.json'
    load_data_to_file(transformed_data, file_path)

# Run the pipeline
if __name__ == '__main__':
    main()
