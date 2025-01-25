let imagePairs = [];
let currentIndex = 0;
let playbackSpeed = 1;
let intervalId;
let isFirstLoad = true;

const imageElements = [document.getElementById('image-1'), document.getElementById('image-2')];
const filenameElements = [document.getElementById('filename-1'), document.getElementById('filename-2')];
const loadingIndicator = document.createElement('div');
loadingIndicator.textContent = "Loading first images...";
document.body.prepend(loadingIndicator);

async function loadImages() {
    try {
        const response = await fetch('https://api.github.com/repos/hqhq77/timelapse-project/contents/images');
        const files = await response.json();
        
        // Simple pairing - assumes equal number of Top/Front images in order
        const tops = files.filter(f => f.name.includes('Top')).sort((a,b) => a.name.localeCompare(b.name));
        const fronts = files.filter(f => f.name.includes('Front')).sort((a,b) => a.name.localeCompare(b.name));
        
        // Create pairs by index
        imagePairs = [];
        for(let i = 0; i < Math.min(tops.length, fronts.length); i++) {
            imagePairs.push({
                top: tops[i].download_url,
                front: fronts[i].download_url
            });
        }

        if (imagePairs.length > 0) {
            // Load first pair immediately
            await loadAndShowPair(currentIndex);
            loadingIndicator.remove();
            adjustPlaybackSpeed();
        }
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

function loadAndShowPair(index) {
    return new Promise(async (resolve) => {
        const pair = imagePairs[index];
        
        // Load both images
        const loadPromises = [
            loadImage(pair.top),
            loadImage(pair.front)
        ];

        // Wait for both to load
        const [topImg, frontImg] = await Promise.all(loadPromises);
        
        // Update display
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

function adjustPlaybackSpeed() {
    clearInterval(intervalId);
    const intervalTime = 1000 / playbackSpeed;
    
    intervalId = setInterval(async () => {
        currentIndex = (currentIndex + 1) % imagePairs.length;
        await loadAndShowPair(currentIndex);
    }, intervalTime);
}

document.getElementById('speed-slider').addEventListener('input', function() {
    playbackSpeed = parseFloat(this.value);
    document.getElementById('speed-value').textContent = playbackSpeed.toFixed(1);
    adjustPlaybackSpeed();
});

// Start initialization
loadImages();
