# emotion-mirror
real-time facial expression recognition web app with custom animations using Tensorflow.js

# Emotion Mirror

An interactive web application that detects facial expressions in real-time and displays animated overlays that respond to detected emotions.

## Live Demo

[View Live Application](https://emotionmirror.netlify.app/)

## Overview

Emotion Mirror uses computer vision and machine learning to analyze facial expressions through your webcam and dynamically update visual overlays based on detected emotional states. The application processes video input entirely in the browser, ensuring user privacy while providing real-time feedback.

## Features

- Real-time facial expression detection
- Five emotion states: Happy, Sad, Surprised, Angry, Neutral
- Custom hand-drawn animations with transparent backgrounds
- Smooth crossfade transitions between emotional states
- Browser-based processing with no server-side data collection
- Responsive design supporting modern web browsers

## Technical Implementation

The application leverages TensorFlow.js and face-api.js to perform continuous emotion classification on webcam input. A dual-layer rendering system enables seamless transitions between animation states, while optimized detection intervals maintain performance at 60fps.

### Architecture

- Frontend processes webcam feed using MediaDevices API
- Machine learning models run inference every 500ms
- Dominant emotion triggers corresponding animation overlay
- Dual-layer system crossfades between states over 1 second
- All processing occurs client-side in the browser

## Tech Stack

### Frontend
- JavaScript (ES6+)
- HTML5
- CSS3

### Machine Learning
- TensorFlow.js
- face-api.js (Tiny Face Detector, Face Expression Net)

### Animation Tools
- ibisPaint X
- Capcut

### Development Tools
- Git
- Chrome DevTools
- PowerShell

## Installation

### Prerequisites
- Modern web browser (Chrome, Edge, or Firefox recommended)
- Webcam access

### Local Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/emotion-mirror.git
```

2. Navigate to project directory
```bash
cd emotion-mirror
```

3. Open `index.html` in your browser, or use a local server:
```bash
python -m http.server 8000
```

4. Navigate to `http://localhost:8000`

5. Allow camera permissions when prompted

## Usage

1. Visit the application URL
2. Grant camera permissions when requested
3. Position your face within the webcam view
4. Make facial expressions to trigger different animations
5. Observe real-time emotion detection and corresponding visual overlays

## Browser Compatibility

- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

Note: HTTPS is required for webcam access. Local testing works on localhost.

## Performance

- Detection interval: 500ms
- Frame rate: 60fps
- Transition duration: 1 second
- Model loading time: 2-4 seconds (first visit)

## Privacy

All facial recognition and emotion detection processing occurs locally in your browser. No video data is transmitted to external servers. Webcam access is required but can be revoked at any time through browser settings.

## Project Structure
```
emotion-mirror/
├── index.html           # Main HTML structure
├── style.css           # Styling and animations
├── main.js             # Application logic and ML integration
└── art_assets/         # Animation files
    ├── Neutral.gif
    ├── Happy.gif
    ├── Sad.gif
    ├── Surprised.gif
    └── Angry.gif
```

## Development

### Key Components

**Emotion Detection Loop**
- Runs every 500ms
- Uses Tiny Face Detector for face localization
- Applies Face Expression Net for emotion classification
- Returns confidence scores for each emotion category

**Animation System**
- Maintains two overlay layers for crossfading
- Preloads next animation before transition
- Implements opacity-based fade over 1 second
- Loops animations continuously

**State Management**
- Tracks current emotion state
- Updates UI elements on emotion change
- Manages active/inactive animation layers
- Handles model loading states

## Known Issues

- Initial model loading may take several seconds on first visit
- Performance may vary on older devices
- Some browsers may require HTTPS for webcam access
- Emotion detection accuracy depends on lighting conditions

## Future Enhancements

- Additional emotion categories
- Customizable animation uploads
- Recording and playback functionality
- Multi-face detection support
- Improved mobile device compatibility

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

## License

MIT License

## Acknowledgments

- TensorFlow.js team for browser-based ML framework
- face-api.js for pre-trained emotion detection models
- Animation assets created with ibisPaint X and Krita

## Contact

[Ariana Thomas]
[arianathomas1121@gmail.com]
