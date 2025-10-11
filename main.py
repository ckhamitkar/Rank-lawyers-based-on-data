from scraper import scrape_lawyers
from ranker import rank_lawyers

def main():
    """
    Main function to orchestrate the scraping and ranking.
    """
    print("Starting the lawyer ranking process...")

    # Step 1: Scrape the data
    target_url = "https://www.justia.com/lawyers/maryland"
    scrape_lawyers(target_url)

    # Step 2: Rank the data
    input_csv_file = "lawyers.csv"
    ranked_lawyers = rank_lawyers(input_csv_file)

    # Step 3: Display the results
    if ranked_lawyers:
        print("\n--- Ranked Lawyers ---")
        for i, lawyer in enumerate(ranked_lawyers):
            print(f"Rank {i+1}:")
            print(f"  Name: {lawyer['name']}")
            print(f"  Location: {lawyer['location']}")
            print(f"  Practice Areas: {lawyer['practice_areas']}")
            print(f"  Description Length (Rank Score): {lawyer['description_length']}")
            print("-" * 20)
    else:
        print("No lawyers were ranked.")

    print("Lawyer ranking process complete.")

if __name__ == "__main__":
    main()
