import pytest
import os
import csv
import json
from scraper import scrape_lawyers
from ranker import rank_lawyers

@pytest.fixture
def mock_html_content():
    return """
    <html>
        <body>
            <div class="jld-card -organic">
                <strong class="name"><a href="#">Lawyer One</a></strong>
                <div class="rating"><span>San Diego, CA Attorney</span></div>
                <div class="outline">Criminal Law</div>
                <div data-nosnippet="true">This is a short description.</div>
            </div>
            <div class="jld-card -organic">
                <strong class="name"><a href="#">Lawyer Two</a></strong>
                <div class="rating"><span>Los Angeles, CA Attorney</span></div>
                <div class="outline">Family Law</div>
                <div data-nosnippet="true">This is a much longer description to ensure sorting works.</div>
            </div>
        </body>
    </html>
    """

def test_scrape_creates_csv(mocker, mock_html_content):
    """
    Test that the scraper creates the lawyers.csv file.
    """
    # Mock the requests.get call
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.text = mock_html_content
    mocker.patch('requests.get', return_value=mock_response)

    # Define the URL and the output file
    test_url = "http://fake-justia.com"
    output_file = "lawyers.csv"

    # Clean up before the test
    if os.path.exists(output_file):
        os.remove(output_file)

    # Run the scraper
    scrape_lawyers(test_url)

    # Check that the file was created
    assert os.path.exists(output_file)

    # Clean up after the test
    os.remove(output_file)

def test_ranker_sorts_correctly():
    """
    Test that the ranker sorts a dummy CSV correctly.
    """
    # Create a dummy CSV file for testing
    dummy_csv_file = 'test_lawyers.csv'
    dummy_config_file = 'test_config.json'
    
    with open(dummy_csv_file, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['name', 'location', 'practice_areas', 'description_length']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerow({'name': 'Lawyer A', 'location': 'City A', 'practice_areas': 'Area A', 'description_length': 100})
        writer.writerow({'name': 'Lawyer B', 'location': 'City B', 'practice_areas': 'Area B', 'description_length': 200})
        writer.writerow({'name': 'Lawyer C', 'location': 'City C', 'practice_areas': 'Area C', 'description_length': 50})

    # Create a dummy config file
    with open(dummy_config_file, 'w') as f:
        json.dump({'description_length': 1}, f)

    # Run the ranker
    ranked_list = rank_lawyers(dummy_csv_file, dummy_config_file)

    # Check that the list is sorted correctly
    assert len(ranked_list) == 3
    assert ranked_list[0]['name'] == 'Lawyer B'
    assert ranked_list[1]['name'] == 'Lawyer A'
    assert ranked_list[2]['name'] == 'Lawyer C'

    # Clean up the dummy files
    os.remove(dummy_csv_file)
    os.remove(dummy_config_file)
