import pyodbc
import pymysql


'''
Problem:
A manufacturing company needs to incrementally load data from the OLTP database in MS SQL Server into the data warehouse in Amazon Aurora MySQL.

Requirements:
- The ETL process must be able to capture all the changes in the OLTP database (including deletes) and replicate them in the data warehouse.
- In addition to changing replication, there should be a way to do a full load of any table at any time.
- Some of the dimensions in the data warehouse will be populated by running an SQL query, so the ETL process must be able to execute a custom SQL after loading the data.
- While most of the tables are relatively small (< 10K records), there are a few large ones, so the ETL process should be able to handle tables with millions of rows.
- The ETL process will be running at least a few times a day, potentially [almost] in real-time.
'''


#  Connect to MS SQL Server


def connect_to_sql_server():
    connection_string = 'DRIVER={SQL Server};SERVER=<server_name>;DATABASE=<database_name>;UID=<username>;PWD=<password>'
    conn = pyodbc.connect(connection_string)
    return conn


#  Capture changes in the OLTP database
def capture_changes(conn):
    # Implement change data capture (CDC) logic
    # Store the changes in a separate table or change log

    # Example using temporal table for change tracking
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * INTO ChangeLog FROM YourTable FOR SYSTEM_TIME ALL")

    # Commit the changes
    conn.commit()

# Perform incremental data extraction


def extract_incremental_data(conn):
    # Extract modified data based on captured changes
    # Use SQL queries or appropriate APIs to retrieve the changed records

    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM ChangeLog WHERE OperationType IN ('I', 'U', 'D')")

    # Fetch the changed records
    data = cursor.fetchall()

    return data

#  Handle full load of tables


def perform_full_load(conn):
    # Implement logic to perform a full load of any table at any time

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM YourTable")

    # Fetch all records for full load
    data = cursor.fetchall()

    return data


#  Load data into Amazon Aurora MySQL


def load_data_to_aurora_mysql(data):
    connection = pymysql.connect(
        host='<host_name>', user='<username>', password='<password>', db='<database_name>')
    cursor = connection.cursor()

    # Implement logic to load data into Aurora MySQL
    # Use appropriate INSERT, UPDATE, and DELETE statements

    # Execute custom SQL queries for populating dimensions
    execute_custom_sql(cursor, '<custom_sql_query>')

    # Commit the changes and close the connection
    connection.commit()
    connection.close()

#  Execute custom SQL queries


def execute_custom_sql(cursor, sql_query):
    # Execute custom SQL queries for populating dimensions
    cursor.execute(sql_query)

# Main ETL process


def main():
    try:
        #  Connect to MS SQL Server
        sql_server_conn = connect_to_sql_server()

        #  Capture changes in the OLTP database
        capture_changes(sql_server_conn)

        #  Perform incremental data extraction
        incremental_data = extract_incremental_data(sql_server_conn)

        #  Handle full load of tables
        perform_full_load(sql_server_conn)

        #  Load data into Amazon Aurora MySQL
        load_data_to_aurora_mysql(incremental_data)

        # Successful execution
        print("ETL process completed successfully.")

    except Exception as e:
        # Error occurred during the ETL process
        error_info = str(e)
        # handle_errors_and_notifications(error_info)


# Run the ETL process
if __name__ == '__main__':
    main()
