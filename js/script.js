// Mobile Navbar Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10,10,10,0.98)';
    } else {
        navbar.style.background = 'rgba(10,10,10,0.95)';
    }
});

// Form Submit (demo - console log)
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Mensaje enviado! (Demo)');
});

// Intersection Observer for animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Ripple effect for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation CSS (injected via JS or style)
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Spotify Mini Player
const bgMusic = document.getElementById('bgMusic');
const player = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeMuteBtn = document.getElementById('volumeMuteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const progressTime = document.querySelector('.progress-time');
const trackName = document.querySelector('.player-track');
const miniVisualizer = document.querySelector('.mini-visualizer');
let audioCtx, analyser, dataArray, source;
let isPlaying = false;
let currentTime = 0, duration = 0;

// Load saved state
bgMusic.volume = localStorage.getItem('volume') || 0.3;
volumeSlider.value = bgMusic.volume;
isPlaying = localStorage.getItem('isPlaying') === 'true';

// Init audio context for visualizer
function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source = audioCtx.createMediaElementSource(bgMusic);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
}

// Events
playPauseBtn.addEventListener('click', togglePlay);
volumeMuteBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', e => {
    bgMusic.volume = e.target.value;
    localStorage.setItem('volume', e.target.value);
    updateMuteIcon();
});
progressBar.addEventListener('click', seek);
bgMusic.addEventListener('timeupdate', updateProgress);
bgMusic.addEventListener('loadedmetadata', () => duration = bgMusic.duration);
bgMusic.addEventListener('ended', () => bgMusic.currentTime = 0);

// Functions
function togglePlay() {
    if (bgMusic.paused) {
        bgMusic.play();
        initAudioContext();
        isPlaying = true;
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        bgMusic.pause();
        isPlaying = false;
        playPauseBtn.classList.remove('pause');
        playPauseBtn.classList.add('play');
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    localStorage.setItem('isPlaying', isPlaying);
}

function toggleMute() {
    bgMusic.muted = !bgMusic.muted;
    updateMuteIcon();
}

function updateMuteIcon() {
    const icon = volumeMuteBtn.querySelector('i');
    icon.className = bgMusic.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
}

function updateProgress() {
    const percent = (bgMusic.currentTime / duration) * 100;
    progressFill.style.width = percent + '%';
    progressTime.textContent = formatTime(bgMusic.currentTime) + ' / ' + formatTime(duration);
}

function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    bgMusic.currentTime = pos * duration;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Mini Visualizer
function drawMiniVisualizer() {
    if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        const bars = miniVisualizer.querySelectorAll('.mini-bar') || [];
        miniVisualizer.innerHTML = '';
        const barWidth = 2;
        let x = 0;
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.className = 'mini-bar';
            bar.style.left = x + 'px';
            bar.style.height = (dataArray[i * 3] / 255 * 20) + 'px';
            miniVisualizer.appendChild(bar);
            x += barWidth + 1;
        }
    }
    requestAnimationFrame(drawMiniVisualizer);
}
drawMiniVisualizer();

// Autoplay after first interaction
document.addEventListener('click', () => {
    if (bgMusic.paused && isPlaying) bgMusic.play();
}, { once: true });

// Overlay Demo JS
if (document.querySelector('.overlay-demo')) {
    // full original script from demo-overlay.html
    let isDragging = false;
    // ... all functions: dragging, tabs, sounds, etc.
}

// MUvchat Demo JS
if (document.querySelector('.muvchat-demo')) {
    // full original script from demo-muvchat.html
    let serverRunning = false;
    // ... all functions: logs, mute, etc.
}