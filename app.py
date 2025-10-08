from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from ranker import rank_lawyers

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
DATA_FILE = 'lawyer_data.csv'
CONFIG_FILE = 'config.json'

@app.route('/lawyers', methods=['GET'])
def get_lawyers():
    """
    GET endpoint to retrieve ranked lawyers.
    Returns a JSON list of lawyers sorted by score.
    """
    try:
        ranked_lawyers = rank_lawyers(DATA_FILE, CONFIG_FILE)
        if ranked_lawyers:
            return jsonify(
                success=True,
                data=ranked_lawyers
            ), 200
        else:
            return jsonify(
                success=False,
                message='No lawyers found or error ranking lawyers'
            ), 404
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify(
            success=False,
            message=str(e)
        ), 500

@app.route('/config', methods=['GET'])
def get_config():
    """
    GET endpoint to retrieve the current weight configuration.
    Returns a JSON object with the weights for each criterion.
    """
    try:
        if not os.path.exists(CONFIG_FILE):
            return jsonify({
                'success': False,
                'message': 'Config file not found'
            }), 404
        
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        return jsonify({
            'success': True,
            'data': config
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/config', methods=['PUT'])
def update_config():
    """
    PUT endpoint to update the weight configuration.
    Expects a JSON object with the new weights.
    """
    try:
        new_config = request.get_json(force=True, silent=True)
        
        if not new_config or not isinstance(new_config, dict):
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate that all values are numbers
        for key, value in new_config.items():
            try:
                float(value)
            except (ValueError, TypeError):
                return jsonify({
                    'success': False,
                    'message': f'Invalid value for {key}: must be a number'
                }), 400
        
        # Write the new config to file
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(new_config, f, indent=2)
        
        return jsonify({
            'success': True,
            'message': 'Configuration updated successfully',
            'data': new_config
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
