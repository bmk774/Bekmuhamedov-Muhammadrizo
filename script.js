// Force scroll to top on load
window.addEventListener('pageshow', function() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 100);
});

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
const hoverElements = document.querySelectorAll('a, button, [data-hover], .portfolio-item, .portfolio-item-new');

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

let isThreeJSPaused = false;
let resumeThreeJS = null;

// Three.js Background
const initThreeJS = () => {
    const canvas = document.querySelector('#webgl-canvas');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3D Object (Metallic 3D Bat Symbol)
    const batShape = new THREE.Shape();
    // Start at bottom-center tail tip and trace clockwise
    batShape.moveTo(0, -0.86);
    // Bottom left wing arch up to lower left wingtip
    batShape.bezierCurveTo(-0.36, -0.19, -1.22, -0.11, -1.695, -0.175);
    // Outer left wing scallop curve up to outer left wingtip
    batShape.bezierCurveTo(-1.56, 0.20, -1.92, 0.63, -2.415, 0.835);
    // Flat top left wing edge to inner top wing shoulder
    batShape.lineTo(-0.805, 0.835);
    // Inner top left wing curve down to neck/shoulder dip
    batShape.quadraticCurveTo(-0.73, 0.575, -0.615, 0.52);
    batShape.quadraticCurveTo(-0.48, 0.46, -0.285, 0.445);
    // Left neck dip to outer left ear base and up to left ear tip
    batShape.quadraticCurveTo(-0.23, 0.44, -0.20, 0.46);
    batShape.quadraticCurveTo(-0.175, 0.52, -0.145, 0.74);
    // Left ear tip down to inner left ear base
    batShape.lineTo(-0.112, 0.60);
    // Flat crown of head across center to inner right ear base
    batShape.lineTo(0.112, 0.60);
    // Inner right ear base up to right ear tip
    batShape.lineTo(0.145, 0.74);
    // Outer right ear down to neck/shoulder dip
    batShape.quadraticCurveTo(0.175, 0.52, 0.20, 0.46);
    batShape.quadraticCurveTo(0.23, 0.44, 0.285, 0.445);
    // Inner top right wing curve rising to top wing shoulder
    batShape.quadraticCurveTo(0.48, 0.46, 0.615, 0.52);
    batShape.quadraticCurveTo(0.73, 0.575, 0.805, 0.835);
    // Flat top right wing edge to outer wingtip
    batShape.lineTo(2.415, 0.835);
    // Outer right wing scallop curve down to lower wingtip
    batShape.bezierCurveTo(1.92, 0.63, 1.56, 0.20, 1.695, -0.175);
    // Bottom right wing arch down to center tail tip
    batShape.bezierCurveTo(1.22, -0.11, 0.36, -0.19, 0, -0.86);

    const extrudeSettings = {
        depth: 0.20,
        bevelEnabled: true,
        bevelThickness: 0.055,
        bevelSize: 0.016,
        bevelOffset: -0.004,
        bevelSegments: 10,
        curveSegments: 64
    };

    const geometry = new THREE.ExtrudeGeometry(batShape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshPhysicalMaterial({
        color: 0x0d0d0d,
        metalness: 0.22,
        roughness: 0.3,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        transparent: false,
        wireframe: false,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.84, 0.95, 1.0);
    mesh.position.set(3.25, -1.35, 0);
    scene.add(mesh);

    // Lighting (positioned off-axis so flat faces stay dark charcoal and beveled edges catch highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.6);
    pointLight.position.set(7, 7, 4);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 1.0);
    pointLight2.position.set(-6, -6, 3);
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
        if (isThreeJSPaused) return;
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Gentle floating + Mouse Position Parallax
        const targetPosX = 3.25 + targetX * 3.2;
        const targetPosY = -1.35 + Math.sin(elapsedTime * 0.9) * 0.16 - targetY * 3.2;
        
        mesh.position.x += (targetPosX - mesh.position.x) * 0.05;
        mesh.position.y += (targetPosY - mesh.position.y) * 0.05;

        // Smooth 3D sway + Mouse interaction (Rotation)
        const idleRotY = Math.sin(elapsedTime * 0.7) * 0.32 - 0.18;
        const idleRotX = Math.cos(elapsedTime * 0.55) * 0.14 - 0.08;
        const idleRotZ = Math.sin(elapsedTime * 0.45) * 0.06;

        mesh.rotation.y += 0.08 * (idleRotY + targetX * Math.PI * 0.85 - mesh.rotation.y);
        mesh.rotation.x += 0.08 * (idleRotX + targetY * Math.PI * 0.65 - mesh.rotation.x);
        mesh.rotation.z += 0.08 * (idleRotZ - targetX * 0.25 - mesh.rotation.z);

        renderer.render(scene, camera);
    };

    resumeThreeJS = () => {
        requestAnimationFrame(animate);
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
  .fromTo("#webgl-canvas", { opacity: 0 }, { opacity: 0.85, duration: 1.5, ease: "power2.inOut" }, "-=1");

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
const modalCounter = document.querySelector('.modal-counter');
const modalGalleryTabs = document.querySelector('.modal-gallery-tabs');
const modalPrevBtn = document.querySelector('.gallery-arrow.prev');
const modalNextBtn = document.querySelector('.gallery-arrow.next');
const modalImg = document.querySelector('.modal-img');
const modalVideo = document.querySelector('.modal-video');
const modalIframe = document.querySelector('.modal-iframe');
const portfolioItems = document.querySelectorAll('.portfolio-item, .portfolio-item-new');

let currentGallery = null;
let currentGalleryIndex = 0;

function extractYouTubeId(input) {
    if (!input) return '';
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : trimmed;
}

function showGalleryItem(index) {
    if (!currentGallery || !currentGallery.length) return;
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    
    currentGalleryIndex = index;
    const work = currentGallery[index];
    
    // Update Title, Category & Counter
    modalTitle.textContent = work.title || '';
    modalCategory.textContent = work.tag || '';
    if (modalCounter) {
        modalCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(currentGallery.length).padStart(2, '0')}`;
    }
    
    // Update tabs active state
    if (modalGalleryTabs) {
        const pills = modalGalleryTabs.querySelectorAll('.gallery-pill');
        pills.forEach((p, idx) => {
            if (idx === index) p.classList.add('active');
            else p.classList.remove('active');
        });
    }
    
    const isYouTube = work.type === 'youtube' || (work.src && /(?:youtube\.com|youtu\.be)/.test(work.src));
    const useLocalFallback = isYouTube && window.location.protocol === 'file:' && work.fallback;

    // Show YouTube, video, or image
    if (isYouTube && !useLocalFallback) {
        if (modalImg) modalImg.style.display = 'none';
        if (modalVideo) {
            modalVideo.onerror = null;
            modalVideo.pause();
            modalVideo.style.display = 'none';
            modalVideo.removeAttribute('src');
            modalVideo.load();
        }
        let iframeEl = modalIframe;
        if (!iframeEl) {
            const wrapper = document.querySelector('.modal-media-wrapper');
            if (wrapper) {
                iframeEl = document.createElement('iframe');
                iframeEl.className = 'modal-iframe';
                iframeEl.style.cssText = 'width:100%;height:100%;max-height:70vh;border-radius:8px;background:#000;border:none;';
                iframeEl.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframeEl.setAttribute('allowfullscreen', '');
                wrapper.appendChild(iframeEl);
            }
        }
        if ( iframeEl ) {
            const ytId = extractYouTubeId(work.src);
            iframeEl.style.display = 'block';
            iframeEl.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${ytId}`;
        }
    } else if (work.type === 'video' || useLocalFallback) {
        if (modalImg) modalImg.style.display = 'none';
        const iframeEl = modalIframe || document.querySelector('.modal-iframe');
        if (iframeEl) {
            iframeEl.style.display = 'none';
            iframeEl.src = '';
        }
        if (modalVideo) {
            modalVideo.style.display = 'block';
            modalVideo.muted = true;
            modalVideo.defaultMuted = true;
            modalVideo.playsInline = true;
            modalVideo.autoplay = true;
            modalVideo.loop = true;
            const primarySrc = useLocalFallback ? work.fallback : work.src;
            const candidates = [primarySrc].concat(work.fallbacks || (work.fallback ? [work.fallback] : [])).filter(Boolean);
            let candidateIdx = 0;
            const tryPlay = () => {
                modalVideo.muted = true;
                modalVideo.play().catch(() => {});
            };
            modalVideo.onloadedmetadata = tryPlay;
            modalVideo.onloadeddata = tryPlay;
            modalVideo.oncanplay = tryPlay;
            const loadCandidate = (idx) => {
                if (idx >= candidates.length) return;
                candidateIdx = idx;
                modalVideo.src = encodeURI(candidates[idx]);
                modalVideo.load();
                tryPlay();
            };
            modalVideo.onerror = () => {
                if (candidateIdx + 1 < candidates.length) {
                    loadCandidate(candidateIdx + 1);
                }
            };
            loadCandidate(0);
        }
    } else {
        if (modalVideo) {
            modalVideo.onerror = null;
            modalVideo.pause();
            modalVideo.style.display = 'none';
            modalVideo.removeAttribute('src');
            modalVideo.load();
        }
        const iframeEl = modalIframe || document.querySelector('.modal-iframe');
        if (iframeEl) {
            iframeEl.style.display = 'none';
            iframeEl.src = '';
        }
        if (modalImg) {
            modalImg.style.display = 'block';
            const encodedSrc = encodeURI(work.src);
            modalImg.style.background = `url("${encodedSrc}") center/contain no-repeat`;
            if (work.fallback) {
                const probe = new Image();
                probe.onerror = () => {
                    modalImg.style.background = `url("${encodeURI(work.fallback)}") center/contain no-repeat`;
                };
                probe.src = encodedSrc;
            }
        }
    }
}

