import pytest
import json
import os
import csv
from app import app

@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_data_file(tmp_path):
    """Create a sample lawyer data CSV file for testing."""
    data_file = tmp_path / "lawyer_data.csv"
    data = [
        {'Name': 'Alice Smith', 'Chambers Rank': '5', 'Years PE': '10', 'LinkedIn Presence': '8'},
        {'Name': 'Bob Jones', 'Chambers Rank': '8', 'Years PE': '5', 'LinkedIn Presence': '9'},
        {'Name': 'Carol White', 'Chambers Rank': '3', 'Years PE': '15', 'LinkedIn Presence': '7'},
    ]
    
    with open(data_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['Name', 'Chambers Rank', 'Years PE', 'LinkedIn Presence'])
        writer.writeheader()
        writer.writerows(data)
    
    return str(data_file)

@pytest.fixture
def sample_config_file(tmp_path):
    """Create a sample config JSON file for testing."""
    config_file = tmp_path / "config.json"
    config = {
        'Chambers Rank': 2,
        'Years PE': 1.5,
        'LinkedIn Presence': 1
    }
    
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(config, f)
    
    return str(config_file)

@pytest.fixture
def setup_test_files(sample_data_file, sample_config_file, monkeypatch):
    """Set up test files and patch the app to use them."""
    monkeypatch.setattr('app.DATA_FILE', sample_data_file)
    monkeypatch.setattr('app.CONFIG_FILE', sample_config_file)
    yield sample_data_file, sample_config_file


class TestLawyersEndpoint:
    """Test cases for the /lawyers endpoint."""
    
    def test_get_lawyers_success(self, client, setup_test_files):
        """Test successful retrieval of ranked lawyers."""
        response = client.get('/lawyers')
        
        assert response.status_code == 200
        data = response.get_json()
        
        assert isinstance(data, list)
        assert len(data) == 3
        
        # Check that each lawyer has required fields
        for lawyer in data:
            assert 'Name' in lawyer
            assert 'score' in lawyer
            assert isinstance(lawyer['score'], (int, float))
        
        # Verify lawyers are sorted by score (descending)
        scores = [lawyer['score'] for lawyer in data]
        assert scores == sorted(scores, reverse=True)
    
    def test_get_lawyers_correct_scores(self, client, setup_test_files):
        """Test that lawyer scores are calculated correctly."""
        response = client.get('/lawyers')
        data = response.get_json()
        
        # Carol White should have the highest score:
        # (3 * 2) + (15 * 1.5) + (7 * 1) = 6 + 22.5 + 7 = 35.5
        assert data[0]['Name'] == 'Carol White'
        assert data[0]['score'] == 35.5
    
    def test_get_lawyers_missing_data_file(self, client, monkeypatch):
        """Test error handling when data file is missing."""
        monkeypatch.setattr('app.DATA_FILE', 'nonexistent.csv')
        monkeypatch.setattr('app.CONFIG_FILE', 'config.json')
        
        response = client.get('/lawyers')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'error' in data
        assert 'not found' in data['error'].lower()
    
    def test_get_lawyers_missing_config_file(self, client, sample_data_file, monkeypatch):
        """Test error handling when config file is missing."""
        monkeypatch.setattr('app.DATA_FILE', sample_data_file)
        monkeypatch.setattr('app.CONFIG_FILE', 'nonexistent.json')
        
        response = client.get('/lawyers')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'error' in data
        assert 'not found' in data['error'].lower()


