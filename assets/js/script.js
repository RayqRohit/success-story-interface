document.addEventListener("DOMContentLoaded", function() {
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
});
