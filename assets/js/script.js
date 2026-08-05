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

    // Train Journey sticky scroll text animation
    const trainJourney = document.querySelector('.train-journey');
    if (trainJourney) {
        const trainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger when a decent amount of the section is scrolled into view (e.g. it is sticking)
                if (entry.isIntersecting) {
                    entry.target.classList.add('text-visible');
                } else {
                    // Optional: remove class when scrolling away so it animates again next time
                    entry.target.classList.remove('text-visible');
                }
            });
        }, {
            threshold: 0.7 // Trigger when 70% of the section is visible
        });
        trainObserver.observe(trainJourney);
    }

    // Video Overlay Logic
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
