/**
 * Eternal Hearts Pro - Core Application
 * Vanilla JS, No external heavy deps.
 */

// --- Configuration & State ---
const CONFIG = {
    particleCount: 50,
    storageKey: 'eternal_hearts_data',
    defaultData: {
        photo: null,
        message: "You are the beat to my heart...",
        font: "'Great Vibes', cursive",
        name1: "Me",
        name2: "You"
    }
};

const state = {
    currentRoute: '',
    data: { ...CONFIG.defaultData },
    isMusicPlaying: false
};

// --- Utilities ---
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Safe Storage Wrapper
const Storage = {
    save: (data) => {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Storage failed (private mode?):', e);
        }
    },
    load: () => {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.warn('Storage load failed:', e);
            return null;
        }
    }
};

// --- Routing System ---
class Router {
    constructor() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        let hash = window.location.hash;

        // Handle "Share" links which might come as #/view?d=...
        if (hash.includes('?/')) {
            // Fix malformed hash from some social apps
            hash = hash.replace('?/', '?');
        }

        const [route, query] = hash.split('?');
        const params = new URLSearchParams(query);

        $$('.view').forEach(el => el.classList.remove('active'));

        if (route === '#/customize') {
            $('#view-customize').classList.add('active');
            App.loadEditorData();
        } else if (route === '#/preview') {
            $('#view-preview').classList.add('active');
            App.renderPreview(state.data); // Render local state
        } else if (route === '#/share') {
            $('#view-share').classList.add('active');
            App.generateShare();
        } else if (route === '#/view') {
            // VIEW MODE (Read-only from URL)
            const encoded = params.get('d');
            if (encoded) {
                try {
                    const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
                    $('#view-preview').classList.add('active');
                    // Hide edit controls in view-only mode
                    $('.preview-controls').style.display = 'none';
                    // Render with decoded data
                    App.renderPreview(decoded);
                    return; // Stop here
                } catch (e) {
                    console.error("Link broken", e);
                    alert("This love note seems damaged. Sending you to create your own!");
                }
            }
            // Fallback if no data
            window.location.hash = '#/';
        } else {
            $('#view-home').classList.add('active');
        }

        state.currentRoute = route;
    }
}

// --- Visual Effects (Canvas) ---
class ParticleSystem {
    constructor() {
        this.canvas = $('#bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.initParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 5 + 2, // Larger for petals
            speedY: Math.random() * 1.5 + 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2,
            sway: Math.random() * 2 - 1,
            color: Math.random() > 0.5 ? '#C71585' : '#FFD700', // Rose or Gold
            type: Math.random() > 0.8 ? 'heart' : 'petal'
        };
    }

    drawHeart(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(x, y + topCurveHeight);
        // bezier curves for heart shape
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
        this.ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        this.ctx.fill();
    }

