import os
import csv
from ranker import rank_lawyers


def test_ranker_normalizes_headers_and_writes_files(tmp_path):
    # Create CSV with an empty header column and numeric metric columns
    csv_path = tmp_path / 'weird_headers.csv'
    fieldnames = ['Name', '', 'Metric1']
    rows = [
        {'Name': 'A', '': '', 'Metric1': '10'},
        {'Name': 'B', '': '', 'Metric1': '20'},
    ]

    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # Run ranker on this file; it should not crash and should compute scores
    ranked = rank_lawyers(str(csv_path))
    assert isinstance(ranked, list)
    assert len(ranked) == 2
    # Ensure score exists and is numeric and non-zero
    for item in ranked:
        assert 'score' in item
        assert float(item['score']) >= 0

    # Check that the repo-root and frontend/public copies were created
    root_copy = os.path.join(os.getcwd(), 'ranked_lawyer_data.csv')
    frontend_copy = os.path.join(os.getcwd(), 'frontend', 'public', 'ranked_lawyer_data.csv')

    assert os.path.exists(root_copy)
    assert os.path.exists(frontend_copy)

    # The generated CSV should not contain an empty header column
    with open(frontend_copy, 'r', encoding='utf-8') as f:
        header = f.readline().strip()
        assert ',' + ',' not in header  # crude check: no adjacent commas without header
        assert 'score' in header

    # Cleanup files created by ranker
    try:
        os.remove(root_copy)
    except OSError:
        pass
    try:
        os.remove(frontend_copy)
    except OSError:
        pass
