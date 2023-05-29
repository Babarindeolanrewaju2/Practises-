import pandas as pd

# Step 1: Extraction
def extract_logs(log_file):
    # Code to extract web server log data from log files
    logs = pd.read_csv(log_file, delimiter=" ")
    return logs

# Step 2: Transformation
def transform_logs(logs):
    # Clean and preprocess the log data
    cleaned_logs = logs.dropna()  # Remove rows with missing values
    cleaned_logs["timestamp"] = pd.to_datetime(cleaned_logs["timestamp"])  # Convert timestamp to datetime format

    # Enrich the data by extracting additional information from user agents
    cleaned_logs["browser"] = cleaned_logs["user_agent"].str.split("/").str[0]
    cleaned_logs["operating_system"] = cleaned_logs["user_agent"].str.split("/").str[1].str.split(" ").str[0]

    # Perform aggregation to derive metrics
    metrics = {
        "page_views": cleaned_logs.shape[0],
        "unique_visitors": cleaned_logs["ip_address"].nunique(),
        "popular_urls": cleaned_logs["requested_url"].value_counts().head(5)
    }

    return cleaned_logs, metrics

# Step 3: Loading
def load_data(data, metrics):
    # Code to load the transformed data and metrics into a data store or reporting tool
    data.to_csv("/path/to/cleaned_logs.csv", index=False)
    print("Cleaned logs saved to CSV file.")

    for metric, value in metrics.items():
        print(f"{metric}: {value}")

# Main function to execute the data pipeline
def main():
    try:
        # Step 1: Extraction
        logs = extract_logs("/path/to/web_server_logs.log")

        # Step 2: Transformation
        cleaned_logs, metrics = transform_logs(logs)

        # Step 3: Loading
        load_data(cleaned_logs, metrics)

    except Exception as e:
        print("Error occurred during data pipeline execution:")
        print(str(e))

if __name__ == "__main__":
    main()
