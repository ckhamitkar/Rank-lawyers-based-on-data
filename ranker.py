import csv
import json
import os


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

        with open(input_file, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            raw_lawyers = list(reader)

            # Normalize headers: trim whitespace and remove empty header names
            original_fieldnames = reader.fieldnames or []
            normalized_fieldnames = [fn.strip() for fn in original_fieldnames if fn and fn.strip() != '']

            # Build normalized lawyer dicts (map trimmed headers to values)
            lawyers = []
            for row in raw_lawyers:
                norm = {}
                for k, v in (row.items()):
                    nk = (k or '').strip()
                    if nk == '':
                        # skip empty header columns
                        continue
                    norm[nk] = v
                lawyers.append(norm)

            # Determine scoring strategy: if a config with weights provided, use it.
            # Otherwise autodetect numeric columns and compute score as the sum of numeric fields.
            use_autodetect = False
            if not config_file:
                use_autodetect = True
            else:
                # if config_file was provided but weights didn't match any columns, fallback to autodetect
                if weights == default_weights:
                    use_autodetect = True

            numeric_columns = []
            if use_autodetect:
                # detect columns that look numeric by scanning the first few rows
                for col in normalized_fieldnames:
                    if col.lower() in ('name', 'firm', 'location', 'practice_areas'):
                        continue
                    found_numeric = False
                    for r in lawyers:
                        v = r.get(col, '')
                        if v is None or v == '':
                            continue
                        try:
                            float(str(v))
                            found_numeric = True
                            break
                        except (ValueError, TypeError):
                            break
                    if found_numeric:
                        numeric_columns.append(col)

            # Compute scores
            for lawyer in lawyers:
                score = 0.0
                if use_autodetect and numeric_columns:
                    for col in numeric_columns:
                        try:
                            val = lawyer.get(col, '')
                            if val is None or val == '':
                                continue
                            score += float(str(val))
                        except (ValueError, TypeError):
                            continue
                else:
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

            # Write out a CSV that includes the score column so frontends can load it directly
            output_path_root = 'ranked_lawyer_data.csv'
            frontend_dir = os.path.join('frontend', 'public')
            output_path_frontend = os.path.join(frontend_dir, 'ranked_lawyer_data.csv')

            if lawyers:
                # ensure deterministic field order: use normalized (trimmed, non-empty) fieldnames
                # falling back to the lawyer dict keys if normalization produced nothing
                fieldnames = normalized_fieldnames if normalized_fieldnames else list(lawyers[0].keys())
                # Make a copy to avoid mutating the normalized list
                fieldnames = list(fieldnames)
                if 'score' not in fieldnames:
                    fieldnames.append('score')

                try:
                    # write repo-root copy (backwards compatibility)
                    with open(output_path_root, 'w', encoding='utf-8', newline='') as outcsv:
                        writer = csv.DictWriter(outcsv, fieldnames=fieldnames)
                        writer.writeheader()
                        for row in ranked_lawyers:
                            out_row = {k: row.get(k, '') for k in fieldnames}
                            writer.writerow(out_row)
                except Exception as e:
                    print(f"Warning: failed to write {output_path_root}: {e}")

                try:
                    # ensure frontend public directory exists
                    os.makedirs(frontend_dir, exist_ok=True)
                    # write copy that Vite can serve from frontend/public
                    with open(output_path_frontend, 'w', encoding='utf-8', newline='') as outcsv:
                        writer = csv.DictWriter(outcsv, fieldnames=fieldnames)
                        writer.writeheader()
                        for row in ranked_lawyers:
                            out_row = {k: row.get(k, '') for k in fieldnames}
                            writer.writerow(out_row)
                except Exception as e:
                    print(f"Warning: failed to write {output_path_frontend}: {e}")

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