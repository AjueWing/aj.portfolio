// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Sticky Navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.about, .portfolio, .contact, .section-title, .skills, .contact-info, .contact-form');
  
  const revealOnScroll = () => {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        element.classList.add('fade-in', 'visible');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check on load

  // Portfolio Modal Functionality
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const modalId = item.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
      }, 300);
    });
  });

  // Close modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }, 300);
      }
    });
  });

  // Back to Top Button
  const backToTopButton = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Form Validation
  const contactForm = document.getElementById('contactForm');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // In a real scenario, you would send the form data to a server
    alert('Message sent successfully! I will get back to you soon.');
    contactForm.reset();
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Lazy Loading Images (for better performance)
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for older browsers
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
});