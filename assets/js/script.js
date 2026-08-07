// Preload the hero background image for faster perceived performance
const heroBgPreload = new Image();
heroBgPreload.src = 'assets/images/hero/student-success-section-background.webp';

document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px', 
        threshold: 0.7 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const section = entry.target.closest('.success-story-submission-section');
            if (section) {
                if (entry.isIntersecting) {
                    section.classList.add('in-view');
                } else {
                    section.classList.remove('in-view');
                }
            }
        });
    }, observerOptions);

    const postBox = document.querySelector('.success-story-submission-post-box-img');
    if (postBox) {
        observer.observe(postBox);
    }

    // Blur Reveal Observer
    const blurObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Only play once
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -35% 0px' });

    const impactSection = document.querySelector('.success-story-impact-section');
    if (impactSection) blurObserver.observe(impactSection);

    // Scroll-Linked Animation for Train Journey
    const trainScrollContainer = document.querySelector('.train-journey-scroll-container');
    const trainText = document.querySelector('.train-journey-text');
    const postcardGujarat = document.querySelector('.postcard-gujarat');
    const postcardGoa = document.querySelector('.postcard-goa');
    const postcardMumbai = document.querySelector('.postcard-mumbai');

    // Canvas setup for frames
    const canvas = document.getElementById('journey-frames-canvas');
    let ctx = null;
    const frameCount = 193; // 0 to 192
    const currentFrame = index => `assets/images/journey-frames/frame_${index.toString().padStart(5, '0')}.webp`;
    const images = [];

    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.width = 1920;
        canvas.height = 1080;

        // Load the first frame immediately so it displays right away
        const firstFrame = new Image();
        firstFrame.src = currentFrame(0);
        images.push(firstFrame);
        
        firstFrame.onload = () => {
            ctx.drawImage(firstFrame, 0, 0, canvas.width, canvas.height);
        };

        // Fill the rest of the array with nulls temporarily
        for (let i = 1; i < frameCount; i++) {
            images.push(null);
        }

        // Load all other frames quietly in the background AFTER the page has fully loaded
        // This stops the browser tab's loading spinner from spinning endlessly!
        window.addEventListener('load', () => {
            for (let i = 1; i < frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images[i] = img;
            }
        });
    }

    if (trainScrollContainer && trainText && postcardGujarat) {
        window.addEventListener('scroll', () => {
            const rect = trainScrollContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            let progress = 0;
            const totalScrollable = rect.height - windowHeight;

            if (rect.top <= 0) {
                progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
            }

            const mapProgress = (p, start, end, minVal, maxVal) => {
                if (p <= start) return minVal;
                if (p >= end) return maxVal;
                return minVal + ((p - start) / (end - start)) * (maxVal - minVal);
            };

            // 0. Frame Sequence (0 to 0.5)
            if (canvas && images.length > 0) {
                let frameProgress = mapProgress(progress, 0, 0.5, 0, 1);
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(frameProgress * frameCount)
                );
                
                // Ensure image is fully loaded before drawing
                if (images[frameIndex] && images[frameIndex].complete) {
                    ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
                } else if (images[frameIndex]) {
                    // Fallback to the closest previously loaded frame if scrolling faster than loading
                    for (let i = frameIndex - 1; i >= 0; i--) {
                        if (images[i] && images[i].complete) {
                            ctx.drawImage(images[i], 0, 0, canvas.width, canvas.height);
                            break;
                        }
                    }
                }
            }

            // Crossfade at the end of the frames
            const movingBg = document.querySelector('.moving-journey-background-track');
            const frameImg = document.querySelector('.train-compartment-frame');
            
            if (progress >= 0.45) {
                let canvasFade = mapProgress(progress, 0.45, 0.5, 1, 0);
                if (movingBg) movingBg.style.opacity = 1;
                if (frameImg) frameImg.style.opacity = 1;
                // Fade out the canvas on top to reveal the opaque background properly layered
                if (canvas) canvas.style.opacity = canvasFade;
            } else {
                if (movingBg) movingBg.style.opacity = 0;
                if (frameImg) frameImg.style.opacity = 0;
                if (canvas) canvas.style.opacity = 1;
            }

            // Determine slide distance based on screen size to prevent mobile overlap
            let isMobile = window.innerWidth <= 479;
            let slideInX = isMobile ? 250 : 120;
            let slideOutX = isMobile ? -250 : -120;

            // Decouple from continuous scrolling: Use discrete states
            // State 0: Intro text
            // State 1: Gujarat
            // State 2: Goa
            // State 3: Mumbai

            let state = -1;
            if (progress >= 0.5 && progress < 0.6) state = 0;
            else if (progress >= 0.6 && progress < 0.72) state = 1;
            else if (progress >= 0.72 && progress < 0.83) state = 2;
            else if (progress >= 0.83 && progress <= 1.0) state = 3;

            // 1. Text Sequence
            trainText.style.opacity = state === 0 ? 1 : 0;
            trainText.style.filter = state === 0 ? 'blur(0px)' : 'blur(10px)';
            if (state === 0) trainText.style.transform = `translateX(0vw)`;
            else if (state > 0) trainText.style.transform = `translateX(-120vw)`;
            else trainText.style.transform = `translateX(120vw)`;
            trainText.style.pointerEvents = state === 0 ? 'auto' : 'none';

            // 2. Gujarat Sequence
            postcardGujarat.style.opacity = state === 1 ? 1 : 0;
            if (state === 1) postcardGujarat.style.transform = `translateX(0vw) scale(1)`;
            else if (state > 1) postcardGujarat.style.transform = `translateX(-120vw) scale(0.8)`;
            else postcardGujarat.style.transform = `translateX(120vw) scale(0.8)`;
            postcardGujarat.style.pointerEvents = state === 1 ? 'auto' : 'none';
            if (state === 1) postcardGujarat.classList.add('active-snap');
            else postcardGujarat.classList.remove('active-snap');

            // 3. Goa Sequence
            postcardGoa.style.opacity = state === 2 ? 1 : 0;
            if (state === 2) postcardGoa.style.transform = `translateX(0vw) scale(1)`;
            else if (state > 2) postcardGoa.style.transform = `translateX(-120vw) scale(0.8)`;
            else postcardGoa.style.transform = `translateX(120vw) scale(0.8)`;
            postcardGoa.style.pointerEvents = state === 2 ? 'auto' : 'none';

            // 4. Mumbai Sequence
            postcardMumbai.style.opacity = state === 3 ? 1 : 0;
            if (state === 3) postcardMumbai.style.transform = `translateX(0vw) scale(1)`;
            else if (state > 3) postcardMumbai.style.transform = `translateX(-120vw) scale(0.8)`;
            else postcardMumbai.style.transform = `translateX(120vw) scale(0.8)`;
            postcardMumbai.style.pointerEvents = state === 3 ? 'auto' : 'none';



            // Add dashed border to Goa and Mumbai when active
            if (state === 2) postcardGoa.classList.add('active-snap');
            else postcardGoa.classList.remove('active-snap');

            if (state === 3) postcardMumbai.classList.add('active-snap');
            else postcardMumbai.classList.remove('active-snap');
        });
    }

    // Video Overlay Logic
    const trainJourney = document.querySelector('.train-journey');
    const exploreBtns = document.querySelectorAll('.postcard-explore-btn');
    const videoOverlay = document.querySelector('.train-journey-video-overlay');
    const videoBackdrop = document.querySelector('.train-journey-video-backdrop');
    const closeVideoBtn = document.querySelector('.close-video-btn');
    const videoIframe = document.querySelector('.video-iframe-container iframe');

    if (exploreBtns.length > 0 && videoOverlay && closeVideoBtn) {
        exploreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get the unique video source from the button clicked
                const newSrc = btn.getAttribute('data-video-src');
                if (newSrc && videoIframe) {
                    videoIframe.src = newSrc;
                }

                if (videoBackdrop) videoBackdrop.classList.add('active');
                videoOverlay.classList.add('active');
                if (trainJourney) {
                    trainJourney.classList.add('video-open');
                }
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        closeVideoBtn.addEventListener('click', () => {
            if (videoBackdrop) videoBackdrop.classList.remove('active');
            videoOverlay.classList.remove('active');
            if (trainJourney) {
                trainJourney.classList.remove('video-open');
            }
            document.body.style.overflow = ''; // Restore background scrolling
            // Stop video when closing by clearing the src
            if (videoIframe) {
                videoIframe.src = '';
            }
        });
        
        // Also close the video if the user clicks on the backdrop
        if (videoBackdrop) {
            videoBackdrop.addEventListener('click', () => {
                closeVideoBtn.click();
            });
        }
    }

    // Navbar Scroll Logic
    const navbarSection = document.querySelector('.success-story-navbar-section');
    let lastScrollY = window.scrollY;

    if (navbarSection) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scrolling down
                navbarSection.classList.add('scrolled');
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                navbarSection.classList.remove('scrolled');
            }
            // Optional: reset if at the very top
            if (currentScrollY <= 0) {
                navbarSection.classList.remove('scrolled');
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }
});
