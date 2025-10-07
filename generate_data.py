import csv
import random

def generate_synthetic_data(num_rows):
    """
    Generates a specified number of rows of synthetic lawyer data.
    """
    first_names = ['John', 'Jane', 'Peter', 'Susan', 'Michael', 'Emily']
    last_names = ['Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller']
    law_firms = ['Kirkland & Ellis', 'Latham & Watkins', 'DLA Piper', 'Baker McKenzie', 'Skadden']

    data = []
    for i in range(num_rows):
        row = {
            'Name': f"{random.choice(first_names)} {random.choice(last_names)} {i}",
            'Firm': random.choice(law_firms),
            'Chambers Rank': random.randint(1, 5),
            'Years PE': random.randint(1, 20),
            'Chambers PE Rank': random.randint(1, 5),
            'LinkedIn Presence': random.randint(0, 1),
            'Law360 News': random.randint(0, 100),
            'Law360 Cases': random.randint(0, 50),
            'Google News': random.randint(0, 20),
            'Speaking Engagements (2024/2025)': random.randint(0, 5),
            'Thought Pieces (2025)': random.randint(0, 10),
            'Firm PR Pieces': random.randint(0, 5),
            'PE Brand Rank': random.randint(1, 5),
            'PE Practice Band Rank': random.randint(1, 5)
        }
        data.append(row)
    return data

def append_to_csv(file_path, data, fieldnames):
    """
    Appends generated data to a CSV file.
    """
    with open(file_path, 'a', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writerows(data)

if __name__ == '__main__':
    NUM_ROWS_TO_GENERATE = 19995
    CSV_FILE = 'lawyer_data.csv'

    # These must match the headers in the existing CSV file
    FIELDNAMES = [
        'Name', 'Firm', 'Chambers Rank', 'Years PE', 'Chambers PE Rank',
        'LinkedIn Presence', 'Law360 News', 'Law360 Cases', 'Google News',
        'Speaking Engagements (2024/2025)', 'Thought Pieces (2025)',
        'Firm PR Pieces', 'PE Brand Rank', 'PE Practice Band Rank'
    ]

    print(f"Generating {NUM_ROWS_TO_GENERATE} rows of synthetic data...")
    synthetic_data = generate_synthetic_data(NUM_ROWS_TO_GENERATE)

    print(f"Appending data to {CSV_FILE}...")
    append_to_csv(CSV_FILE, synthetic_data, FIELDNAMES)

    print("Data generation complete.")