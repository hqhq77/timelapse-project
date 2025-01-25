import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def main():
    # Get target URL from secrets
    target_url = os.environ['NGROK_ENDPOINT']
    
    # Scrape images
    response = requests.get(target_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Create filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    filename = f"images/{timestamp}.jpg"
    
    # Find and save first image (customize selector as needed)
    img_tag = soup.select_one('img')
    img_url = img_tag['src']
    
    # Download and save image
    img_data = requests.get(img_url).content
    with open(filename, 'wb') as f:
        f.write(img_data)

if __name__ == "__main__":
    main()