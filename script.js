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
  const revealElements = document.querySelectorAll('.about, .portfolio, .contact, .section-title, .skills, .contact-info, .contact-form, .portfolio-item');
  
  const revealOnScroll = () => {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        if (element.classList.contains('portfolio-item')) {
          element.classList.add('fade-in', 'visible');
        } else {
          element.classList.add('fade-in', 'visible');
        }
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check on load

  // Typing Effect for Hero Section
  const words = [
    "Visual Futures",
    "Intuitive Systems",
    "Digital Stories",
    "Immersive Brands",
    "Human Interfaces",
    "AI Experiences"
  ];
  
  const typingText = document.getElementById('typingText');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;
  let pauseBetweenWords = 2000;

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Remove character
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Add character
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
    }
    
    // Word completed
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = pauseBetweenWords;
    }
    
    // Delete completed
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 300;
    }
    
    setTimeout(typeEffect, typingSpeed);
  }
  
  // Start typing effect after hero animation
  setTimeout(typeEffect, 1500);

  // Load Projects from JSON
  fetch('projects.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(projects => {
      console.log('Projects loaded successfully:', projects.length);
      renderPortfolio(projects);
      setupModalListeners();
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      // Show fallback content with visible projects
      renderFallbackProjects();
    });

  // Render Portfolio
  function renderPortfolio(projects) {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const modalsContainer = document.getElementById('modalsContainer');

    let portfolioHTML = '';
    let modalsHTML = '';

    projects.forEach((project, index) => {
      // Portfolio Item with better fallback
      portfolioHTML += `
        <div class="portfolio-item fade-in" data-modal="${project.id}" style="background: linear-gradient(135deg, #1a1a1a 0%, #00b894 100%); min-height: 300px; display: flex; align-items: end;">
          <img src="${project.coverImage}" alt="${project.title}" class="portfolio-img" loading="lazy" 
               onload="this.parentElement.style.background=''; this.style.display='block';"
               onerror="this.style.display='none'; this.parentElement.querySelector('.portfolio-overlay').style.opacity='1'; this.parentElement.querySelector('.portfolio-overlay').style.background='linear-gradient(transparent, rgba(0, 184, 148, 0.9))'">
          <div class="portfolio-overlay" style="opacity: 0.8;">
            <h3>${project.title}</h3>
            <p>${project.tech.slice(0, 2).join(' + ')}</p>
          </div>
        </div>
      `;

      // Modal
      let framesHTML = '';
      project.frames.forEach((frame) => {
        let mediaHTML = '';

        if (frame.video) {
          mediaHTML = `
            <video controls class="frame-video" preload="metadata">
              <source src="${frame.video}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `;
        } else if (frame.gif) {
          mediaHTML = `<img src="${frame.gif}" alt="${frame.section}" class="frame-gif" loading="lazy">`;
        } else if (frame.image) {
          mediaHTML = `<img src="${frame.image}" alt="${frame.section}" class="frame-image" loading="lazy">`;
        }

        framesHTML += `
          <div class="modal-frame">
            <h4>${frame.section}</h4>
            <p>${frame.text}</p>
            ${mediaHTML}
            ${frame.note ? `<small class="frame-note">${frame.note}</small>` : ''}
          </div>
        `;
      });

      modalsHTML += `
        <div id="${project.id}" class="modal">
          <div class="modal-content case-study">
            <span class="close">&times;</span>
            <div class="modal-frames">
              ${framesHTML}
            </div>
            <div class="modal-tech-footer">
              <strong>Tech:</strong> ${project.tech.join(', ')}
              <div>
                <a href="${project.demoUrl}" class="btn btn-outline">Live Demo</a>
                <a href="${project.sourceUrl}" class="btn btn-primary">Source Code</a>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    portfolioGrid.innerHTML = portfolioHTML;
    modalsContainer.innerHTML = modalsHTML;
  }

  // Fallback Projects Function
  function renderFallbackProjects() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    const fallbackProjects = [
      {
        title: "Lumen — Brand Identity & Digital Style System",
        tech: ["Illustrator", "Photoshop", "Figma"],
        id: "fallback1"
      },
      {
        title: "FixOFF – AI-Driven Branding & Digital Experience", 
        tech: ["MidJourney", "Figma", "After Effects"],
        id: "fallback2"
      },
      {
        title: "Aurora Tea Co. – Digital Content Campaign",
        tech: ["Photoshop", "Illustrator", "Figma"],
        id: "fallback3"
      },
      {
        title: "FlowBank Mobile App Redesign",
        tech: ["Figma", "Illustrator", "Prototyping"], 
        id: "fallback4"
      },
      {
        title: "Pulsewave Motion Graphics Intro",
        tech: ["After Effects", "Premiere Pro"],
        id: "fallback5"
      },
      {
        title: "Crochet by Alia Fazil",
        tech: ["Adobe Illustrator", "Photoshop"],
        id: "fallback6"
      }
    ];

    let portfolioHTML = '';
    fallbackProjects.forEach((project, index) => {
      const gradients = [
        '#00b894', '#9b59b6', '#27ae60', '#3498db', '#f39c12', '#e67e22'
      ];
      portfolioHTML += `
        <div class="portfolio-item fade-in" style="background: linear-gradient(135deg, #1a1a1a 0%, ${gradients[index]} 100%); min-height: 300px; display: flex; align-items: end; cursor: pointer;">
          <div class="portfolio-overlay" style="opacity: 1; background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));">
            <h3>${project.title}</h3>
            <p>${project.tech.slice(0, 2).join(' + ')}</p>
          </div>
        </div>
      `;
    });
    
    portfolioGrid.innerHTML = portfolioHTML + `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #00b894;">
        <p>Portfolio projects loaded with fallback styling. Images will appear when available.</p>
      </div>
    `;
  }

  // Modal Listeners
  function setupModalListeners() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
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
          document.body.style.overflow = '';
        }, 300);
      });
    });

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
  }

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
    
    alert('Message sent successfully! I will get back to you soon.');
    contactForm.reset();
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});