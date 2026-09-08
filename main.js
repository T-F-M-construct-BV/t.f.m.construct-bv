/* ============================================================
   T.F.M. Construct BV — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Hamburger / Mobile menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Nav scroll ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ---------- IntersectionObserver for .reveal / .reveal-r ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-r');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Hide sticky CTA when #contact is in viewport ---------- */
  var stickyCta = document.querySelector('.sticky-cta');
  var contactSection = document.querySelector('#contact');
  if (stickyCta && contactSection) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyCta.classList.toggle('hidden', entry.isIntersecting);
      });
    }, { threshold: 0.2 });
    ctaObserver.observe(contactSection);
  }

  /* ---------- Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navH = nav ? nav.offsetHeight : 70;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- GTM conversion tracking: phone / whatsapp / email clicks ---------- */
  window.dataLayer = window.dataLayer || [];
  function pushEvent(eventName, extra) {
    var data = { event: eventName };
    if (extra) for (var k in extra) data[k] = extra[k];
    window.dataLayer.push(data);
  }
  /* Event delegation on document — keeps tracking working even for links
     inside data-i18n containers, whose innerHTML lang.js replaces (and
     which would otherwise silently lose any listener bound directly to
     the original element). */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) pushEvent('phone_click', { link_url: href });
    else if (href.indexOf('mailto:') === 0) pushEvent('email_click', { link_url: href });
    else if (href.indexOf('wa.me') !== -1) pushEvent('whatsapp_click', { link_url: href });
  });

  /* ---------- Contact form: real submit to FormSubmit + GTM event ---------- */
  document.querySelectorAll('.contact-form').forEach(function (form) {

    /* First meaningful interaction with the lead form */
    form.addEventListener('focusin', function () {
      pushEvent('form_start', {
        form_name: 'offerte_aanvraag'
      });
    }, { once: true });

    form.addEventListener('submit', function () {
      var dienstField = form.querySelector('[name="dienst"]');
      var serviceRequested = dienstField ? dienstField.value : undefined;

      /*
       * Remember that a genuine form submission was started.
       * /bedankt/ consumes this marker and emits generate_lead once.
       */
      try {
        sessionStorage.setItem('tfm_lead_pending', JSON.stringify({
          ts: Date.now(),
          service_requested: serviceRequested || ''
        }));
      } catch (e) {}

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_submit',
        form_name: 'offerte_aanvraag',
        service_requested: serviceRequested
      });
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Bezig met versturen…'; }
      // No preventDefault: the form posts natively to FormSubmit and the
      // visitor is redirected to /bedankt/ via the hidden _next field.
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open);
    });
  });

  /* ---------- Map tooltip ---------- */
  var provinces = document.querySelectorAll('.province');
  var tooltip = document.querySelector('.map-tooltip');
  if (tooltip) {
    provinces.forEach(function (prov) {
      prov.addEventListener('mouseenter', function (e) {
        tooltip.textContent = (prov.dataset.name || '') + ' — Wij zijn hier actief';
        tooltip.style.opacity = '1';
      });
      prov.addEventListener('mousemove', function (e) {
        tooltip.style.left = (e.pageX + 12) + 'px';
        tooltip.style.top = (e.pageY - 32) + 'px';
      });
      prov.addEventListener('mouseleave', function () {
        tooltip.style.opacity = '0';
      });
    });
  }

})();

// LIGHTBOX
(function(){
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = '<button class="lb-close" aria-label="Sluiten">&times;</button><button class="lb-prev" aria-label="Vorige">&#8249;</button><img alt=""><button class="lb-next" aria-label="Volgende">&#8250;</button>';
  document.body.appendChild(overlay);
  const img = overlay.querySelector('img');
  let imgs = [], cur = 0;
  function open(i){ cur=i; img.src=imgs[i].src; img.alt=imgs[i].alt; overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function close(){ overlay.classList.remove('open'); document.body.style.overflow=''; img.src=''; }
  function prev(){ open((cur-1+imgs.length)%imgs.length); }
  function next(){ open((cur+1)%imgs.length); }
  overlay.querySelector('.lb-close').addEventListener('click',close);
  overlay.querySelector('.lb-prev').addEventListener('click',prev);
  overlay.querySelector('.lb-next').addEventListener('click',next);
  overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); });
  document.addEventListener('keydown',e=>{ if(!overlay.classList.contains('open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')prev(); if(e.key==='ArrowRight')next(); });
  document.addEventListener('DOMContentLoaded',()=>{
    imgs = Array.from(document.querySelectorAll('[data-lb] img, img[data-lb]'));
    imgs.forEach((im,i)=>{
      const wrap = im.closest('[data-lb]') || im;
      wrap.addEventListener('click',()=>open(i));
    });
  });
})();
