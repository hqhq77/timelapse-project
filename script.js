//     let listContainer1 = [];
//     let listContainer2 = [];

//     // SCRAPEEEEE
//     async function fetchAndScrape(url) {
//         try {
//             // Fetch the HTML content of the target website using the proxy server
//             const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(url)}`;
//             const response = await fetch(proxyUrl);
//             const text = await response.text();

//             // Parse the HTML content
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(text, 'text/html');

//             // Select all <a> tags within <li> tags
//             const liElements = doc.querySelectorAll('body ul li a');

//             // Extract the href attribute and categorize based on the file name
//             liElements.forEach(li => {
//                 const href = li.getAttribute('href');
//                 if (href) {
//                     const imageUrl = `https://ae86-60-53-42-17.ngrok-free.app/${href}`;
//                     if (href.endsWith("Top.jpg")) {
//                         listContainer1.push(imageUrl);
//                     } else {
//                         listContainer2.push(imageUrl);
//                     }
//                 }
//             });
//         } catch (error) {
//             console.error('Error fetching or parsing the content:', error);
//         }
//     }

//     // Call the function with the target ngrok website URL
//     fetchAndScrape('https://ae86-60-53-42-17.ngrok-free.app');

//     const sequences = [
//         {
//             urls: listContainer1
//         },
//         {
//             urls: listContainer2
//         }
//     ];

//     let playbackSpeed = 0.5;
//     let intervalId;
//     let currentImageIndices = sequences.map(() => 0);

//     const imageElements = [document.getElementById('image-1'), document.getElementById('image-2')];
//     const filenameElements = [document.getElementById('filename-1'), document.getElementById('filename-2')];

//     async function fetchAndDisplayNextImage() {
//   sequences.forEach(async (sequence, index) => {
//     if (!sequence.urls || sequence.urls.length === 0) return;

//     const imageUrl = sequence.urls[currentImageIndices[index]];
//     console.log('Fetching image:', imageUrl);

//     try {
//       const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(imageUrl)}`;
//       const response = await fetch(proxyUrl, {
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//           'Accept': 'image/*', // Request only image content
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch image: ${imageUrl}`);
//       }

//       const contentType = response.headers.get('Content-Type');
//       if (!contentType || !contentType.startsWith('image')) {
//         throw new Error(`Invalid Content-Type: ${contentType}`);
//       }

//       const blob = await response.blob();
//       const objectUrl = URL.createObjectURL(blob);

//       imageElements[index].src = objectUrl; // Set image src
//       filenameElements[index].textContent = imageUrl.split('/').pop(); // Set filename
//     } catch (error) {
//       console.error('Error displaying image:', error);
//     }

//     currentImageIndices[index] =
//       (currentImageIndices[index] + 1) % sequence.urls.length;
//   });
// }


//     function adjustPlaybackSpeed() {
//         clearInterval(intervalId);
//         intervalId = setInterval(fetchAndDisplayNextImage, 1000 / playbackSpeed);
//     }

//     document.getElementById('speed-slider').addEventListener('input', function() {
//         playbackSpeed = parseFloat(this.value);
//         document.getElementById('speed-value').textContent = playbackSpeed.toFixed(1);
//         adjustPlaybackSpeed();
//     });

//     adjustPlaybackSpeed();

let listContainer1 = [];
let listContainer2 = [];
let allImages = [];
let playbackSpeed = 1;
let intervalId;
let currentImageIndices = [0, 0];

const imageElements = [document.getElementById('image-1'), document.getElementById('image-2')];
const filenameElements = [document.getElementById('filename-1'), document.getElementById('filename-2')];

// Load images from GitHub repository
async function loadImages() {
    try {
        const response = await fetch('https://api.github.com/repos/hqhq77/timelapse-project/contents/images');
        const files = await response.json();
        
        // Sort images by timestamp
        allImages = files.sort((a, b) => a.name.localeCompare(b.name));
        
        // Categorize images into two sequences
        allImages.forEach(file => {
            if(file.name.includes('Top')) {
                listContainer1.push(file.download_url);
            } else {
                listContainer2.push(file.download_url);
            }
        });
        
        // Start playback if images found
        if(listContainer1.length > 0 || listContainer2.length > 0) {
            adjustPlaybackSpeed();
        }
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

function displayNextImage() {
    [listContainer1, listContainer2].forEach((sequence, index) => {
        if (!sequence || sequence.length === 0) return;

        const imageUrl = sequence[currentImageIndices[index]];
        
        // Update image and filename
        imageElements[index].src = imageUrl;
        filenameElements[index].textContent = imageUrl.split('/').pop();

        // Update index
        currentImageIndices[index] = (currentImageIndices[index] + 1) % sequence.length;
    });
}

function adjustPlaybackSpeed() {
    clearInterval(intervalId);
    const intervalTime = 1000 / playbackSpeed;
    intervalId = setInterval(displayNextImage, intervalTime);
}

// Event listeners
document.getElementById('speed-slider').addEventListener('input', function() {
    playbackSpeed = parseFloat(this.value);
    document.getElementById('speed-value').textContent = playbackSpeed.toFixed(1);
    adjustPlaybackSpeed();
});

// Initialization
loadImages();