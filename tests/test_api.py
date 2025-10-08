import pytest
import json
import os
from app import app

@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def backup_config():
    """Backup and restore config file"""
    config_file = 'config.json'
    backup_file = 'config.json.backup'
    
    # Backup original config
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            backup_data = f.read()
        with open(backup_file, 'w') as f:
            f.write(backup_data)
    
    yield
    
    # Restore original config
    if os.path.exists(backup_file):
        with open(backup_file, 'r') as f:
            original_data = f.read()
        with open(config_file, 'w') as f:
            f.write(original_data)
        os.remove(backup_file)

def test_get_lawyers(client):
    """Test GET /lawyers endpoint"""
    response = client.get('/lawyers')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'data' in data
    assert isinstance(data['data'], list)
    
    # Check that lawyers have scores
    if len(data['data']) > 0:
        assert 'score' in data['data'][0]
        assert 'Name' in data['data'][0]

def test_get_config(client):
    """Test GET /config endpoint"""
    response = client.get('/config')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'data' in data
    assert isinstance(data['data'], dict)

def test_update_config(client, backup_config):
    """Test PUT /config endpoint"""
    new_config = {
        'Chambers Rank': 2.0,
        'Years PE': 1.5
    }
    
    response = client.put(
        '/config',
        data=json.dumps(new_config),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert data['data']['Chambers Rank'] == 2.0
    assert data['data']['Years PE'] == 1.5

def test_update_config_invalid_data(client, backup_config):
    """Test PUT /config with invalid data"""
    invalid_config = {
        'Chambers Rank': 'invalid'
    }
    
    response = client.put(
        '/config',
        data=json.dumps(invalid_config),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] is False
    assert 'Invalid value' in data['message']

def test_update_config_no_data(client):
    """Test PUT /config with no data"""
    response = client.put(
        '/config',
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] is False

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
