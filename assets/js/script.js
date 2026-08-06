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
    }, { threshold: 0.1, rootMargin: '0px 0px -25% 0px' });

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

        // Load all frames concurrently to drastically speed up preloading
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        // Display the first frame as soon as it's ready
        images[0].onload = () => {
            ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
        };
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
            const movingBg = document.querySelector('.moving-journey-background');
            const frameImg = document.querySelector('.train-compartment-frame');
            
            if (progress >= 0.45) {
                let crossfade = mapProgress(progress, 0.45, 0.5, 0, 1);
                if (movingBg) movingBg.style.opacity = crossfade;
                if (frameImg) frameImg.style.opacity = crossfade;
                if (canvas) canvas.style.opacity = 1 - crossfade;
            } else {
                if (movingBg) movingBg.style.opacity = 0;
                if (frameImg) frameImg.style.opacity = 0;
                if (canvas) canvas.style.opacity = 1;
            }

            // 1. Text Sequence (0.5 to 0.65)
            let textOpacity = mapProgress(progress, 0.5, 0.55, 0, 1);
            let textBlur = mapProgress(progress, 0.5, 0.55, 10, 0);
            let textX = 0;

            if (progress > 0.6) {
                textOpacity = mapProgress(progress, 0.6, 0.65, 1, 0);
                textBlur = mapProgress(progress, 0.6, 0.65, 0, 20);
                textX = mapProgress(progress, 0.6, 0.65, 0, -120);
            }

            trainText.style.opacity = textOpacity;
            trainText.style.filter = `blur(${textBlur}px)`;
            trainText.style.transform = `translateX(${textX}vw)`;
            trainText.style.pointerEvents = textOpacity > 0.5 ? 'auto' : 'none';

            // 2. Gujarat Sequence (0.6 to 0.75)
            let gujOpacity = mapProgress(progress, 0.6, 0.65, 0, 1);
            let gujScale = mapProgress(progress, 0.6, 0.65, 0.8, 1);
            let gujX = mapProgress(progress, 0.6, 0.65, 120, 0);

            if (progress > 0.7) {
                gujOpacity = mapProgress(progress, 0.7, 0.75, 1, 0);
                gujX = mapProgress(progress, 0.7, 0.75, 0, -120);
            }

            postcardGujarat.style.opacity = gujOpacity;
            postcardGujarat.style.transform = `translateX(${gujX}vw) scale(${gujScale})`;
            postcardGujarat.style.pointerEvents = gujOpacity > 0.5 && gujX === 0 ? 'auto' : 'none';

            // 3. Goa Sequence (0.7 to 0.85)
            let goaOpacity = mapProgress(progress, 0.7, 0.75, 0, 1);
            let goaScale = mapProgress(progress, 0.7, 0.75, 0.8, 1);
            let goaX = mapProgress(progress, 0.7, 0.75, 120, 0);

            if (progress > 0.8) {
                goaOpacity = mapProgress(progress, 0.8, 0.85, 1, 0);
                goaX = mapProgress(progress, 0.8, 0.85, 0, -120);
            }

            postcardGoa.style.opacity = goaOpacity;
            postcardGoa.style.transform = `translateX(${goaX}vw) scale(${goaScale})`;
            postcardGoa.style.pointerEvents = goaOpacity > 0.5 && goaX === 0 ? 'auto' : 'none';

            // 4. Mumbai Sequence (0.8 to 1.0)
            let mumOpacity = mapProgress(progress, 0.8, 0.85, 0, 1);
            let mumScale = mapProgress(progress, 0.8, 0.85, 0.8, 1);
            let mumX = mapProgress(progress, 0.8, 0.85, 120, 0);

            postcardMumbai.style.opacity = mumOpacity;
            postcardMumbai.style.transform = `translateX(${mumX}vw) scale(${mumScale})`;
            postcardMumbai.style.pointerEvents = mumOpacity > 0.5 && mumX === 0 ? 'auto' : 'none';
        });
    }

    // Video Overlay Logic
    const trainJourney = document.querySelector('.train-journey');
    const exploreBtns = document.querySelectorAll('.postcard-explore-btn');
    const videoOverlay = document.querySelector('.train-journey-video-overlay');
    const closeVideoBtn = document.querySelector('.close-video-btn');
    const videoIframe = document.querySelector('.video-iframe-container iframe');

    if (exploreBtns.length > 0 && videoOverlay && closeVideoBtn) {
        exploreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                videoOverlay.classList.add('active');
                if (trainJourney) {
                    trainJourney.classList.add('video-open');
                }
            });
        });

        closeVideoBtn.addEventListener('click', () => {
            videoOverlay.classList.remove('active');
            if (trainJourney) {
                trainJourney.classList.remove('video-open');
            }
            // Pause video when closing by resetting the src
            if (videoIframe) {
                const src = videoIframe.src;
                videoIframe.src = src;
            }
        });
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