    drawPetal(x, y, size, rotation, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation * Math.PI / 180);
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size, size / 2, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Particles
        this.particles.forEach(p => {
            p.y += p.speedY;
            p.x += Math.sin(p.y * 0.005) + p.sway * 0.2;
            p.rotation += p.rotationSpeed;

            if (p.y > this.canvas.height) {
                p.y = -10;
                p.x = Math.random() * this.canvas.width;
            }

            // Mouse interaction - Wind effect
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                // Wind blows particles away
                const force = (150 - dist) / 150;
                p.x -= (dx / dist) * force * 5;
                p.y -= (dy / dist) * force * 5;
            }

            if (p.type === 'heart') {
                this.drawHeart(p.x, p.y, p.size * 2, p.color);
            } else {
                this.drawPetal(p.x, p.y, p.size, p.rotation, p.color);
            }
        });

        // Draw Mouse Constellation
        this.drawConstellation();

        requestAnimationFrame(() => this.animate());
    }

    drawConstellation() {
        // Connect particles near mouse
        this.particles.forEach(p => {
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(255, 215, 0, ${1 - dist / 100})`;
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(p.x, p.y);
                this.ctx.stroke();
            }
        });
    }
}

// --- Application Logic ---
const App = {
    init: () => {
        // Init systems
        new Router();
        new ParticleSystem();

        // Load persisted state
        const saved = Storage.load();
        if (saved) state.data = { ...state.data, ...saved };

        // Bind Events
        App.bindEvents();
    },

    bindEvents: () => {
        // Photo Upload
        const dropZone = $('#photo-drop-zone');
        const fileInput = $('#photo-input');

        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'gold'; });
        dropZone.addEventListener('dragleave', () => dropZone.style.borderColor = '');
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '';
            if (e.dataTransfer.files[0]) App.handleFile(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) App.handleFile(e.target.files[0]);
        });

        // Text Inputs - Live Save
        const inputs = ['message-input', 'name1-input', 'name2-input', 'font-select'];
        inputs.forEach(id => {
            const el = $('#' + id);
            el.addEventListener('input', () => {
                const key = id.replace('-input', '').replace('-select', '');
                state.data[key] = el.value;
                Storage.save(state.data);
            });
        });

        // Music Toggle
        $('#music-toggle').addEventListener('click', () => {
            if (!App.audioCtx) App.initAudio();

            const audio = $('#bg-music');
            if (audio.paused) {
                audio.play().then(() => {
                    $('#music-toggle').innerHTML = '<span class="icon">❚❚</span>';
                    state.isMusicPlaying = true;
                    App.animateHeartbeat();
                }).catch(e => alert("Please interact with the page first!"));
            } else {
                audio.pause();
                $('#music-toggle').innerHTML = '<span class="icon">♪</span>';
                state.isMusicPlaying = false;
            }
        });
    },

    initAudio: () => {
        try {
            const audio = $('#bg-music');
            // Check if source is set; if not, warn or set default (omitted for now as user provides file)
            // For demo, we assume user adds file or we fallback to pure CSS animation if no audio

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            App.audioCtx = new AudioContext();
            const source = App.audioCtx.createMediaElementSource(audio);
            App.analyser = App.audioCtx.createAnalyser();
            App.analyser.fftSize = 256;

            source.connect(App.analyser);
            App.analyser.connect(App.audioCtx.destination);

            // Add class to disable CSS animation
            $('.heart-pulse-container').classList.add('heartbeat-active');
        } catch (e) {
            console.warn('Web Audio API not supported or failed:', e);
        }
    },

    animateHeartbeat: () => {
        if (!state.isMusicPlaying || !App.analyser) return;

        const dataArray = new Uint8Array(App.analyser.frequencyBinCount);
        App.analyser.getByteFrequencyData(dataArray);

        // Simple bass detection (lower frequencies)
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += dataArray[i];
        }
        const average = sum / 10;
        const scale = 1 + (average / 256) * 0.4; // Scale between 1 and 1.4

        const hearts = $$('.heart-svg');
        hearts.forEach(h => h.style.transform = `scale(${scale})`);

        requestAnimationFrame(App.animateHeartbeat);
    },

    handleFile: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Resize image via canvas
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 500;
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                state.data.photo = dataUrl;
                Storage.save(state.data);

                // Update UI
                $('#photo-preview').src = dataUrl;
                $('#photo-preview').classList.remove('hidden');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    loadEditorData: () => {
        $('#message-input').value = state.data.message;
        $('#name1-input').value = state.data.name1;
        $('#name2-input').value = state.data.name2;
        $('#font-select').value = state.data.font;

        if (state.data.photo) {
            $('#photo-preview').src = state.data.photo;
            $('#photo-preview').classList.remove('hidden');
        }
    },

    renderPreview: (data) => {
        const container = $('#preview-content');
        container.innerHTML = `
            <div class="heart-pulse-container" style="color:var(--color-primary)">
               <h1 style="font-family:${data.font}; font-size:3rem; text-align:center; text-shadow:0 0 10px rgba(199,21,133,0.8);">
                   ${data.name1} & ${data.name2}
               </h1>
            </div>
            
            ${data.photo ? `
            <div style="text-align:center; margin: 2rem 0; animation: float 3s ease-in-out infinite;">
                <img src="${data.photo}" style="max-width:300px; border-radius:50%; border:5px solid gold; box-shadow:0 0 30px rgba(199,21,133,0.6);">
            </div>` : ''}

            <div class="glass-card" style="max-width:600px; margin:0 auto;">
                <p style="font-family:${data.font}; font-size:2rem; text-align:center; padding:1rem; line-height:1.5; color: #fff;">
                    "${data.message}"
                </p>
            </div>
        `;
    },

    generateShare: () => {
        try {
            const json = JSON.stringify(state.data);
            const encoded = btoa(encodeURIComponent(json));
            const shareUrl = `${window.location.origin}${window.location.pathname}#/view?d=${encoded}`;

            $('#share-link').innerText = shareUrl;

            $('#qrcode-container').innerHTML = '';
            if (window.QRCode) {
                new QRCode($('#qrcode-container'), {
                    text: shareUrl,
                    width: 128,
                    height: 128,
                    colorDark: "#C71585",
                    colorLight: "#ffffff", // White background for QR to be scanable on dark bg
                    correctLevel: QRCode.CorrectLevel.H
                });
            }

            $('#btn-copy').onclick = () => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    const original = $('#btn-copy').innerText;
                    $('#btn-copy').innerText = 'Copied!';
                    setTimeout(() => $('#btn-copy').innerText = original, 2000);
                });
            };

            // WhatsApp Share
            $('#btn-wa').onclick = () => {
                const text = `A surprise for you: ${shareUrl}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            };

        } catch (e) {
            console.error('Share generation failed:', e);
            $('#share-link').innerText = "Error generating link.";
        }
    }
};

// Start
App.init();
