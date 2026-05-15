function initCursorGlow() {
  const cursor = document.querySelector('.cursor-glow') as HTMLElement;
  if (!cursor) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animate() {
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  const hoverTargets = document.querySelectorAll('a, button, .project-link, .tech-badge, .contact-link, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      
      if (target) {
        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.project-item, .certification-card, .skill-group').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  let ticking = false;
  
  function highlightNav() {
    let current = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(highlightNav);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  highlightNav();
}

function initStatsCounter() {
  const statValues = document.querySelectorAll('.stat-value');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateValue(entry.target as HTMLElement);
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(stat => observer.observe(stat));
  
  function animateValue(element: HTMLElement) {
    const text = element.textContent || '';
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/\D/g, ''));
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        element.textContent = number + (hasPercent ? '%' : '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (hasPercent ? '%' : '');
      }
    }, 30);
  }
}

function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar') as HTMLElement;
  if (!progressBar) return;
  
  let ticking = false;
  
  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    const scrollableHeight = documentHeight - windowHeight;
    const scrollPercentage = (scrollTop / scrollableHeight) * 100;
    
    progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
    
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
}

function checkPerformance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    return false;
  }
  return true;
}

const canAnimate = checkPerformance();

initSmoothScroll();
initNavHighlight();
initScrollProgress();

if (canAnimate) {
  initCursorGlow();
  initScrollAnimations();
  initStatsCounter();
}

console.log('%c Portfolio loaded successfully! ', 'background: #14b8a6; color: #0a0e14; padding: 4px 8px; border-radius: 4px;');
console.log('%c Built by Sebastian Solares ', 'color: #14b8a6;');
