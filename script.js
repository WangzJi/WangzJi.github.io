// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu after clicking a link
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 14;
        this.columns = [];
        this.drops = [];
        
        this.init();
        this.animate();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        
        for (let i = 0; i < columnCount; i++) {
            this.columns[i] = 1;
            this.drops[i] = Math.random() * this.canvas.height;
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = `${this.fontSize}px JetBrains Mono`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i]);
            
            if (this.drops[i] > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i] += this.fontSize;
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.init();
    }
}

// Enhanced Typewriter Effect
class TypewriterEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.isDeleting = false;
        this.isPaused = false;
    }
    
    type() {
        const current = this.text.substring(0, this.index);
        this.element.textContent = current;
        
        if (!this.isDeleting && this.index < this.text.length) {
            this.index++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.isDeleting && this.index > 0) {
            this.index--;
            setTimeout(() => this.type(), this.speed / 2);
        } else if (!this.isDeleting && this.index === this.text.length) {
            setTimeout(() => {
                this.isDeleting = true;
                this.type();
            }, 2000);
        } else if (this.isDeleting && this.index === 0) {
            this.isDeleting = false;
            setTimeout(() => this.type(), 500);
        }
    }
    
    start() {
        this.type();
    }
}

// Particle Mouse Follower
class ParticleFollower {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        return canvas;
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create new particles on mouse move
            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    x: this.mouse.x + (Math.random() - 0.5) * 20,
                    y: this.mouse.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1,
                    decay: Math.random() * 0.02 + 0.01,
                    size: Math.random() * 3 + 1
                });
            }
        });
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = '#00ff88';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ff88';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Ripple Effect
class RippleEffect {
    constructor() {
        this.ripples = [];
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '998';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        return canvas;
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    createRipple(x, y) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 100,
            opacity: 1,
            speed: 2
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const ripple = this.ripples[i];
            
            ripple.radius += ripple.speed;
            ripple.opacity = 1 - (ripple.radius / ripple.maxRadius);
            
            if (ripple.radius >= ripple.maxRadius) {
                this.ripples.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = ripple.opacity;
            this.ctx.strokeStyle = '#00ff88';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth scrolling for CTA button
const ctaBtn = document.querySelector('.cta-btn');
if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = ctaBtn.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add special animation for skill cards
            if (entry.target.classList.contains('skill-card')) {
                const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 200;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, delay);
            }
            
            // Add special animation for project cards
            if (entry.target.classList.contains('project-card')) {
                const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 300;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .section-title');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Enhanced hover effects for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add glow effect to project number
            const projectNumber = card.querySelector('.project-number');
            if (projectNumber) {
                projectNumber.style.textShadow = '0 0 30px currentColor';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            
            // Remove glow effect
            const projectNumber = card.querySelector('.project-number');
            if (projectNumber) {
                projectNumber.style.textShadow = '0 0 20px rgba(255, 0, 128, 0.5)';
            }
        });
    });
});

// Enhanced hover effects for skill cards
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add glow effect to skill icon
            const icon = card.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.textShadow = '0 0 30px currentColor';
            }
            
            // Animate skill tags
            const tags = card.querySelectorAll('.skill-tags span');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px)';
                    tag.style.borderColor = 'var(--primary-color)';
                    tag.style.color = 'var(--primary-color)';
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset icon
            const icon = card.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.textShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
            }
            
            // Reset skill tags
            const tags = card.querySelectorAll('.skill-tags span');
            tags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
                tag.style.borderColor = 'var(--border-color)';
                tag.style.color = 'var(--text-secondary)';
            });
        });
    });
});

// Contact items hover effects
document.addEventListener('DOMContentLoaded', () => {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.textShadow = '0 0 20px currentColor';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.textShadow = 'none';
            }
        });
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Apply ripple effect to interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.cta-btn, .project-link, .contact-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', createRipple);
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Parallax effect for particles (if you want to make them interactive)
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        particle.style.transform += ` translate(${x}px, ${y}px)`;
    });
});

