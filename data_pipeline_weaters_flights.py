import requests
import pymysql
import json
import datetime
import boto3

# Weather API
weather_api_key = 'YOUR_WEATHER_API_KEY'
weather_api_url = 'https://api.openweathermap.org/data/2.5/forecast'

# Flight API
flight_api_key = 'YOUR_FLIGHT_API_KEY'
flight_api_url = 'https://api.flightaware.com/json/FlightXML3/AirlineFlightSchedules'

# MySQL Database Connection
db_host = 'YOUR_DB_HOST'
db_user = 'YOUR_DB_USERNAME'
db_password = 'YOUR_DB_PASSWORD'
db_name = 'YOUR_DB_NAME'

# AWS Configuration
aws_region = 'YOUR_AWS_REGION'
aws_access_key = 'YOUR_AWS_ACCESS_KEY'
aws_secret_key = 'YOUR_AWS_SECRET_KEY'


def extract_weather_data():
    params = {
        'q': 'CITY,COUNTRY',  # Replace with the desired location
        'appid': weather_api_key
    }
    response = requests.get(weather_api_url, params=params)
    data = response.json()
    # Adjust according to the structure of the weather API response
    return data['list']


def extract_flight_data():
    headers = {
        'Authorization': 'Bearer ' + flight_api_key
    }
    params = {
        # Adjust based on the desired date range
        'startDate': (datetime.datetime.now() + datetime.timedelta(days=1)).strftime('%Y/%m/%d'),
        # Adjust based on the desired date range
        'endDate': (datetime.datetime.now() + datetime.timedelta(days=7)).strftime('%Y/%m/%d'),
        'origin': 'YOUR_ORIGIN_AIRPORT',  # Replace with the desired airport code
        # Replace with the desired airport code
        'destination': 'YOUR_DESTINATION_AIRPORT'
    }
    response = requests.get(flight_api_url, headers=headers, params=params)
    data = response.json()
    return data['AirlineFlightSchedulesResult']['data']


def transform_weather_data(weather_data):
    transformed_data = []
    for entry in weather_data:
        transformed_entry = {
            'datetime': entry['dt'],
            'temperature': entry['main']['temp'],
            'humidity': entry['main']['humidity'],
            'description': entry['weather'][0]['description']
        }
        transformed_data.append(transformed_entry)
    return transformed_data


def transform_flight_data(flight_data):
    transformed_data = []
    for entry in flight_data:
        transformed_entry = {
            'flight_number': entry['ident'],
            'departure_time': entry['departuretime'],
            'arrival_time': entry['arrivaltime'],
            'aircraft_type': entry['aircrafttype']
        }
        transformed_data.append(transformed_entry)
    return transformed_data


def load_data_to_mysql(data, table_name):
    connection = pymysql.connect(
        host=db_host, user=db_user, password=db_password, database=db_name)
    cursor = connection.cursor()
    for entry in data:
        columns = ', '.join(entry.keys())
        placeholders = ', '.join(['%s'] * len(entry))
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        values = tuple(entry.values())
        cursor.execute(query, values)
    connection.commit()
    connection.close()


def lambda_handler(event, context):
    # Extract weather data
    weather_data = extract_weather_data()
    transformed_weather_data = transform_weather_data(weather_data)

    # Extract flight data
    flight_data = extract_flight_data()
    transformed_flight_data = transform_flight_data(flight_data)

    # Load data to MySQL database
    load_data_to_mysql(transformed_weather_data, 'weather_table')
    load_data_to_mysql(transformed_flight_data, 'flight_table')

    print("Data loaded to MySQL database")

    return {
        'statusCode': 200,
        'body': json.dumps('Data loaded to MySQL database')
    }


def schedule_pipeline():
    # AWS Lambda and CloudWatch Events setup
    client = boto3.client('events', region_name=aws_region,
                          aws_access_key_id=aws_access_key, aws_secret_access_key=aws_secret_key)

    # Define the rule to schedule the pipeline
    rule_name = 'DataPipelineSchedule'
    schedule_expression = 'cron(0 0 * * ? *)'  # Run daily at midnight UTC

    # Create the rule
    response = client.put_rule(
        Name=rule_name,
        ScheduleExpression=schedule_expression,
        State='ENABLED'
    )

    # Create the Lambda function target
    response = client.put_targets(
        Rule=rule_name,
        Targets=[
            {
                'Id': '1',
                'Arn': 'YOUR_LAMBDA_FUNCTION_ARN'
            }
        ]
    )

    print("Pipeline scheduled")


if __name__ == '__main__':
    # Manually trigger the data collection process
    lambda_handler(None, None)

    # Schedule the pipeline to run daily
    schedule_pipeline()
