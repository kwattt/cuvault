import sqlite3
import pandas as pd
import sys 
# Read the CSV file
def read_csv(csv_file):
    df = pd.read_csv(csv_file)
    return df

if __name__ == "__main__":
    # Read the CSV file
    # get first arg as csv file and second arg as db path, third arg as table name
    if len(sys.argv) < 4:
        print("Please provide csv file, db path and table name")
        exit(1)

    csv_file = sys.argv[1]
    db_path = sys.argv[2]
    table_name = sys.argv[3]
    df = read_csv(csv_file)

    # Connect to the database
    conn = sqlite3.connect(db_path)
    for index, row in df.iterrows():

        import datetime
        # Insert the record in the database (remove all '' from the values)
        concept = conn.execute(f'''SELECT * FROM {table_name} WHERE concept = '{row['concept'].replace("'", " ").replace('"', "")}' ''').fetchall()
        if len(concept) == 0:
            conn.execute(f'''INSERT INTO {table_name} (concept, definition, labels, subjects, sources) \
                VALUES ('{row['concept'].replace("'", " ").replace('"', "")}', '{row['definition'].replace("'", " ").replace('"', "")}', '{row['labels'].replace("'", " ").replace('"', "")}', '{row['subjects'].replace("'", " ").replace('"', "")}', '{row['sources'].replace("'", " ").replace('"', "")}');''')
    conn.commit()
    conn.close()
    print("Data inserted successfully")

# Path: model/sqlite_to_csv.py