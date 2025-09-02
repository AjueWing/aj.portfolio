// script.js
document.addEventListener('DOMContentLoaded', function () {
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

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });

        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.about, .portfolio, .contact, .section-title');
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
  revealOnScroll();

  // Load Projects from JSON
  fetch('projects.json')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load projects.json');
      return response.json();
    })
    .then((projects) => {
      renderPortfolio(projects);
      setupModalListeners();
    })
    .catch((error) => {
      console.error('Error loading projects:', error);
      document.getElementById('portfolioGrid').innerHTML = `
        <p style="color: #ccc; grid-column: 1/-1; text-align: center;">
          Failed to load projects. Check console or file path.
        </p>
      `;
    });

  // === RENDER PORTFOLIO ===
  function renderPortfolio(projects) {
  const portfolioGrid = document.getElementById('portfolioGrid');
  const modalsContainer = document.getElementById('modalsContainer');

  let portfolioHTML = '';
  let modalsHTML = '';

  projects.forEach((project) => {
    // Portfolio Grid Item
    portfolioHTML += `
      <div class="portfolio-item" data-modal="${project.id}">
        <img src="${project.coverImage}" alt="${project.title}" class="portfolio-img" loading="lazy">
        <div class="portfolio-overlay">
          <h3>${project.title}</h3>
          <p>${project.tech.slice(0, 2).join(' + ')}</p>
        </div>
      </div>
    `;

    // Build Frames for Modal
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

    // Full Modal
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

  // === MODAL LISTENERS ===
  function setupModalListeners() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    portfolioItems.forEach((item) => {
      item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('show'), 10);
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.classList.remove('show');
        setTimeout(() => {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }, 300);
      });
    });

    modals.forEach((modal) => {
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

  // === Back to Top ===
  const backToTopButton = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === Form Validation ===
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
    alert('Message sent successfully!');
    contactForm.reset();
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