if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showGalleryItem(currentGalleryIndex - 1);
    });
}

if (modalNextBtn) {
    modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showGalleryItem(currentGalleryIndex + 1);
    });
}

portfolioItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (item.dataset.pdf) {
            if (window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)) {
                window.location.href = item.dataset.pdf;
            } else {
                window.open(item.dataset.pdf, '_blank');
            }
            return;
        }
        
        if (item.dataset.figma) {
            if (window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)) {
                window.location.href = item.dataset.figma;
            } else {
                window.open(item.dataset.figma, '_blank');
            }
            return;
        }

        // Multi-work Gallery Mode (Blender 3D Collection / After Effects Showcase)
        if (item.dataset.gallery) {
            try {
                currentGallery = JSON.parse(item.dataset.gallery);
            } catch (err) {
                currentGallery = null;
            }
        } else {
            currentGallery = null;
        }

        if (currentGallery && currentGallery.length > 0) {
            if (modalPrevBtn) modalPrevBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
            if (modalNextBtn) modalNextBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
            
            if (modalGalleryTabs) {
                modalGalleryTabs.innerHTML = '';
                modalGalleryTabs.style.display = currentGallery.length > 1 ? 'flex' : 'none';
                currentGallery.forEach((work, idx) => {
                    const pill = document.createElement('button');
                    pill.className = 'gallery-pill' + (idx === 0 ? ' active' : '');
                    pill.textContent = work.title;
                    pill.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        showGalleryItem(idx);
                    });
                    modalGalleryTabs.appendChild(pill);
                });
            }
            
            // Free GPU for video: pause Three.js and background video
            isThreeJSPaused = true;
            document.querySelectorAll('.item-image video').forEach(v => v.pause());

            showGalleryItem(0);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            return;
        }

        // Single Item Mode
        if (modalPrevBtn) modalPrevBtn.style.display = 'none';
        if (modalNextBtn) modalNextBtn.style.display = 'none';
        if (modalGalleryTabs) modalGalleryTabs.style.display = 'none';
        if (modalCounter) modalCounter.textContent = '';

        const isNewLayout = item.classList.contains('portfolio-item-new');
        let title = '';
        let category = '';
        let imgElement = null;

        if (isNewLayout) {
            imgElement = item.querySelector('.item-image img');
            if (item.dataset.title) {
                title = item.dataset.title;
            } else {
                title = 'Project ' + item.querySelector('.item-number').textContent;
            }
            
            const tags = item.querySelectorAll('.item-tags p');
            category = Array.from(tags).map(t => t.textContent).join(', ');
            
        } else {
            const h3 = item.querySelector('h3');
            const p = item.querySelector('p');
            if (h3) title = h3.textContent;
            if (p) category = p.textContent;
            imgElement = item.querySelector('.placeholder-img');
        }
        
        modalTitle.textContent = title;
        modalCategory.textContent = category;
        
        // Free GPU for video: pause Three.js and background video
        isThreeJSPaused = true;
        document.querySelectorAll('.item-image video').forEach(v => v.pause());

        const singleIframe = modalIframe || document.querySelector('.modal-iframe');
        if (singleIframe) {
            singleIframe.style.display = 'none';
            singleIframe.src = '';
        }

        if (item.dataset.video) {
            if (modalImg) modalImg.style.display = 'none';
            if (modalVideo) {
                modalVideo.style.display = 'block';
                if (!modalVideo.src.endsWith(item.dataset.video)) {
                    modalVideo.src = item.dataset.video;
                    modalVideo.load();
                }
                modalVideo.currentTime = 0;
                modalVideo.play().catch(() => {});
            }
        } else {
            if (modalVideo) {
                modalVideo.onerror = null;
                modalVideo.pause();
                modalVideo.style.display = 'none';
                modalVideo.removeAttribute('src');
                modalVideo.load();
            }
            if (modalImg) {
                modalImg.style.display = 'block';
                if (imgElement && imgElement.tagName.toLowerCase() === 'img') {
                    modalImg.style.background = `url("${imgElement.src}") center/contain no-repeat`;
                } else if (imgElement) {
                    const bgGradient = window.getComputedStyle(imgElement).background;
                    modalImg.style.background = bgGradient;
                } else if (item.dataset.img) {
                    modalImg.style.background = `url("${item.dataset.img}") center/contain no-repeat`;
                }
            }
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

const closeModal = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentGallery = null;
    if (modalVideo) {
        modalVideo.onerror = null;
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.load();
    }
    const iframeEl = modalIframe || document.querySelector('.modal-iframe');
    if (iframeEl) {
        iframeEl.style.display = 'none';
        iframeEl.src = '';
    }
    // Resume Three.js 3D background
    isThreeJSPaused = false;
    if (typeof resumeThreeJS === 'function') resumeThreeJS();
    // Resume background card videos
    document.querySelectorAll('.item-image video').forEach(v => v.play().catch(() => {}));
};

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Toggle Fullscreen on video click (First click enters fullscreen, next click exits)
if (modalVideo) {
    modalVideo.controls = false;
    modalVideo.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modalVideo.paused) {
            modalVideo.muted = true;
            modalVideo.play().catch(() => {});
            return;
        }
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (modalVideo.requestFullscreen) {
                modalVideo.requestFullscreen().catch(() => {});
            } else if (modalVideo.webkitRequestFullscreen) {
                modalVideo.webkitRequestFullscreen();
            } else if (modalVideo.msRequestFullscreen) {
                modalVideo.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });
}

