document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME SWITCHER LOGIC
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = savedTheme || systemTheme;
    
    // Initialize theme
    htmlElement.setAttribute('data-theme', activeTheme);
    
    // Toggle theme callback
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Minor hover animation trigger
        themeToggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggleBtn.style.transform = 'scale(1) rotate(15deg)';
        }, 100);
    });

    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('open');
        mobileMenuOverlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };
    
    const closeMobileMenu = () => {
        mobileMenuBtn.classList.remove('open');
        mobileMenuOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            // Smooth scroll navigation handled by css-scroll-behavior
        });
    });

    // Close mobile menu if window is resized above mobile threshold
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // ==========================================================================
    // SCROLL SPY (HIGHLIGHT ACTIVE NAV LINK)
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 200; // Offset for navbar height and visual triggers
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', scrollSpy);
    // Initial call to set active nav link based on load position
    scrollSpy();

    // ==========================================================================
    // INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, revealOptions);
    
    fadeSections.forEach(section => {
        revealObserver.observe(section);
    });

    // ==========================================================================
    // SECURE OBFUSCATED EMAIL FORM SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    
    // Base64 encoded email address: '2007alvi@gmail.com' -> 'MjAwN2FsdmlAZ21haWwuY29t'
    const obfuscatedEmailToken = 'MjAwN2FsdmlAZ21haWwuY29t';
    
    const decryptEmail = (token) => {
        try {
            return atob(token);
        } catch (e) {
            console.error("Failed to decrypt target address", e);
            return null;
        }
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Retrieve inputs
        const nameVal = document.getElementById('contact-name').value.trim();
        const emailVal = document.getElementById('contact-email').value.trim();
        const subjectVal = document.getElementById('contact-subject').value.trim();
        const messageVal = document.getElementById('contact-message').value.trim();
        
        if (!nameVal || !emailVal || !subjectVal || !messageVal) {
            alert("Please fill out all the fields before sending.");
            return;
        }
        
        // Decrypt the email securely
        const targetEmail = decryptEmail(obfuscatedEmailToken);
        
        if (!targetEmail) {
            alert("An error occurred. Please contact via social profiles.");
            return;
        }
        
        // Show visual processing feedback
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Preparing Mail Client... <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.8';
        
        // Construct mail client link properties
        const emailSubject = `[Portfolio Contact] ${subjectVal}`;
        const emailBody = `Hi Alvi,\n\nYou received a new message from your Portfolio website:\n\n` +
                          `Name: ${nameVal}\n` +
                          `Email: ${emailVal}\n\n` +
                          `Message:\n${messageVal}\n\n` +
                          `Best regards,\n${nameVal}`;
        
        // Trigger mailto redirection
        setTimeout(() => {
            const mailtoURL = `mailto:${targetEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoURL;
            
            // Restore button feedback
            submitBtn.innerHTML = 'Decrypted & Sent! <i class="fa-solid fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
        }, 1200);
    });
});
