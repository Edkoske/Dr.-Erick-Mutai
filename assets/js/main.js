document.addEventListener('DOMContentLoaded',function(){
  // ==== EmailJS integration (optional) ==== 
  // To enable direct sends to an email (e.g., Gmail) via EmailJS:
  // 1. Create an account at https://www.emailjs.com
  // 2. Add an email service (e.g., Gmail) and create templates for contact/volunteer/subscribe
  // 3. Copy your `user ID`, `service ID` and `template IDs` below and set EMAILJS_ENABLED = true
  const EMAILJS_ENABLED = false; // set to true after filling the IDs
  const EMAILJS_USER_ID = 'YOUR_EMAILJS_USER_ID';
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_CONTACT = 'YOUR_TEMPLATE_ID_CONTACT';
  const EMAILJS_TEMPLATE_VOLUNTEER = 'YOUR_TEMPLATE_ID_VOLUNTEER';
  const EMAILJS_TEMPLATE_SUBSCRIBE = 'YOUR_TEMPLATE_ID_SUBSCRIBE';

  function loadEmailJs(cb){
    if(window.emailjs){ cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.emailjs.com/dist/email.min.js';
    s.onload = function(){
      try{ emailjs.init(EMAILJS_USER_ID); }catch(e){}
      cb();
    };
    document.head.appendChild(s);
  }
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if(navToggle && nav){
    navToggle.addEventListener('click',()=>{
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // Volunteer form (simulated submit)
  const volunteerForm = document.getElementById('volunteer-form');
  if(volunteerForm){
    volunteerForm.addEventListener('submit',function(e){
      e.preventDefault();
      const success = document.getElementById('volunteer-success');
      const data = Object.fromEntries(new FormData(volunteerForm).entries());
      if(EMAILJS_ENABLED){
        loadEmailJs(()=>{
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_VOLUNTEER, data)
            .then(()=>{ success.hidden = false; volunteerForm.reset(); })
            .catch(()=>{ success.hidden = false; volunteerForm.reset(); });
        });
      } else {
        success.hidden = false; volunteerForm.reset();
      }
    });
  }

  const subscribeForm = document.getElementById('subscribe-form');
  if(subscribeForm){
    subscribeForm.addEventListener('submit',function(e){
      e.preventDefault();
      const success = document.getElementById('subscribe-success');
      const data = Object.fromEntries(new FormData(subscribeForm).entries());
      if(EMAILJS_ENABLED){
        loadEmailJs(()=>{
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_SUBSCRIBE, data)
            .then(()=>{ success.hidden = false; subscribeForm.reset(); })
            .catch(()=>{ success.hidden = false; subscribeForm.reset(); });
        });
      } else {
        success.hidden = false; subscribeForm.reset();
      }
    });
  }

  // Footer subscribe (if present)
  const footerSubscribe = document.getElementById('footer-subscribe');
  if(footerSubscribe){
    footerSubscribe.addEventListener('submit', function(e){
      e.preventDefault();
      const input = footerSubscribe.querySelector('input[name="email"]');
      const successMessage = document.createElement('div');
      successMessage.className = 'success';
      successMessage.role = 'status';
      successMessage.setAttribute('aria-live','polite');
      successMessage.textContent = 'Subscribed — thank you. Check your inbox for confirmations.';
      footerSubscribe.parentNode.appendChild(successMessage);
      footerSubscribe.reset();
      setTimeout(()=>{ if(successMessage && successMessage.parentNode) successMessage.parentNode.removeChild(successMessage); },5000);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit',function(e){
      e.preventDefault();
      const success = document.getElementById('contact-success');
      const data = Object.fromEntries(new FormData(contactForm).entries());
      if(EMAILJS_ENABLED){
        loadEmailJs(()=>{
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONTACT, data)
            .then(()=>{ success.hidden = false; contactForm.reset(); })
            .catch(()=>{ success.hidden = false; contactForm.reset(); });
        });
      } else {
        success.hidden = false; contactForm.reset();
      }
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // Reveal on scroll for elements with .reveal
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && reveals.length){
    const obs = new IntersectionObserver((entries, observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r=>obs.observe(r));
  } else {
    // fallback: make visible
    reveals.forEach(r=>r.classList.add('visible'));
  }
});