// Toggle Fullscreen on image click
if (modalImg) {
    modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (modalImg.requestFullscreen) {
                modalImg.requestFullscreen().catch(() => {});
            } else if (modalImg.webkitRequestFullscreen) {
                modalImg.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                return; // Let browser exit fullscreen first
            }
            closeModal();
        } else if (e.key === 'ArrowLeft' && currentGallery) {
            showGalleryItem(currentGalleryIndex - 1);
        } else if (e.key === 'ArrowRight' && currentGallery) {
            showGalleryItem(currentGalleryIndex + 1);
        }
    }
});

// Contact Form & Direct Contacts Modal
const contactForm = document.querySelector('.contact-form');
const contactModal = document.getElementById('contact-modal');
const contactModalClose = document.getElementById('contact-modal-close');

function openContactModal(name, msg) {
    if (!contactModal) return;
    
    // If visitor filled out the form, pre-populate message for WhatsApp
    const modalWaBtn = document.getElementById('modal-wa-btn');
    if (modalWaBtn) {
        const baseWa = modalWaBtn.getAttribute('data-base-href') || 'https://wa.me/992900444066';
        if (msg || name) {
            const textParam = encodeURIComponent(`Здравствуйте, Мухаммадризо! Меня зовут ${name || 'Клиент'}. ${msg || ''}`.trim());
            modalWaBtn.href = `${baseWa}?text=${textParam}`;
        } else {
            modalWaBtn.href = baseWa;
        }
    }

    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const msgInput = document.getElementById('message');
        const name = nameInput ? nameInput.value.trim() : '';
        const msg = msgInput ? msgInput.value.trim() : '';
        openContactModal(name, msg);
    });
}

if (contactModalClose) {
    contactModalClose.addEventListener('click', closeContactModal);
}

if (contactModal) {
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });
}

// Close contact modal on Escape
window.addEventListener('keydown', (e) => {
    if (contactModal && contactModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeContactModal();
        }
    }
});

// Custom cursor hover support for newly added elements
const newHoverItems = document.querySelectorAll('.quick-contact-badge, .contact-channel-item, #contact-modal-close, .footer-link');
newHoverItems.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
        if (follower) follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
        if (follower) follower.classList.remove('hover');
    });
});

// Auto-retry portfolio images if network drops during parallel loading
document.querySelectorAll('.item-image img').forEach(img => {
    const rawAttr = img.getAttribute('src');
    if (rawAttr) {
        img.src = encodeURI(rawAttr);
    }
    img.addEventListener('error', function onImgError() {
        const retryCount = parseInt(img.dataset.retry || '0', 10);
        if (retryCount < 3 && rawAttr) {
            img.dataset.retry = String(retryCount + 1);
            setTimeout(() => {
                img.src = encodeURI(rawAttr) + '?retry=' + (retryCount + 1);
            }, 800 * (retryCount + 1));
        }
    });
});

