// Emotion configuration
const EMOTIONS = {
    neutral: { file: 'Neutral.gif', icon: '( • _ • )', color: '#6B7280' },
    happy: { file: 'Happy.gif', icon: '( ˶ˆᗜˆ˵ )', color: '#10B981' },
    sad: { file: 'Sad.gif', icon: ' (;´ - `;)', color: '#3B82F6' },
    surprised: { file: 'Surprised.gif', icon: '( ˶°ㅁ°) !!', color: '#F59E0B' },
    angry: { file: 'Angry.gif', icon: '( ｡ •̀ ᴖ •́ ｡)', color: '#EF4444' }
};

// Global state
let currentEmotion = 'neutral';
let activeLayer = 1; // which gif layer is currently showing
let modelLoaded = false;

// DOM elements
let webcam, gif1, gif2;
let emotionDisplay, emotionText, emotionIcon, loadingOverlay, errorMessage;

function initializeApp() {
    console.log('Initializing Emotion Mirror...');

    webcam = document.getElementById('webcam');
    gif1 = document.getElementById('overlay-gif-1');
    gif2 = document.getElementById('overlay-gif-2');
    emotionDisplay = document.getElementById('emotion-display');
    emotionText = document.getElementById('emotion-text');
    emotionIcon = document.getElementById('emotion-icon');
    loadingOverlay = document.getElementById('loading-overlay');
    errorMessage = document.getElementById('error-message');

    // Debug: check which elements are null
    console.log('webcam:', webcam);
    console.log('gif1:', gif1);
    console.log('gif2:', gif2);
    console.log('emotionDisplay:', emotionDisplay);
    console.log('emotionText:', emotionText);
    console.log('emotionIcon:', emotionIcon);
    console.log('loadingOverlay:', loadingOverlay);
    console.log('errorMessage:', errorMessage);

    if (!webcam || !gif1 || !gif2) {
        console.error(' Missing elements — webcam:', webcam, 'gif1:', gif1, 'gif2:', gif2);
        return;
    }

    init();
}

async function init() {
    try {
        console.log('Starting webcam...');
        await startWebcam();
        console.log('✓ Webcam started');

        console.log('Loading models...');
        await loadModels();
        console.log('✓ Models loaded');

        // Set initial GIF
        console.log('🖼️ Loading initial GIF...');
        gif1.src = `art_assets/${EMOTIONS['neutral'].file}`;
        gif1.onload = () => console.log('✓ Initial GIF loaded');
        gif1.onerror = () => console.error('❌ Failed to load initial GIF. Check art_assets folder.');

        // Start detection
        startEmotionDetection();

        // Hide loading
        loadingOverlay.classList.add('hidden');
        setTimeout(() => { loadingOverlay.style.display = 'none'; }, 500);

        console.log('✅ App ready!');
    } catch (err) {
        console.error('❌ Init error:', err);
        showError(err.message);
        loadingOverlay.classList.add('hidden');
    }
}

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
        });
        webcam.srcObject = stream;
        return new Promise((resolve) => {
            webcam.onloadedmetadata = () => { webcam.play(); resolve(); };
        });
    } catch (e) {
        throw new Error('Camera access denied. Please allow camera permissions.');
    }
}

async function loadModels() {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    modelLoaded = true;
}

function startEmotionDetection() {
    setInterval(async () => {
        if (!modelLoaded) return;
        try {
            const detection = await faceapi
                .detectSingleFace(webcam, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detection) {
                const dominated = getDominantEmotion(detection.expressions);
                if (dominated !== currentEmotion) {
                    updateEmotion(dominated);
                }
            }
        } catch (e) {
            console.error('Detection error:', e);
        }
    }, 500);
}

function getDominantEmotion(expressions) {
    const map = {
        neutral: 'neutral',
        happy: 'happy',
        sad: 'sad',
        surprised: 'surprised',
        angry: 'angry',
        fearful: 'surprised',
        disgusted: 'angry'
    };

    let max = 0, best = 'neutral';
    Object.keys(expressions).forEach(k => {
        if (expressions[k] > max) { max = expressions[k]; best = k; }
    });

    // Log for debugging
    const log = Object.keys(expressions).map(k => `${k}: ${(expressions[k] * 100).toFixed(0)}%`).join(', ');
    console.log(`📊 ${log}`);
    console.log(`→ Dominant: ${best} (${(max * 100).toFixed(0)}%)`);

    return map[best] || 'neutral';
}

function updateEmotion(emotion) {
    if (!EMOTIONS[emotion]) return;
    console.log(`🎭 Emotion changed: ${currentEmotion} → ${emotion}`);
    currentEmotion = emotion;

    // Update UI label
    emotionText.textContent = emotion;
    emotionIcon.textContent = EMOTIONS[emotion].icon;
    emotionDisplay.style.borderColor = EMOTIONS[emotion].color;

    // Crossfade between the two GIF layers
    const current = activeLayer === 1 ? gif1 : gif2;
    const next = activeLayer === 1 ? gif2 : gif1;

    // Load new gif into the next layer
    next.src = `art_assets/${EMOTIONS[emotion].file}`;

    next.onload = () => {
        console.log(`✓ Loaded ${EMOTIONS[emotion].file}`);
        // Fade: show next, hide current
        next.style.opacity = '1';
        current.style.opacity = '0';

        // After transition finishes, swap active layer
        setTimeout(() => {
            activeLayer = activeLayer === 1 ? 2 : 1;
        }, 1000);
    };

    next.onerror = () => {
        console.error(`❌ Failed to load: art_assets/${EMOTIONS[emotion].file}`);
    };
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
    setTimeout(() => { errorMessage.style.display = 'none'; }, 5000);
}

// Cleanup
window.addEventListener('beforeunload', () => {
    if (webcam && webcam.srcObject) {
        webcam.srcObject.getTracks().forEach(t => t.stop());
    }
});

console.log('Script loading...');
setTimeout(initializeApp, 100);