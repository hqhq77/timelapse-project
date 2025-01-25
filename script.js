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

// let listContainer1 = [];
// let listContainer2 = [];
// let allImages = [];
// let playbackSpeed = 1;
// let intervalId;
// let currentImageIndices = [0, 0];

// const imageElements = [document.getElementById('image-1'), document.getElementById('image-2')];
// const filenameElements = [document.getElementById('filename-1'), document.getElementById('filename-2')];

// // Load images from GitHub repository
// async function loadImages() {
//     try {
//         const response = await fetch('https://api.github.com/repos/hqhq77/timelapse-project/contents/images');
//         const files = await response.json();
        
//         // Sort images by timestamp
//         allImages = files.sort((a, b) => a.name.localeCompare(b.name));
        
//         // Categorize images into two sequences
//         allImages.forEach(file => {
//             if(file.name.includes('Top')) {
//                 listContainer1.push(file.download_url);
//             } else {
//                 listContainer2.push(file.download_url);
//             }
//         });
        
//         // Start playback if images found
//         if(listContainer1.length > 0 || listContainer2.length > 0) {
//             adjustPlaybackSpeed();
//         }
//     } catch (error) {
//         console.error('Error loading images:', error);
//     }
// }

// function displayNextImage() {
//     [listContainer1, listContainer2].forEach((sequence, index) => {
//         if (!sequence || sequence.length === 0) return;

//         const imageUrl = sequence[currentImageIndices[index]];
        
//         // Update image and filename
//         imageElements[index].src = imageUrl;
//         filenameElements[index].textContent = imageUrl.split('/').pop();

//         // Update index
//         currentImageIndices[index] = (currentImageIndices[index] + 1) % sequence.length;
//     });
// }

// function adjustPlaybackSpeed() {
//     clearInterval(intervalId);
//     const intervalTime = 1000 / playbackSpeed;
//     intervalId = setInterval(displayNextImage, intervalTime);
// }

// // Event listeners
// document.getElementById('speed-slider').addEventListener('input', function() {
//     playbackSpeed = parseFloat(this.value);
//     document.getElementById('speed-value').textContent = playbackSpeed.toFixed(1);
//     adjustPlaybackSpeed();
// });

// // Initialization
// loadImages();

// let imagePairs = [];
// let currentIndex = 0;
// let playbackSpeed = 1;
// let intervalId;
// let isFirstLoad = true;

// const imageElements = [document.getElementById('image-1'), document.getElementById('image-2')];
// const filenameElements = [document.getElementById('filename-1'), document.getElementById('filename-2')];
// const loadingIndicator = document.createElement('div');
// loadingIndicator.textContent = "Loading first images...";
// document.body.prepend(loadingIndicator);

// async function loadImages() {
//     try {
//         const response = await fetch('https://api.github.com/repos/hqhq77/timelapse-project/contents/images');
//         const files = await response.json();
        
//         // Simple pairing - assumes equal number of Top/Front images in order
//         const tops = files.filter(f => f.name.includes('Top')).sort((a,b) => a.name.localeCompare(b.name));
//         const fronts = files.filter(f => f.name.includes('Front')).sort((a,b) => a.name.localeCompare(b.name));
        
//         // Create pairs by index
//         imagePairs = [];
//         for(let i = 0; i < Math.min(tops.length, fronts.length); i++) {
//             imagePairs.push({
//                 top: tops[i].download_url,
//                 front: fronts[i].download_url
//             });
//         }

//         if (imagePairs.length > 0) {
//             // Load first pair immediately
//             await loadAndShowPair(currentIndex);
//             loadingIndicator.remove();
//             adjustPlaybackSpeed();
//         }
//     } catch (error) {
//         console.error('Error loading images:', error);
//     }
// }

// function loadAndShowPair(index) {
//     return new Promise(async (resolve) => {
//         const pair = imagePairs[index];
        
//         // Load both images
//         const loadPromises = [
//             loadImage(pair.top),
//             loadImage(pair.front)
//         ];

//         // Wait for both to load
//         const [topImg, frontImg] = await Promise.all(loadPromises);
        
//         // Update display
//         imageElements[0].src = frontImg.src;
//         imageElements[1].src = topImg.src;
//         filenameElements[0].textContent = pair.front.split('/').pop();
//         filenameElements[1].textContent = pair.top.split('/').pop();
        
//         resolve();
//     });
// }

// function loadImage(url) {
//     return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.onload = () => resolve(img);
//         img.onerror = reject;
//         img.src = url;
//     });
// }

// function adjustPlaybackSpeed() {
//     clearInterval(intervalId);
//     const intervalTime = 1000 / playbackSpeed;
    
//     intervalId = setInterval(async () => {
//         currentIndex = (currentIndex + 1) % imagePairs.length;
//         await loadAndShowPair(currentIndex);
//     }, intervalTime);
// }