// Code preview typing effect
function typeCode() {
    const codeLines = document.querySelectorAll('.code-line');
    
    codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
            line.style.transition = 'all 0.3s ease';
        }, index * 200 + 2000); // Start after terminal animation
    });
}

// Initialize code typing effect
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeCode, 1000);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 136, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Theme toggle functionality (optional)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Skills animation counter
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
}

// Project cards hover effect
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Progress Bar Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.ui-progress-bar');
    
    progressBars.forEach(bar => {
        const width = Math.random() * 80 + 20; // Random width between 20-100%
        bar.style.width = width + '%';
    });
}

// Code Preview Interactions
function initCodePreview() {
    const runBtn = document.querySelector('.run-btn');
    const codeLines = document.querySelectorAll('.code-line');
    
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            // Animate code execution
            codeLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.background = 'rgba(0, 255, 136, 0.1)';
                    setTimeout(() => {
                        line.style.background = '';
                    }, 300);
                }, index * 100);
            });
            
            // Show output after animation
            setTimeout(() => {
                const outputContent = document.querySelector('.output-content');
                if (outputContent) {
                    outputContent.style.opacity = '0';
                    outputContent.style.transform = 'translateY(10px)';
                    outputContent.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        outputContent.style.opacity = '1';
                        outputContent.style.transform = 'translateY(0)';
                    }, 100);
                }
            }, codeLines.length * 100);
        });
    }
}

// Enhanced Terminal Simulation
function initTerminalSimulation() {
    const typewriterElement = document.getElementById('typewriter');
    const cursor = document.querySelector('.cursor');
    
    if (typewriterElement) {
        const commands = ['whoami', 'ls -la', 'pwd', 'git status'];
        let currentCommandIndex = 0;
        
        function typeCommand() {
            const command = commands[currentCommandIndex];
            const typewriter = new TypewriterEffect(typewriterElement, command, 150);
            typewriter.start();
            
            setTimeout(() => {
                currentCommandIndex = (currentCommandIndex + 1) % commands.length;
                typeCommand();
            }, 4000);
        }
        
        typeCommand();
    }
}

// Parallax Effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('.floating-shape, .data-viz');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Performance Monitor
function initPerformanceMonitor() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function calculateFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Adjust effects based on performance
            if (fps < 30) {
                document.body.classList.add('low-performance');
            } else {
                document.body.classList.remove('low-performance');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(calculateFPS);
    }
    
    calculateFPS();
}

// Data Visualization Animation
function animateDataViz() {
    const vizBars = document.querySelectorAll('.viz-bar');
    
    setInterval(() => {
        vizBars.forEach(bar => {
            const newHeight = Math.random() * 80 + 20;
            bar.style.setProperty('--height', newHeight + '%');
        });
    }, 2000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize matrix rain
    new MatrixRain();
    
    // Initialize particle effects
    new ParticleFollower();
    new RippleEffect();
    
    // Initialize other features
    initSmoothScrolling();
    initScrollAnimations();
    initCodePreview();
    initTerminalSimulation();
    initParallax();
    initPerformanceMonitor();
    
    // Start animations
    animateProgressBars();
    animateDataViz();
    
    // Update on resize
    window.addEventListener('resize', () => {
        const matrixRain = new MatrixRain();
    });
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Add some CSS for performance optimization
const style = document.createElement('style');
style.textContent = `
    .low-performance .particle,
    .low-performance .floating-shape,
    .low-performance .matrix-rain {
        display: none !important;
    }
    
    body:not(.loaded) {
        opacity: 0;
    }
    
    body.loaded {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    /* Enhance glow effects */
    .terminal-window:hover,
    .code-preview:hover {
        box-shadow: 
            var(--shadow-lg),
            0 0 50px rgba(0, 255, 136, 0.2);
    }
    
    .skill-card:hover,
    .project-card:hover {
        box-shadow: 
            var(--shadow-lg),
            0 0 30px rgba(0, 255, 136, 0.15);
    }
`;
document.head.appendChild(style); 