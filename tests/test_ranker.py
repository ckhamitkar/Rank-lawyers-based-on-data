import unittest
import os
import csv
import json
from ranker import rank_lawyers

class TestRanker(unittest.TestCase):

    def setUp(self):
        # Create dummy files for testing
        self.test_data_file = 'test_lawyer_data.csv'
        self.test_config_file = 'test_config.json'

        # Test data
        self.test_data = [
            {'Name': 'Lawyer A', 'Metric1': '10', 'Metric2': '20'},
            {'Name': 'Lawyer B', 'Metric1': '5', 'Metric2': '25'},
        ]
        # Test weights
        self.test_weights = {'Metric1': 2, 'Metric2': 1}

        # Write test data to CSV
        with open(self.test_data_file, 'w', newline='') as csvfile:
            fieldnames = ['Name', 'Metric1', 'Metric2']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(self.test_data)

        # Write test weights to JSON
        with open(self.test_config_file, 'w') as jsonfile:
            json.dump(self.test_weights, jsonfile)

    def tearDown(self):
        # Clean up dummy files
        os.remove(self.test_data_file)
        os.remove(self.test_config_file)

    def test_rank_lawyers(self):
        # Expected scores:
        # Lawyer A: (10 * 2) + (20 * 1) = 40
        # Lawyer B: (5 * 2) + (25 * 1) = 35
        # Expected order: Lawyer A, Lawyer B

        ranked_lawyers = rank_lawyers(self.test_data_file, self.test_config_file)

        self.assertIsNotNone(ranked_lawyers)
        self.assertEqual(len(ranked_lawyers), 2)
        self.assertEqual(ranked_lawyers[0]['Name'], 'Lawyer A')
        self.assertEqual(ranked_lawyers[1]['Name'], 'Lawyer B')
        self.assertAlmostEqual(ranked_lawyers[0]['score'], 40.0)
        self.assertAlmostEqual(ranked_lawyers[1]['score'], 35.0)

if __name__ == '__main__':
    unittest.main()