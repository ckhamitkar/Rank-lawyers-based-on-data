import os
import json
from ranker import rank_lawyers


def test_ranker_loads_and_ranks_lawyer_data(tmp_path):
    """Load the repository's `lawyer_data.csv`, rank it using a small config
    that weights the 'Law360 News' column, and assert the result is
    non-empty and sorted by the computed score (descending).
    """
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    csv_path = os.path.join(repo_root, 'lawyer_data.csv')

    assert os.path.exists(csv_path), f"Expected {csv_path} to exist"

    cfg_path = tmp_path / 'cfg.json'
    weights = {"Law360 News": 1.0}
    with open(cfg_path, 'w', encoding='utf-8') as f:
        json.dump(weights, f)

    ranked = rank_lawyers(csv_path, str(cfg_path))

    # Basic sanity checks
    assert isinstance(ranked, list)
    assert len(ranked) > 0

    # Extract scores and ensure they are numeric and sorted descending
    scores = [float(item.get('score', 0)) for item in ranked]
    assert all(isinstance(s, float) for s in scores)
    assert scores == sorted(scores, reverse=True)
