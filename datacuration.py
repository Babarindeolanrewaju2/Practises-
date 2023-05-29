import psycopg2

# Connect to the PostgreSQL database
conn = psycopg2.connect(
    host="localhost", database="mydatabase", user="myuser", password="mypassword")

# Create a cursor object to execute SQL queries
cur = conn.cursor()


def clean_data():
    try:
        # Execute SQL queries to clean the data
        # Remove rows with missing values
        cur.execute(
            "DELETE FROM customer_data WHERE name IS NULL OR email IS NULL")

        # Remove duplicate rows
        cur.execute("DELETE FROM customer_data WHERE id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (partition BY name, email ORDER BY id) AS rnum FROM customer_data) t WHERE t.rnum > 1)")

        # Convert email addresses to lowercase
        cur.execute("UPDATE customer_data SET email = LOWER(email)")

        # Commit the changes
        conn.commit()
        print("Data cleaning completed successfully.")

    except (Exception, psycopg2.Error) as error:
        print("Error occurred during data cleaning.")
        print(str(error))

    finally:
        # Close the cursor and connection
        cur.close()
        conn.close()

# Main function to execute data cleaning script


def main():
    # Call the clean_data function
    clean_data()


if __name__ == "__main__":
    main()
