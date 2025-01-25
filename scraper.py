import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, unquote

def sanitize_filename(filename):
    # Decode URL-encoded characters and clean special characters
    cleaned = unquote(filename)
    cleaned = re.sub(r'[<>:"/\\|?*]', '_', cleaned)
    cleaned = cleaned.replace(' ', '_')
    return cleaned.strip('.')

def main():
    # Hardcoded ngrok URL
    target_url = "https://ae86-60-53-42-17.ngrok-free.app/"
    download_folder = "images"
    log_file = "downloaded_images.txt"

    os.makedirs(download_folder, exist_ok=True)
    downloaded = set()

    # Load download history
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            downloaded = set(f.read().splitlines())

    response = requests.get(target_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    img_links = soup.select('a[href$=".jpg"]')
    if not img_links:
        print("No new images found.")
        return

    new_downloads = 0
    for link in img_links:
        href = link['href']
        if href not in downloaded:
            try:
                # Generate safe filename
                safe_filename = sanitize_filename(href)
                filepath = os.path.join(download_folder, safe_filename)

                # Download image
                img_url = urljoin(target_url, href)
                img_data = requests.get(img_url).content
                with open(filepath, 'wb') as f:
                    f.write(img_data)

                # Update tracking
                downloaded.add(href)
                with open(log_file, "a") as f:
                    f.write(f"{href}\n")

                print(f"Downloaded: {safe_filename}")
                new_downloads += 1

            except Exception as e:
                print(f"Error downloading {href}: {str(e)}")

    print(f"New images downloaded: {new_downloads}")

if __name__ == "__main__":
    main()