// document.getElementById('speed-slider').addEventListener('input', function() {
//     playbackSpeed = parseFloat(this.value);
//     document.getElementById('speed-value').textContent = playbackSpeed.toFixed(1);
//     adjustPlaybackSpeed();
// });

// // Start initialization
// loadImages();

// Modified JavaScript
let imagePairs = [];
let currentIndex = 0;
let playbackSpeed = 1;
let intervalId;
let isPlaying = true;
let isSeeking = false;

const imageElements = [document.getElementById('image-1'), document.getElementById('image-2')];
const filenameElements = [document.getElementById('filename-1'), document.getElementById('filename-2')];
const seekbar = document.getElementById('seekbar');
const pauseBtn = document.getElementById('pause-btn');

async function loadImages() {
    try {
        const response = await fetch('https://api.github.com/repos/hqhq77/timelapse-project/contents/images');
        const files = await response.json();
        
        const tops = files.filter(f => f.name.includes('Top')).sort((a,b) => a.name.localeCompare(b.name));
        const fronts = files.filter(f => f.name.includes('Front')).sort((a,b) => a.name.localeCompare(b.name));
        
        imagePairs = [];
        for(let i = 0; i < Math.min(tops.length, fronts.length); i++) {
            imagePairs.push({
                top: tops[i].download_url,
                front: fronts[i].download_url
            });
        }

        if (imagePairs.length > 0) {
            seekbar.max = imagePairs.length - 1;
            document.getElementById('total-photos').textContent = imagePairs.length;
            await loadAndShowPair(currentIndex);
            adjustPlaybackSpeed();
        }
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

function loadAndShowPair(index) {
    currentIndex = Math.max(0, Math.min(index, imagePairs.length - 1));
    seekbar.value = currentIndex;
    document.getElementById('current-photo').textContent = currentIndex + 1; // +1 for 1-based index

    return new Promise(async (resolve) => {
        const pair = imagePairs[currentIndex];
        
        const loadPromises = [
            loadImage(pair.top),
            loadImage(pair.front)
        ];

        const [topImg, frontImg] = await Promise.all(loadPromises);
        
        imageElements[0].src = frontImg.src;
        imageElements[1].src = topImg.src;
        filenameElements[0].textContent = pair.front.split('/').pop();
        filenameElements[1].textContent = pair.top.split('/').pop();
        
        resolve();
    });
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
// Spacebar control
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
      e.preventDefault(); // Prevent scrolling
      togglePlayback();
  }
});

function togglePlayback() {
  isPlaying = !isPlaying;
  pauseBtn.textContent = isPlaying ? "⏸" : "▶";
  if (isPlaying) {
      adjustPlaybackSpeed();
  } else {
      clearInterval(intervalId);
  }
}

function adjustPlaybackSpeed() {
    clearInterval(intervalId);
    if (!isPlaying) return;

    const intervalTime = 1000 / playbackSpeed;
    
    intervalId = setInterval(async () => {
        if (!isSeeking) {
            currentIndex = (currentIndex + 1) % imagePairs.length;
            await loadAndShowPair(currentIndex);
        }
    }, intervalTime);
}

// Event Listeners
pauseBtn.addEventListener('click', togglePlayback);

seekbar.addEventListener('input', () => {
    isSeeking = true;
    loadAndShowPair(parseInt(seekbar.value));
});

seekbar.addEventListener('change', () => {
    isSeeking = false;
    if (isPlaying) adjustPlaybackSpeed();
});

document.getElementById('speed-slider').addEventListener('input', function() {
    playbackSpeed = parseFloat(this.value);
    document.getElementById('speed-value').textContent = `${playbackSpeed.toFixed(1)}x`;
    if (isPlaying) adjustPlaybackSpeed();
});

seekbar.addEventListener('input', () => {
    isSeeking = true;
    const newIndex = parseInt(seekbar.value);
    document.getElementById('current-photo').textContent = newIndex + 1;
    loadAndShowPair(newIndex);
});

// Add this zoom/pan functionality
function enableImageControls(container) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  function updateTransform() {
      container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // Mouse controls
  container.addEventListener('mousedown', (e) => {
      if (scale === 1) return;
      isDragging = true;
      container.classList.add('dragging');
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
  });

  document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
  });

  document.addEventListener('mouseup', () => {
      isDragging = false;
      container.classList.remove('dragging');
  });

  // Zoom controls
  container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 1), 5);

      // Adjust position to keep zoom centered
      translateX = offsetX - (offsetX - translateX) * (newScale / scale);
      translateY = offsetY - (offsetY - translateY) * (newScale / scale);
      scale = newScale;
      
      updateTransform();
  });

  // Double-click to reset
  container.addEventListener('dblclick', () => {
      translateX = 0;
      translateY = 0;
      scale = 1;
      updateTransform();
  });
}

// Initialize on both image containers
document.querySelectorAll('.image-container').forEach(enableImageControls);

// Start initialization
loadImages();