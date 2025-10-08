import csv
import json


def rank_lawyers(input_file, config_file=None):
    """
    Ranks lawyers based on weighted criteria from a CSV file and an optional JSON config file.

    If `config_file` is not provided or cannot be read, a sensible default is used
    (weighting `description_length` by 1.0) so callers that only supply a CSV
    (like the tests) still get a meaningful ranking.
    """
    # Default weights: prefer longer descriptions if no config is provided
    default_weights = {"description_length": 1.0}

    try:
        if config_file:
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    weights = json.load(f)
            except FileNotFoundError:
                # Fall back to defaults if config file is missing
                weights = default_weights
            except json.JSONDecodeError:
                # Fall back to defaults if config file is invalid
                weights = default_weights
        else:
            weights = default_weights

        with open(input_file, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            lawyers = list(reader)

            for lawyer in lawyers:
                score = 0.0
                for column, weight in weights.items():
                    try:
                        # Ensure the column exists and the value is numeric
                        if column in lawyer and lawyer[column] is not None and lawyer[column] != '':
                            score += float(lawyer[column]) * float(weight)
                    except (ValueError, TypeError):
                        # If conversion fails, treat the contribution as zero
                        pass
                lawyer['score'] = score

            # Sort the lawyers by score in descending order
            ranked_lawyers = sorted(lawyers, key=lambda x: x.get('score', 0), reverse=True)

            return ranked_lawyers

    except FileNotFoundError as e:
        print(f"Error: The file {e.filename} was not found.")
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