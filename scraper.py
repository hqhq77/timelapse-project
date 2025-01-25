import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, unquote

def sanitize_filename(filename):
    # Replace invalid characters (e.g., colons, spaces) with underscores
    # Also remove URL-encoded characters like %20 (space)
    cleaned = unquote(filename)  # Decode URL-encoded characters first
    cleaned = re.sub(r'[<>:"/\\|?*]', '_', cleaned)  # Replace Windows-forbidden characters
    cleaned = cleaned.replace(' ', '_')  # Replace spaces with underscores (optional)
    return cleaned.strip('.')  # Remove leading/trailing dots

def main():
    target_url = "https://ae86-60-53-42-17.ngrok-free.app/"
    download_folder = "images"
    log_file = "downloaded_images.txt"

    os.makedirs(download_folder, exist_ok=True)
    downloaded = set()

    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            downloaded = set(f.read().splitlines())

    response = requests.get(target_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    img_links = soup.select('a[href$=".jpg"]')
    if not img_links:
        print("No images found.")
        return

    new_downloads = 0
    for link in img_links:
        href = link['href']
        if href not in downloaded:
            try:
                # Sanitize filename for Windows
                original_filename = unquote(href)
                safe_filename = sanitize_filename(original_filename)
                filepath = os.path.join(download_folder, safe_filename)

                # Download image
                img_url = urljoin(target_url, href)
                img_data = requests.get(img_url).content
                with open(filepath, 'wb') as f:
                    f.write(img_data)

                # Update log
                downloaded.add(href)
                with open(log_file, "a") as f:
                    f.write(href + "\n")

                print(f"Downloaded: {safe_filename}")
                new_downloads += 1

            except Exception as e:
                print(f"Failed to download {href}: {str(e)}")

    print(f"Total new downloads: {new_downloads}")

if __name__ == "__main__":
    main()