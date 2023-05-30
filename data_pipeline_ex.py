import psycopg2
import pandas as pd

# Connect to the database
conn = psycopg2.connect(
    host="your_host",
    database="your_database",
    user="your_username",
    password="your_password"
)

# Define the SQL query to extract the data
sql_query = "SELECT * FROM your_table"

# Extract the data from the database using Pandas
df = pd.read_sql(sql_query, conn)

# Perform data cleaning and transformation using Python
# Example: Remove duplicates
df = df.drop_duplicates()

# Example: Convert date column to a specific format
df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')

# Example: Remove null values
df = df.dropna()

# Define the SQL query to create the cleaned table
cleaned_table_name = "cleaned_table"
create_table_query = f"CREATE TABLE {cleaned_table_name} (column1 datatype1, column2 datatype2, ...)"

# Load the cleaned data into a new table in the database
cursor = conn.cursor()
cursor.execute(create_table_query)

# Convert the cleaned data into a list of tuples for bulk insertion
data_tuples = [tuple(x) for x in df.to_numpy()]

# Define the SQL query to insert the data into the new table
insert_query = f"INSERT INTO {cleaned_table_name} (column1, column2, ...) VALUES %s"

# Bulk insert the data into the new table
cursor.executemany(insert_query, data_tuples)

# Commit the changes and close the connection
conn.commit()
conn.close()
