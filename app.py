from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from ranker import rank_lawyers

app = Flask(__name__)
CORS(app)

# Default paths for data and config files
DATA_FILE = 'lawyer_data.csv'
CONFIG_FILE = 'config.json'

@app.route('/lawyers', methods=['GET'])
def get_lawyers():
    """
    GET endpoint to retrieve ranked lawyers based on current config.
    Returns a JSON array of lawyer objects with their scores.
    """
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify({
                'error': f'Data file {DATA_FILE} not found'
            }), 404
        
        if not os.path.exists(CONFIG_FILE):
            return jsonify({
                'error': f'Config file {CONFIG_FILE} not found'
            }), 404
        
        ranked_lawyers = rank_lawyers(DATA_FILE, CONFIG_FILE)
        
        if ranked_lawyers is None or len(ranked_lawyers) == 0:
            return jsonify([]), 200
        
        return jsonify(ranked_lawyers), 200
        
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

@app.route('/config', methods=['GET'])
def get_config():
    """
    GET endpoint to retrieve current configuration weights.
    Returns a JSON object with metric weights.
    """
    try:
        if not os.path.exists(CONFIG_FILE):
            return jsonify({
                'error': f'Config file {CONFIG_FILE} not found'
            }), 404
        
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        return jsonify(config), 200
        
    except json.JSONDecodeError:
        return jsonify({
            'error': f'Invalid JSON in {CONFIG_FILE}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

@app.route('/config', methods=['PUT'])
def update_config():
    """
    PUT endpoint to update configuration weights.
    Expects a JSON object with metric weights.
    """
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Request must be JSON'
            }), 400
        
        new_config = request.get_json()
        
        # Validate that all values are numeric
        if not isinstance(new_config, dict):
            return jsonify({
                'error': 'Config must be a JSON object'
            }), 400
        
        for key, value in new_config.items():
            if not isinstance(value, (int, float)):
                return jsonify({
                    'error': f'All config values must be numeric. Invalid value for {key}: {value}'
                }), 400
        
        # Write the new config
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(new_config, f, indent=2)
        
        return jsonify({
            'message': 'Config updated successfully',
            'config': new_config
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    """
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
