/**
 * Eternal Hearts Logic
 */

// State
const state = {
    step: 'hero', // hero, customize, preview, share
    userName: '',
    partnerName: '',
    message: '',
    photo: null,
    font: 'Dancing Script',
    locked: false,
    audioPlaying: false
};

// DOM Elements
const app = document.getElementById('app');
const audio = document.getElementById('bg-music');
const audioBtn = document.getElementById('audio-toggle');
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    startTypingAnimation();
    setupEventListeners();

    // Check URL params for shared view
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
        loadSharedGift(urlParams.get('data'));
    }
});

// --- Audio ---
audioBtn.addEventListener('click', () => {
    if (state.audioPlaying) {
        audio.pause();
        audioBtn.innerHTML = '<i class="fas fa-volume-mute text-xl"></i>';
    } else {
        audio.play().catch(e => console.log('Audio autoplay blocked'));
        audioBtn.innerHTML = '<i class="fas fa-volume-up text-xl text-pink-400"></i>';
    }
    state.audioPlaying = !state.audioPlaying;
});

// --- Navigation ---
function switchSection(id) {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    state.step = id;
}

// --- Hero Section ---
function startTypingAnimation() {
    const text = "Will You Be My Forever? ❤️";
    const el = document.getElementById('typing-text');
    let i = 0;
    el.innerHTML = '';

    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    type();
}

document.getElementById('start-btn').addEventListener('click', () => {
    createConfetti();
    setTimeout(() => switchSection('customize'), 800);
});

// --- Customize Section ---
const photoInput = document.getElementById('photo-upload');
const photoPreview = document.getElementById('photo-preview');
const placeholder = document.getElementById('upload-placeholder');

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            state.photo = ev.target.result;
            photoPreview.src = state.photo;
            photoPreview.classList.remove('opacity-0');
            placeholder.classList.add('opacity-0');
        };
        reader.readAsDataURL(file);
    }
});

document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.font-btn').forEach(b => {
            b.classList.remove('bg-pink-600/50', 'border-pink-400');
            b.classList.add('bg-white/5', 'border-white/10');
        });
        e.target.classList.remove('bg-white/5', 'border-white/10');
        e.target.classList.add('bg-pink-600/50', 'border-pink-400');
        state.font = e.target.dataset.font;
        document.getElementById('love-note').style.fontFamily = state.font;
    });
});

document.getElementById('preview-btn').addEventListener('click', () => {
    // Update State
    state.userName = document.getElementById('name-1').value || 'Me';
    state.partnerName = document.getElementById('name-2').value || 'You';
    state.message = document.getElementById('love-note').value || 'I love you...';

    // Update Preview DOM
    document.getElementById('preview-names').innerText = `${state.userName} & ${state.partnerName} Forever`;
    document.getElementById('preview-message').innerText = state.message;
    document.getElementById('preview-message').style.fontFamily = state.font;
    if (state.photo) document.getElementById('preview-photo').src = state.photo;

    switchSection('preview');
});

// --- Preview Section ---
document.getElementById('edit-btn').addEventListener('click', () => switchSection('customize'));

document.getElementById('share-step-btn').addEventListener('click', () => {
    generateShareLink();
    switchSection('share');
});

// Heart Lock Logic
const lockOverlay = document.getElementById('lock-overlay');
const lockCanvas = document.getElementById('lock-canvas');
let lockCtx;
let lockPoints = [];
let connectedPoints = [];

function initLock() {
    if (!lockCanvas) return;
    lockCanvas.width = lockOverlay.clientWidth;
    lockCanvas.height = lockOverlay.clientHeight;
    lockCtx = lockCanvas.getContext('2d');

    // Create heart shape points
    const cx = lockCanvas.width / 2;
    const cy = lockCanvas.height / 2;
    const size = 100;

    lockPoints = [
        { x: cx, y: cy + size * 0.8, id: 1 }, // Bottom
        { x: cx - size, y: cy - size * 0.2, id: 2 }, // Left
        { x: cx - size * 0.5, y: cy - size * 0.8, id: 3 }, // Top Left
        { x: cx + size * 0.5, y: cy - size * 0.8, id: 4 }, // Top Right
        { x: cx + size, y: cy - size * 0.2, id: 5 }, // Right
    ];

    drawLock();

    lockCanvas.addEventListener('mousedown', startConnect);
    lockCanvas.addEventListener('touchstart', startConnect, { passive: false });
    lockCanvas.addEventListener('mousemove', moveConnect);
    lockCanvas.addEventListener('touchmove', moveConnect, { passive: false });
    lockCanvas.addEventListener('mouseup', endConnect);
    lockCanvas.addEventListener('touchend', endConnect);
}

function drawLock() {
    lockCtx.clearRect(0, 0, lockCanvas.width, lockCanvas.height);

    // Draw connections
    if (connectedPoints.length > 0) {
        lockCtx.beginPath();
        lockCtx.moveTo(connectedPoints[0].x, connectedPoints[0].y);
        for (let i = 1; i < connectedPoints.length; i++) {
            lockCtx.lineTo(connectedPoints[i].x, connectedPoints[i].y);
        }
        lockCtx.strokeStyle = 'rgba(255, 105, 180, 0.8)';
        lockCtx.lineWidth = 5;
        lockCtx.lineCap = 'round';
        lockCtx.stroke();
    }

    // Draw points
    lockPoints.forEach(p => {
        const isConnected = connectedPoints.some(cp => cp.id === p.id);
        lockCtx.beginPath();
        lockCtx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        lockCtx.fillStyle = isConnected ? '#ff1493' : 'rgba(255,255,255,0.5)';
        lockCtx.fill();
        lockCtx.strokeStyle = 'white';
        lockCtx.lineWidth = 2;
        lockCtx.stroke();
    });
}

