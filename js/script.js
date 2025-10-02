document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.classList.remove('no-js');

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

// Preloader
    window.addEventListener('load', function() {
        setTimeout(function() {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }, 1000);
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const headerH = document.querySelector('header')?.offsetHeight || 0;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - headerH,
                behavior: 'smooth'
            });
            }
        });
    });

    // Scroll animations with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Counter animation for values section
if (entry.target.classList.contains('value-item')) {
    const counter = entry.target.querySelector('.counter');
    if (counter && !counter.classList.contains('animated')) {
        counter.classList.add('animated');
        
        const updateCounter = () => {
            const targetValue = counter.getAttribute('data-target');

            // Handle the special case for infinity
            if (targetValue === '∞') {
                counter.textContent = targetValue;
                return; // Stop execution for this counter
            }

            // Proceed with normal numeric animation
            const target = +targetValue;
            let count = 0;
            const increment = target / 100;
            
            const countUp = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    setTimeout(countUp, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            countUp();
        };
        
        updateCounter();
    }
}
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.about-text, .about-image, .team-member, .value-item, .ingredient-card, .cocktail-card');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });

    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // --- PRODUCT PAGE SPECIFIC SCRIPTS ---
    
    // Image gallery functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');

    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const imageSrc = this.getAttribute('data-image');
                mainImage.style.backgroundImage = `url('${imageSrc}')`;
                
                // Update active thumbnail
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Set initial main image
        const initialImageSrc = document.querySelector('.thumbnail.active').getAttribute('data-image');
        mainImage.style.backgroundImage = `url('${initialImageSrc}')`;

        // Open modal when clicking on main image
        mainImage.addEventListener('click', function() {
            if(modal && modalImage) {
                const bgImage = window.getComputedStyle(mainImage).backgroundImage;
                const imageUrl = bgImage.slice(5, -2);
                modalImage.src = imageUrl;
                modal.classList.add('active');
            }
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if(modal) modal.classList.remove('active');
        });
    }
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            if(modal) modal.classList.remove('active');
        }
    });

// Modale immagine: Esc, focus trap, ripristino focus, overlay click
(function(){
  const modal    = document.getElementById('imageModal');
  const closeBtn = document.getElementById('closeModal');
  const modalImg = document.getElementById('modalImage');
  const zoomIcon = document.querySelector('.zoom-icon');
  let lastFocused = null;

  function focusables(){
    return modal ? Array.from(modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )) : [];
  }

  function openModal(){
    if (!modal) return;
    // se non c'è già un'immagine nel modale, prova a usare la thumb attiva
    if (modalImg && !modalImg.getAttribute('src')) {
      const active = document.querySelector('.thumbnail.active');
      const src = active?.getAttribute('data-image');
      if (src) modalImg.setAttribute('src', src);
    }
    lastFocused = document.activeElement;
    modal.classList.add('active');
    (focusables()[0] || closeBtn || modal).focus();
  }

  function closeModal(){
    if (!modal) return;
    modal.classList.remove('active');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // Apri dal pulsante lente (zoom)
  zoomIcon && zoomIcon.addEventListener('click', openModal);

  // Chiudi con X e clic su overlay
  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e)=>{ if (e.target === modal) closeModal(); });

  // Esc + focus trap
  document.addEventListener('keydown', (e)=>{
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape'){
      e.preventDefault();
      closeModal();
    }
    if (e.key === 'Tab'){
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first){
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last){
        e.preventDefault(); first.focus();
      }
    }
  });

  // Accessibilità tastiera sulla X (Enter/Space)
  closeBtn && closeBtn.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeModal(); }
  });
})();

// --- MOBILE NAV ---
const headerEl   = document.querySelector('header');
const navEl      = headerEl?.querySelector('nav#primary-navigation');
const toggleBtn  = headerEl?.querySelector('.nav-toggle');
const overlayEl  = document.querySelector('.nav-overlay');

function closeNav(){
  if(!navEl) return;
  navEl.classList.remove('open');
  toggleBtn?.setAttribute('aria-expanded', 'false');
  overlayEl?.classList.remove('active');
  overlayEl?.setAttribute('hidden', '');
  document.body.classList.remove('no-scroll');
}

function openNav(){
  if(!navEl) return;
  navEl.classList.add('open');
  toggleBtn?.setAttribute('aria-expanded', 'true');
  overlayEl?.classList.add('active');
  overlayEl?.removeAttribute('hidden');
  document.body.classList.add('no-scroll');
}

toggleBtn?.addEventListener('click', () => {
  const isOpen = navEl?.classList.contains('open');
  isOpen ? closeNav() : openNav();
});

// Chiudi con overlay o clic su un link del menu
overlayEl?.addEventListener('click', closeNav);
navEl?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNav);
});

// ESC per chiudere e focus di ritorno sul toggle
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && navEl?.classList.contains('open')){
    closeNav();
    toggleBtn?.focus();
  }
});

});