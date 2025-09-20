import csv

def rank_lawyers(input_file):
    """
    Ranks lawyers based on the length of their description from a CSV file.
    """
    try:
        with open(input_file, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            lawyers = list(reader)

            # Convert description_length to integer for sorting
            for lawyer in lawyers:
                lawyer['description_length'] = int(lawyer['description_length'])

            # Sort the lawyers by description_length in descending order
            ranked_lawyers = sorted(lawyers, key=lambda x: x['description_length'], reverse=True)

            return ranked_lawyers

    except FileNotFoundError:
        print(f"Error: The file {input_file} was not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == '__main__':
    # For testing the ranker directly
    ranked_list = rank_lawyers('lawyers.csv')
    if ranked_list:
        print("Top 10 Ranked Lawyers:")
        for i, lawyer in enumerate(ranked_list[:10]):
            print(f"{i+1}. {lawyer['name']} (Description Length: {lawyer['description_length']})")
