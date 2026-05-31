// --- BACKGROUND LIVE INTERACTIVE SPACE & REVOLVING PLANETS SIMULATOR ---
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
        if (mouse.x && mouse.y) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x += dx * 0.02;
                this.y += dy * 0.02;
            }
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Revolving Planets Configuration Class
class Planet {
    constructor(radius, distance, speed, color, glowColor) {
        this.radius = radius;
        this.distance = distance;
        this.speed = speed;
        this.color = color;
        this.glowColor = glowColor;
        this.angle = Math.random() * Math.PI * 2;
    }
    update() { 
        this.angle += this.speed; // Handles rotational movement loop
    }
    draw() {
        let cx = width / 2;
        let cy = height / 2;
        let px = cx + Math.cos(this.angle) * this.distance;
        let py = cy + Math.sin(this.angle) * this.distance;
        
        // Soft Orbit Paths
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        ctx.beginPath();
        ctx.arc(cx, cy, this.distance, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing Planet Sphere
        ctx.shadowBlur = 25;
        ctx.shadowColor = this.glowColor;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(px, py, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset blur for stable frame performance
    }
}

const stars = [];
for(let i=0; i<150; i++) stars.push(new Star());

// System parameters using your exact modern sky-blue and soft-coral palette accents
const solarSystem = [
    new Planet(14, 190, 0.002, '#38bdf8', 'rgba(56, 189, 248, 0.3)'),
    new Planet(25, 390, 0.0008, '#f43f5e', 'rgba(244, 63, 94, 0.25)')
];

function animateSpace() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // Fades trailing frames softly
    ctx.fillRect(0, 0, width, height);
    
    stars.forEach(star => { star.update(); star.draw(); });
    solarSystem.forEach(planet => { planet.update(); planet.draw(); });
    
    requestAnimationFrame(animateSpace);
}
animateSpace();
