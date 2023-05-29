import pandas as pd
import time

# Step 1: Extraction


def extract_logs(log_file):
    # Code to extract web server log data from log files
    logs = pd.read_csv(log_file, delimiter=" ")
    return logs

# Step 2: Transformation


def transform_logs(logs):
    # Clean and preprocess the log data
    cleaned_logs = logs.dropna()  # Remove rows with missing values
    cleaned_logs["timestamp"] = pd.to_datetime(
        cleaned_logs["timestamp"])  # Convert timestamp to datetime format

    # Perform aggregation to calculate daily visitor count
    daily_visitors = cleaned_logs.groupby(cleaned_logs["timestamp"].dt.date)[
        "ip_address"].nunique()

    return daily_visitors

# Step 3: Loading


def load_data(data):
    # Code to load the transformed data into a data store or reporting tool
    data.to_csv("/path/to/daily_visitors.csv",
                header=["date", "visitor_count"], index=True, mode="a")
    print("Daily visitor count saved to CSV file.")

# Main function to execute the data pipeline


def main():
    try:
        while True:
            # Step 1: Extraction
            logs = extract_logs("/path/to/web_server_logs.log")

            # Step 2: Transformation
            daily_visitors = transform_logs(logs)

            # Step 3: Loading
            load_data(daily_visitors)

            # Sleep for a specific interval (e.g., 1 hour) before running the pipeline again
            time.sleep(3600)  # Sleep for 1 hour (3600 seconds)

    except Exception as e:
        print("Error occurred during data pipeline execution:")
        print(str(e))


if __name__ == "__main__":
    main()
