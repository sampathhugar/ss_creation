document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Drawer Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('drawer-close');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scrolling
    };

    mobileToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    // 2. Sticky Header and Nav active states on scroll
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky Navbar Toggle
        if (scrollPos > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Active Navigation link updates
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Adjusted for sticky header height
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });


    // 3. Back to Top Button visibility
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // 4. Scroll Reveal Intersection Observer
    const revealItems = document.querySelectorAll('.reveal-item');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Unobserve after revealing
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // offset trigger point slightly
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });


    // 5. Enquiry Form Handler with Success Popup
    const enquiryForm = document.getElementById('enquiry-form');
    const formSuccess = document.getElementById('form-success');
    const closeSuccess = document.getElementById('close-success');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check (HTML5 handles most of it)
            const nameInput = document.getElementById('user-name').value.trim();
            const phoneInput = document.getElementById('user-phone').value.trim();
            const emailInput = document.getElementById('user-email').value.trim();
            const messageInput = document.getElementById('user-message').value.trim();

            if (!nameInput || !phoneInput || !emailInput || !messageInput) {
                alert('Please fill in all required fields.');
                return;
            }

            // Log form data to console for testing/debugging
            const formData = new FormData(enquiryForm);
            console.log('Enquiry Form Submitted:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // Trigger success overlay animation
            formSuccess.classList.add('active');
        });
    }

    if (closeSuccess) {
        closeSuccess.addEventListener('click', () => {
            formSuccess.classList.remove('active');
            // Reset the form
            enquiryForm.reset();
        });
    }


    // 6. Number Counter Animation for About Stats
    const statsNumbers = document.querySelectorAll('.stat-num');
    
    const countUpCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValAttr = target.getAttribute('data-val');
                
                if (endValAttr) {
                    const endVal = parseInt(endValAttr, 10);
                    let currentVal = 0;
                    const duration = 1500; // ms
                    const increment = endVal / (duration / 16); // ~60fps
                    
                    const counter = setInterval(() => {
                        currentVal += increment;
                        if (currentVal >= endVal) {
                            target.textContent = endVal + (endVal === 10 ? '+' : '');
                            clearInterval(counter);
                        } else {
                            target.textContent = Math.floor(currentVal) + (endVal === 10 ? '+' : '');
                        }
                    }, 16);
                }
                observer.unobserve(target);
            }
        });
    };

    const countUpObserver = new IntersectionObserver(countUpCallback, {
        threshold: 0.5
    });

    statsNumbers.forEach(stat => {
        countUpObserver.observe(stat);
    });

});