class TestConfigEndpoint:
    """Test cases for the /config endpoint."""
    
    def test_get_config_success(self, client, setup_test_files):
        """Test successful retrieval of config."""
        response = client.get('/config')
        
        assert response.status_code == 200
        data = response.get_json()
        
        assert isinstance(data, dict)
        assert 'Chambers Rank' in data
        assert 'Years PE' in data
        assert 'LinkedIn Presence' in data
        assert data['Chambers Rank'] == 2
        assert data['Years PE'] == 1.5
        assert data['LinkedIn Presence'] == 1
    
    def test_get_config_missing_file(self, client, monkeypatch):
        """Test error handling when config file is missing."""
        monkeypatch.setattr('app.CONFIG_FILE', 'nonexistent.json')
        
        response = client.get('/config')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'error' in data
        assert 'not found' in data['error'].lower()
    
    def test_get_config_invalid_json(self, client, tmp_path, monkeypatch):
        """Test error handling when config file contains invalid JSON."""
        config_file = tmp_path / "bad_config.json"
        with open(config_file, 'w') as f:
            f.write("{ invalid json }")
        
        monkeypatch.setattr('app.CONFIG_FILE', str(config_file))
        
        response = client.get('/config')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'invalid json' in data['error'].lower()
    
    def test_put_config_success(self, client, setup_test_files):
        """Test successful update of config."""
        new_config = {
            'Chambers Rank': 3,
            'Years PE': 2,
            'LinkedIn Presence': 1.5
        }
        
        response = client.put('/config', 
                             data=json.dumps(new_config),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'message' in data
        assert 'config' in data
        assert data['config'] == new_config
        
        # Verify the config was actually written to the file
        response = client.get('/config')
        assert response.status_code == 200
        saved_config = response.get_json()
        assert saved_config == new_config
    
    def test_put_config_invalid_content_type(self, client, setup_test_files):
        """Test error handling when content type is not JSON."""
        response = client.put('/config', 
                             data='not json',
                             content_type='text/plain')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'json' in data['error'].lower()
    
    def test_put_config_invalid_structure(self, client, setup_test_files):
        """Test error handling when config is not a dict."""
        response = client.put('/config',
                             data=json.dumps(['not', 'a', 'dict']),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'object' in data['error'].lower()
    
    def test_put_config_non_numeric_values(self, client, setup_test_files):
        """Test error handling when config contains non-numeric values."""
        invalid_config = {
            'Chambers Rank': 'not a number',
            'Years PE': 2
        }
        
        response = client.put('/config',
                             data=json.dumps(invalid_config),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'numeric' in data['error'].lower()
    
    def test_put_config_empty_object(self, client, setup_test_files):
        """Test that empty config object is accepted."""
        empty_config = {}
        
        response = client.put('/config',
                             data=json.dumps(empty_config),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['config'] == empty_config


class TestConfigUpdateAffectsRankings:
    """Test that updating config changes the lawyer rankings."""
    
    def test_config_update_changes_rankings(self, client, setup_test_files):
        """Test that updating weights changes the ranking order."""
        # Get initial rankings
        response1 = client.get('/lawyers')
        initial_rankings = response1.get_json()
        initial_top_lawyer = initial_rankings[0]['Name']
        
        # Update config to prioritize LinkedIn Presence heavily
        new_config = {
            'Chambers Rank': 0.1,
            'Years PE': 0.1,
            'LinkedIn Presence': 10
        }
        
        client.put('/config',
                  data=json.dumps(new_config),
                  content_type='application/json')
        
        # Get new rankings
        response2 = client.get('/lawyers')
        new_rankings = response2.get_json()
        new_top_lawyer = new_rankings[0]['Name']
        
        # Bob Jones has LinkedIn Presence of 9 (highest), so should be #1 now
        assert new_top_lawyer == 'Bob Jones'
        assert new_top_lawyer != initial_top_lawyer


class TestHealthEndpoint:
    """Test cases for the /health endpoint."""
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get('/health')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'ok'


class TestEdgeCases:
    """Test edge cases and error conditions."""
    
    def test_lawyers_empty_data_file(self, client, tmp_path, sample_config_file, monkeypatch):
        """Test handling of empty data file."""
        empty_file = tmp_path / "empty.csv"
        with open(empty_file, 'w') as f:
            f.write("Name,Chambers Rank,Years PE\n")  # Header only
        
        monkeypatch.setattr('app.DATA_FILE', str(empty_file))
        monkeypatch.setattr('app.CONFIG_FILE', sample_config_file)
        
        response = client.get('/lawyers')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data == []
    
    def test_config_with_float_values(self, client, setup_test_files):
        """Test that config accepts float values."""
        float_config = {
            'Chambers Rank': 1.5,
            'Years PE': 2.7,
            'LinkedIn Presence': 0.3
        }
        
        response = client.put('/config',
                             data=json.dumps(float_config),
                             content_type='application/json')
        
        assert response.status_code == 200
        
        # Verify the floats are preserved
        response = client.get('/config')
        saved_config = response.get_json()
        assert saved_config['Chambers Rank'] == 1.5
        assert saved_config['Years PE'] == 2.7
    
    def test_config_with_negative_values(self, client, setup_test_files):
        """Test that config accepts negative values (valid use case)."""
        negative_config = {
            'Chambers Rank': -1,
            'Years PE': 2
        }
        
        response = client.put('/config',
                             data=json.dumps(negative_config),
                             content_type='application/json')
        
        assert response.status_code == 200
