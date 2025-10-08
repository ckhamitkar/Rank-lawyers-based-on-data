import json
import csv
import os
from ranker import rank_lawyers


def write_dummy_csv(path, rows):
    with open(path, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['name', 'location', 'practice_areas', 'description_length']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)


def test_ranker_defaults_no_config(tmp_path):
    """When no config_file is provided, rank_lawyers should use the default
    weight (description_length) and sort accordingly.
    """
    dummy_csv = tmp_path / 'test_lawyers.csv'
    rows = [
        {'name': 'Lawyer A', 'location': 'City A', 'practice_areas': 'Area A', 'description_length': 100},
        {'name': 'Lawyer B', 'location': 'City B', 'practice_areas': 'Area B', 'description_length': 200},
        {'name': 'Lawyer C', 'location': 'City C', 'practice_areas': 'Area C', 'description_length': 50},
    ]
    write_dummy_csv(dummy_csv, rows)

    ranked = rank_lawyers(str(dummy_csv))

    assert len(ranked) == 3
    assert ranked[0]['name'] == 'Lawyer B'
    assert ranked[1]['name'] == 'Lawyer A'
    assert ranked[2]['name'] == 'Lawyer C'


def test_ranker_with_config_file(tmp_path):
    """Provide a custom JSON config to alter ranking. Use negative weight to
    invert the ranking order compared to description_length alone.
    """
    dummy_csv = tmp_path / 'test_lawyers.csv'
    config_file = tmp_path / 'config.json'

    rows = [
        {'name': 'Lawyer A', 'location': 'City A', 'practice_areas': 'Area A', 'description_length': 100},
        {'name': 'Lawyer B', 'location': 'City B', 'practice_areas': 'Area B', 'description_length': 200},
        {'name': 'Lawyer C', 'location': 'City C', 'practice_areas': 'Area C', 'description_length': 50},
    ]
    write_dummy_csv(dummy_csv, rows)

    # Use a weight that prefers shorter descriptions (negative multiplier)
    weights = {'description_length': -1}
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(weights, f)

    ranked = rank_lawyers(str(dummy_csv), str(config_file))

    assert len(ranked) == 3
    # With negative weight, the smallest description_length should be ranked first
    assert ranked[0]['name'] == 'Lawyer C'
    assert ranked[1]['name'] == 'Lawyer A'
    assert ranked[2]['name'] == 'Lawyer B'
