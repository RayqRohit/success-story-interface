// Preload the hero background image for faster perceived performance
const heroBgPreload = new Image();
heroBgPreload.src = 'assets/images/hero/student-success-section-background.jpg';

document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px', // Delay trigger until the element is a bit further up in the viewport
        threshold: 0.7 // Require 70% of the element to be visible before triggering
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class to the parent section to trigger the CSS animation
                const section = entry.target.closest('.success-story-submission-section');
                if (section) {
                    section.classList.add('in-view');
                }
                // Optional: Stop observing once the animation has triggered
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const postBox = document.querySelector('.success-story-submission-post-box-img');
    if (postBox) {
        observer.observe(postBox);
    }

    // Scroll-Linked Animation for Train Journey
    const trainScrollContainer = document.querySelector('.train-journey-scroll-container');
    const trainText = document.querySelector('.train-journey-text');
    const postcardGujarat = document.querySelector('.postcard-gujarat');
    const postcardGoa = document.querySelector('.postcard-goa');
    const postcardMumbai = document.querySelector('.postcard-mumbai');

    if (trainScrollContainer && trainText && postcardGujarat) {
        window.addEventListener('scroll', () => {
            const rect = trainScrollContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress from 0 to 1
            // Starts when top of container hits top of window
            // Ends when bottom of container hits bottom of window
            let progress = 0;
            const totalScrollable = rect.height - windowHeight;
            
            if (rect.top <= 0) {
                progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
            }

            // Helper function to map progress to a value
            const mapProgress = (p, start, end, minVal, maxVal) => {
                if (p <= start) return minVal;
                if (p >= end) return maxVal;
                return minVal + ((p - start) / (end - start)) * (maxVal - minVal);
            };

            // 1. Text Sequence (0 to 0.3)
            let textOpacity = mapProgress(progress, 0, 0.1, 0, 1);
            let textBlur = mapProgress(progress, 0, 0.1, 10, 0);
            let textX = 0;
            
            if (progress > 0.2) {
                textOpacity = mapProgress(progress, 0.2, 0.3, 1, 0);
                textBlur = mapProgress(progress, 0.2, 0.3, 0, 20);
                textX = mapProgress(progress, 0.2, 0.3, 0, -120);
            }
            
            trainText.style.opacity = textOpacity;
            trainText.style.filter = `blur(${textBlur}px)`;
            trainText.style.transform = `translateX(${textX}vw)`;
            trainText.style.pointerEvents = textOpacity > 0.5 ? 'auto' : 'none';

            // 2. Gujarat Sequence (0.25 to 0.55)
            let gujOpacity = 0;
            let gujScale = 0.8;
            let gujX = 0;
            
            if (progress >= 0.25 && progress < 0.55) {
                gujOpacity = mapProgress(progress, 0.25, 0.3, 0, 1);
                gujScale = mapProgress(progress, 0.25, 0.3, 0.8, 1);
                
                if (progress > 0.45) {
                    gujOpacity = mapProgress(progress, 0.45, 0.55, 1, 0);
                    gujX = mapProgress(progress, 0.45, 0.55, 0, -120);
                }
            }
            
            postcardGujarat.style.opacity = gujOpacity;
            postcardGujarat.style.transform = `translateX(${gujX}vw) scale(${gujScale})`;
            postcardGujarat.style.pointerEvents = gujOpacity > 0.5 && gujX === 0 ? 'auto' : 'none';

            // 3. Goa Sequence (0.5 to 0.8)
            let goaOpacity = 0;
            let goaScale = 0.8;
            let goaX = 0;
            
            if (progress >= 0.5 && progress < 0.8) {
                goaOpacity = mapProgress(progress, 0.5, 0.55, 0, 1);
                goaScale = mapProgress(progress, 0.5, 0.55, 0.8, 1);
                
                if (progress > 0.7) {
                    goaOpacity = mapProgress(progress, 0.7, 0.8, 1, 0);
                    goaX = mapProgress(progress, 0.7, 0.8, 0, -120);
                }
            }
            
            postcardGoa.style.opacity = goaOpacity;
            postcardGoa.style.transform = `translateX(${goaX}vw) scale(${goaScale})`;
            postcardGoa.style.pointerEvents = goaOpacity > 0.5 && goaX === 0 ? 'auto' : 'none';

            // 4. Mumbai Sequence (0.75 to 1.0)
            let mumOpacity = 0;
            let mumScale = 0.8;
            
            if (progress >= 0.75) {
                mumOpacity = mapProgress(progress, 0.75, 0.8, 0, 1);
                mumScale = mapProgress(progress, 0.75, 0.8, 0.8, 1);
            }
            
            postcardMumbai.style.opacity = mumOpacity;
            postcardMumbai.style.transform = `scale(${mumScale})`;
            postcardMumbai.style.pointerEvents = mumOpacity > 0.5 ? 'auto' : 'none';
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
});
