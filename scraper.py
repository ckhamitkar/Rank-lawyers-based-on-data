import requests
from bs4 import BeautifulSoup
import csv

def scrape_lawyers(url):
    """
    Scrapes lawyer data from a given URL, extracts the information, and saves it to a CSV file.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    lawyers_data = []

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        print("Successfully fetched the page.")

        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all lawyer cards
        lawyer_cards = soup.find_all('div', class_='jld-card')

        for card in lawyer_cards:
            name_tag = card.select_one('strong.name a')
            name = name_tag.text.strip() if name_tag else 'N/A'

            location_tag = card.select_one('.rating span')
            location = location_tag.text.split(' Attorney')[0].strip() if location_tag and 'Attorney' in location_tag.text else 'N/A'

            practice_areas_tag = card.select_one('.outline')
            practice_areas = practice_areas_tag.text.strip() if practice_areas_tag else 'N/A'

            # A simple proxy for experience/reputation could be the length of the description
            description_tag = card.select_one('.description') or card.select_one('div[data-nosnippet="true"]')
            description = description_tag.text.strip() if description_tag else ''
            description_length = len(description)

            lawyers_data.append({
                'name': name,
                'location': location,
                'practice_areas': practice_areas,
                'description_length': description_length
            })

        # Save the data to a CSV file
        with open('lawyers.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['name', 'location', 'practice_areas', 'description_length']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            writer.writerows(lawyers_data)

        print(f"Scraped and saved data for {len(lawyers_data)} lawyers to lawyers.csv")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    target_url = "https://www.justia.com/lawyers/california"
    scrape_lawyers(target_url)
