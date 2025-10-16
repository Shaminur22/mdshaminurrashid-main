// Scroll Animation for Cards (guarded for pages without .card)
const cards = document.querySelectorAll('.card');
if (cards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    cards.forEach(card => {
        observer.observe(card);
    });

    // Card Click Interaction
    cards.forEach(card => {
        const header = card.querySelector('h2');
        if (header) {
            header.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });
        }
    });
}

// Floating Navbar Toggle (null-safe)
const navToggle = document.querySelector('.nav-toggle');
const floatingNav = document.querySelector('.floating-nav');
if (navToggle && floatingNav) {
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        floatingNav.classList.toggle('active');
    });

    // Auto-close when clicking outside
    document.addEventListener('click', function(e) {
        if (!floatingNav.contains(e.target)) {
            floatingNav.classList.remove('active');
        }
    });

    // Auto-close when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            floatingNav.classList.remove('active');
        });
    });
}

// Matrix rain animation
(function initMatrixRain() {
    const canvasId = 'matrix-canvas';
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        document.body.prepend(canvas);
        // Add scanlines overlay to body container class
        document.body.classList.add('scanlines');
    }
    const ctx = canvas.getContext('2d');
    const characters = 'アァカサタナハマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$#@%&*+-/<>';
    const glyphs = characters.split('');

    let width = 0;
    let height = 0;
    let columnCount = 0;
    let drops = [];
    const fontSizeBase = 16; // will scale with DPR

    function resize() {
        const dpr = Math.max(window.devicePixelRatio || 1, 1);
        width = Math.floor(window.innerWidth);
        height = Math.floor(window.innerHeight);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const fontSize = Math.max(14, Math.floor(fontSizeBase));
        ctx.font = fontSize + 'px Roboto Mono, monospace';
        columnCount = Math.ceil(width / fontSize);
        drops = new Array(columnCount).fill(0).map(() => Math.floor(Math.random() * height / fontSize));
    }

    function draw() {
        // translucent black to create trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 8;

        const fontSize = parseInt(ctx.font, 10) || fontSizeBase;
        for (let i = 0; i < drops.length; i++) {
            const text = glyphs[(Math.random() * glyphs.length) | 0];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            ctx.fillText(text, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            } else {
                drops[i]++;
            }
        }

        ctx.shadowBlur = 0;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
})();