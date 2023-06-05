import json
import requests
import psycopg2

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

# Load the transformed data to a database

def load_data_to_database(data):
    # Database connection details
    db_host = 'your_db_host'
    db_port = 'your_db_port'
    db_name = 'your_db_name'
    db_user = 'your_db_user'
    db_password = 'your_db_password'

    # Connect to the database
    connection = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )

    # Create a cursor object to execute SQL statements
    cursor = connection.cursor()

    # Create the table if it doesn't exist
    create_table_query = """
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255),
        price FLOAT,
        quantity INTEGER
    )
    """
    cursor.execute(create_table_query)

    # Insert the transformed data into the table
    insert_query = """
    INSERT INTO products (id, name, price, quantity)
    VALUES (%s, %s, %s, %s)
    """
    for item in data:
        values = (item['id'], item['name'], item['price'], item['quantity'])
        cursor.execute(insert_query, values)

    # Commit the changes and close the connection
    connection.commit()
    cursor.close()
    connection.close()

# Main function to orchestrate the pipeline


def main():
    # Step 1: Extract data from an API
    api_url = 'https://api.example.com/products'
    data = extract_data_from_api(api_url)

    # Step 2: Transform the data
    transformed_data = transform_data(data)

    # Step 3: Load the transformed data to a database
    load_data_to_database(transformed_data)


# Run the pipeline
if __name__ == '__main__':
    main()