function startConnect(e) {
    e.preventDefault();
    connectedPoints = [];
    checkPoint(getPos(e));
}

function moveConnect(e) {
    e.preventDefault();
    checkPoint(getPos(e));
}

function endConnect(e) {
    if (connectedPoints.length === lockPoints.length) {
        // Unlock!
        lockOverlay.classList.remove('flex');
        lockOverlay.classList.add('hidden');
        createConfetti();
    } else {
        connectedPoints = [];
        drawLock();
    }
}

function checkPoint(pos) {
    lockPoints.forEach(p => {
        const d = Math.hypot(p.x - pos.x, p.y - pos.y);
        if (d < 30) {
            if (!connectedPoints.some(cp => cp.id === p.id)) {
                connectedPoints.push(p);
                drawLock();
            }
        }
    });
}

function getPos(e) {
    const rect = lockCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}


// --- Share Section ---
function generateShareLink() {
    const data = {
        u: state.userName,
        p: state.partnerName,
        m: state.message,
    };
    const b64 = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?data=${b64}`;

    const input = document.getElementById('share-link');
    input.value = url;

    // Generate QR
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: url,
        width: 128,
        height: 128,
        colorDark: "#4A0000",
        colorLight: "#ffffff",
    });
}

document.getElementById('copy-btn').addEventListener('click', () => {
    const copyText = document.getElementById("share-link");
    copyText.select();
    document.execCommand("copy");
    alert("Link copied to clipboard! 💌");
});

document.getElementById('restart-btn').addEventListener('click', () => window.location.reload());

// --- Shared View Loading ---
function loadSharedGift(encodedData) {
    try {
        const data = JSON.parse(atob(encodedData)); // Basic base64 decode
        state.userName = data.u;
        state.partnerName = data.p;
        state.message = data.m;

        // Populate Preview directly
        document.getElementById('preview-names').innerText = `${state.userName} & ${state.partnerName} Forever`;
        document.getElementById('preview-message').innerText = state.message;
        document.getElementById('preview-photo').src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80';

        // Hide other sections, show preview immediately
        document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
        document.getElementById('preview').classList.remove('hidden');

        // Hide edit buttons for viewer
        document.getElementById('edit-btn').classList.add('hidden');
        document.getElementById('share-step-btn').classList.add('hidden');

        // Show Lock Screen
        const lock = document.getElementById('lock-overlay');
        lock.classList.remove('hidden');
        lock.classList.add('flex');
        setTimeout(initLock, 100);

        // Add "Make Your Own"
        const makeBtn = document.createElement('button');
        makeBtn.innerText = "Make Your Own 💖";
        makeBtn.className = "absolute bottom-8 px-6 py-2 bg-white/20 rounded-full hover:bg-white/30 text-white z-40";
        makeBtn.onclick = () => window.location.href = window.location.pathname;
        document.getElementById('preview').appendChild(makeBtn);

    } catch (e) {
        console.error("Failed to load shared data", e);
    }
}


// --- Canvas Background (Petals + Hearts) ---
function initCanvas() {
    let width, height;
    let petals = [];
    let heartParticles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Petal {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.size = Math.random() * 15 + 10;
            this.speed = Math.random() * 1 + 0.5;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 2;
            this.color = `rgba(${220 + Math.random() * 35}, ${20 + Math.random() * 50}, ${60 + Math.random() * 50}, ${0.4 + Math.random() * 0.4})`;
        }

        update() {
            this.y += this.speed;
            this.rotation += this.rotSpeed;
            this.x += Math.sin(this.y * 0.01) * 0.5; // Sway

            if (this.y > height) {
                this.y = -50;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(10, -10, 20, 0, 0, 20);
            ctx.bezierCurveTo(-20, 0, -10, -10, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    class HeartParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100; // Start below
            this.size = Math.random() * 5 + 3;
            this.speedY = Math.random() * -1 - 0.5; // Move up
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.opacity -= 0.002;
            if (this.y < -50 || this.opacity <= 0) {
                this.y = height + 50;
                this.x = Math.random() * width;
                this.opacity = Math.random() * 0.5 + 0.3;
            }
        }

        draw() {
            ctx.font = `${this.size * 5}px serif`;
            ctx.fillStyle = `rgba(255, 100, 150, ${this.opacity})`;
            ctx.fillText("❤️", this.x, this.y);
        }
    }

    // Init Elements
    for (let i = 0; i < 40; i++) petals.push(new Petal());
    for (let i = 0; i < 20; i++) heartParticles.push(new HeartParticle());

    function animate() {
        ctx.clearRect(0, 0, width, height);

        petals.forEach(p => { p.update(); p.draw(); });
        heartParticles.forEach(hp => { hp.update(); hp.draw(); });

        requestAnimationFrame(animate);
    }

    animate();
}

function createConfetti() {
    const count = 50;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.innerText = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.transform = `translate(-50%, -50%)`;
        heart.style.transition = 'all 1s ease-out';
        heart.style.zIndex = '100';
        document.body.appendChild(heart);

        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 200 + 50;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.5)`;
            heart.style.opacity = '0';
        }, 10);

        setTimeout(() => heart.remove(), 1000);
    }
}

function setupEventListeners() {
    // Any extra setup
}
