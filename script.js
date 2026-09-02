// GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const moonIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
const sunIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

let currentTheme = localStorage.getItem('portfolio-theme') || 'light';
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.innerHTML = sunIcon;
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('portfolio-theme', 'light');
            themeToggle.innerHTML = moonIcon;
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark');
            themeToggle.innerHTML = sunIcon;
        }
    });
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const hoverElements = document.querySelectorAll('a, button, [data-hover], .portfolio-item');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update main cursor instantly
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Animate follower smoothly
gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    follower.style.left = cursorX + 'px';
    follower.style.top = cursorY + 'px';
});

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
    });
});

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

links.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Three.js Background
const initThreeJS = () => {
    const canvas = document.querySelector('#webgl-canvas');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3D Object (Heavy Metallic Infinity Ring)
    class InfinityCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = 2 * Math.PI * t;
            const x = Math.sin(angle) * 2.5;
            const y = Math.sin(angle * 2) * 1.2; 
            const z = Math.cos(angle * 2) * 0.4;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    
    const geometry = new THREE.TubeGeometry(new InfinityCurve(1.5), 256, 0.4, 64, true);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x111111, // Dark grey/black
        metalness: 1.0,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: false,
        wireframe: false,
        envMapIntensity: 2.0,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 3.5; // Offset further to the right
    scene.add(mesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Mouse interaction for 3D
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - windowHalfX) * 0.001;
        targetY = (e.clientY - windowHalfY) * 0.001;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Base rotation
        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.001;
        
        // Gentle floating + Mouse Position Parallax
        const targetPosX = 3.5 + targetX * 4; // Base X is 3.5, move by targetX
        const targetPosY = Math.sin(elapsedTime * 0.5) * 0.2 - targetY * 4;
        
        mesh.position.x += (targetPosX - mesh.position.x) * 0.05;
        mesh.position.y += (targetPosY - mesh.position.y) * 0.05;

        // Mouse interaction (Rotation)
        mesh.rotation.y += 0.1 * (targetX * Math.PI - mesh.rotation.y);
        mesh.rotation.x += 0.1 * (targetY * Math.PI - mesh.rotation.x);

        renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initThreeJS();

// 3D Tilt Effect for Cards
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation degrees
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});

// GSAP Animations
// Initial Load Animations
const tl = gsap.timeline();

tl.fromTo(".nav-brand", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
  .fromTo(".nav-link", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")
  .fromTo(".profile-img-container", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power4.out" }, "-=0.4")
  .fromTo(".hero-title .block", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }, "-=0.8")
  .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .fromTo(".hero-btns", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .fromTo("#webgl-canvas", { opacity: 0 }, { opacity: 0.6, duration: 2, ease: "power2.inOut" }, "-=1");

// Scroll Animations
const scrollElements = document.querySelectorAll('[data-scroll]');

scrollElements.forEach(el => {
    gsap.fromTo(el, 
        { 
            y: 50, 
            opacity: 0 
        }, 
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Portfolio Modal
const modal = document.getElementById('portfolio-modal');
const modalClose = document.querySelector('.modal-close');
const modalTitle = document.querySelector('.modal-title');
const modalCategory = document.querySelector('.modal-category');
const portfolioItems = document.querySelectorAll('.portfolio-item, .portfolio-item-new');

portfolioItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (item.dataset.pdf) {
            window.open(item.dataset.pdf, '_blank');
            return;
        }
        
        if (item.dataset.figma) {
            window.open(item.dataset.figma, '_blank');
            return;
        }

        // Logic for old layout (placeholder-img) and new layout (.item-image img)
        const isNewLayout = item.classList.contains('portfolio-item-new');
        let title = '';
        let category = '';
        let imgElement = null;

        if (isNewLayout) {
            imgElement = item.querySelector('.item-image img');
            title = 'Project ' + item.querySelector('.item-number').textContent;
            
            // Gather all tags as the category text
            const tags = item.querySelectorAll('.item-tags p');
            category = Array.from(tags).map(t => t.textContent).join(', ');
            
        } else {
            const h3 = item.querySelector('h3');
            const p = item.querySelector('p');
            if(h3) title = h3.textContent;
            if(p) category = p.textContent;
            imgElement = item.querySelector('.placeholder-img');
        }
        
        modalTitle.textContent = title;
        modalCategory.textContent = category;
        
        const modalImg = document.querySelector('.modal-img');
        
        // Ensure image fits and shows properly in modal
        if (imgElement && imgElement.tagName.toLowerCase() === 'img') {
            modalImg.style.background = `url("${imgElement.src}") center/contain no-repeat`;
        } else if (imgElement) {
            const bgGradient = window.getComputedStyle(imgElement).background;
            modalImg.style.background = bgGradient;
        } else if (item.dataset.img) {
            modalImg.style.background = `url("${item.dataset.img}") center/contain no-repeat`;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal on click outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});
