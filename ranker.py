import csv
import json

def rank_lawyers(input_file, config_file):
    """
    Ranks lawyers based on weighted criteria from a CSV file and a JSON config file.
    """
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            weights = json.load(f)

        with open(input_file, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            lawyers = list(reader)

            for lawyer in lawyers:
                # Remove None keys that may exist due to malformed CSV data
                if None in lawyer:
                    del lawyer[None]
                
                score = 0
                for column, weight in weights.items():
                    try:
                        # Ensure the column exists and the value is a number
                        if column in lawyer and lawyer[column]:
                            score += float(lawyer[column]) * weight
                    except (ValueError, TypeError):
                        # Handle cases where conversion to float fails
                        pass
                lawyer['score'] = score

            # Sort the lawyers by score in descending order
            # Ensure score is always a number for comparison
            ranked_lawyers = sorted(lawyers, key=lambda x: x.get('score', 0), reverse=True)

            return ranked_lawyers

    except FileNotFoundError as e:
        print(f"Error: The file {e.filename} was not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {config_file}.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == '__main__':
    # For testing the ranker directly
    ranked_list = rank_lawyers('lawyer_data.csv', 'config.json')
    if ranked_list:
        print("Ranked Lawyers:")
        for i, lawyer in enumerate(ranked_list):
            print(f"{i+1}. {lawyer['Name']} (Score: {lawyer.get('score', 'N/A')})")