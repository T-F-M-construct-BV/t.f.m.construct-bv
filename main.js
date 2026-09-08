/* ============================================================
   T.F.M. Construct BV — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Consent Mode v2 / cookie preferences ---------- */
  var TFM_CONSENT_KEY = 'tfm_consent_v1';

  function tfmGetConsent() {
    try {
      return JSON.parse(
        localStorage.getItem(TFM_CONSENT_KEY)
      );
    } catch (e) {
      return null;
    }
  }

  function tfmSetConsent(analytics, marketing) {
    var state = {
      analytics: !!analytics,
      marketing: !!marketing,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem(
        TFM_CONSENT_KEY,
        JSON.stringify(state)
      );
    } catch (e) {}

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('consent', 'update', {
      analytics_storage:
        state.analytics ? 'granted' : 'denied',
      ad_storage:
        state.marketing ? 'granted' : 'denied',
      ad_user_data:
        state.marketing ? 'granted' : 'denied',
      ad_personalization:
        state.marketing ? 'granted' : 'denied'
    });

    window.dataLayer.push({
      event: 'cookie_consent_update',
      cookie_consent:
        state.analytics || state.marketing
          ? 'accepted'
          : 'necessary_only',
      analytics_storage:
        state.analytics ? 'granted' : 'denied',
      ad_storage:
        state.marketing ? 'granted' : 'denied',
      ad_user_data:
        state.marketing ? 'granted' : 'denied',
      ad_personalization:
        state.marketing ? 'granted' : 'denied'
    });

    return state;
  }

  function tfmInjectConsentStyles() {
    if (
      document.getElementById(
        'tfm-consent-styles'
      )
    ) return;

    var style = document.createElement('style');
    style.id = 'tfm-consent-styles';

    style.textContent = `
      .tfm-cookie-banner{
        position:fixed;
        left:20px;
        right:20px;
        bottom:20px;
        z-index:99999;
        max-width:900px;
        margin:auto;
        padding:22px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 12px 45px rgba(0,0,0,.22);
        font-family:inherit;
        color:#222;
      }
      .tfm-cookie-banner h3{
        margin:0 0 8px;
        font-size:1.15rem;
      }
      .tfm-cookie-banner p{
        margin:0 0 16px;
        line-height:1.55;
        font-size:.92rem;
        color:#555;
      }
      .tfm-cookie-actions{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
      }
      .tfm-cookie-actions button{
        border:1px solid #1d2b36;
        padding:11px 16px;
        border-radius:8px;
        font-weight:700;
        cursor:pointer;
        font:inherit;
      }
      .tfm-cookie-accept{
        background:#1d2b36;
        color:#fff;
      }
      .tfm-cookie-essential,
      .tfm-cookie-preferences{
        background:#fff;
        color:#1d2b36;
      }
      .tfm-cookie-settings{
        position:fixed;
        left:12px;
        bottom:12px;
        z-index:99990;
        border:1px solid #ddd;
        background:#fff;
        color:#333;
        padding:7px 10px;
        border-radius:7px;
        font-size:.75rem;
        cursor:pointer;
        box-shadow:0 4px 15px rgba(0,0,0,.1);
      }
      .tfm-consent-modal-backdrop{
        position:fixed;
        inset:0;
        z-index:100000;
        background:rgba(0,0,0,.48);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }
      .tfm-consent-modal{
        width:min(520px,100%);
        background:#fff;
        border-radius:14px;
        padding:24px;
        box-shadow:0 20px 60px rgba(0,0,0,.3);
      }
      .tfm-consent-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:20px;
        padding:15px 0;
        border-bottom:1px solid #eee;
      }
      .tfm-consent-row strong{
        display:block;
        margin-bottom:3px;
      }
      .tfm-consent-row small{
        color:#666;
        line-height:1.4;
      }
      .tfm-consent-modal-actions{
        display:flex;
        justify-content:flex-end;
        gap:10px;
        margin-top:20px;
      }
      .tfm-consent-modal button{
        padding:10px 15px;
        border-radius:7px;
        border:1px solid #1d2b36;
        cursor:pointer;
        font:inherit;
        font-weight:700;
      }
      @media(max-width:600px){
        .tfm-cookie-banner{
          left:10px;
          right:10px;
          bottom:10px;
          padding:18px;
        }
        .tfm-cookie-actions{
          flex-direction:column;
        }
        .tfm-cookie-actions button{
          width:100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function tfmCloseCookieBanner() {
    var banner = document.querySelector(
      '.tfm-cookie-banner'
    );

    if (banner) banner.remove();
  }

  function tfmOpenPreferences() {
    var existing = document.querySelector(
      '.tfm-consent-modal-backdrop'
    );

    if (existing) existing.remove();

    var state = tfmGetConsent() || {
      analytics: false,
      marketing: false
    };

    var backdrop = document.createElement('div');
    backdrop.className =
      'tfm-consent-modal-backdrop';

    backdrop.innerHTML = `
      <div class="tfm-consent-modal"
           role="dialog"
           aria-modal="true"
           aria-label="Cookievoorkeuren">
        <h3>Cookievoorkeuren</h3>

        <div class="tfm-consent-row">
          <div>
            <strong>Noodzakelijke cookies</strong>
            <small>
              Nodig om de website correct te laten werken.
            </small>
          </div>
          <input type="checkbox"
                 checked
                 disabled
                 aria-label="Noodzakelijke cookies">
        </div>

        <div class="tfm-consent-row">
          <div>
            <strong>Analytische cookies</strong>
            <small>
              Helpen ons begrijpen hoe de website wordt gebruikt.
            </small>
          </div>
          <input id="tfm-consent-analytics"
                 type="checkbox"
                 ${state.analytics ? 'checked' : ''}>
        </div>

        <div class="tfm-consent-row">
          <div>
            <strong>Marketingcookies</strong>
            <small>
              Worden gebruikt voor advertentiemeting
              en personalisatie.
            </small>
          </div>
          <input id="tfm-consent-marketing"
                 type="checkbox"
                 ${state.marketing ? 'checked' : ''}>
        </div>

        <div class="tfm-consent-modal-actions">
          <button type="button"
                  class="tfm-consent-cancel">
            Annuleren
          </button>

          <button type="button"
                  class="tfm-consent-save">
            Voorkeuren opslaan
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.querySelector(
      '.tfm-consent-cancel'
    ).addEventListener('click', function () {
      backdrop.remove();
    });

    backdrop.querySelector(
      '.tfm-consent-save'
    ).addEventListener('click', function () {
      var analytics = backdrop.querySelector(
        '#tfm-consent-analytics'
      ).checked;

      var marketing = backdrop.querySelector(
        '#tfm-consent-marketing'
      ).checked;

      tfmSetConsent(
        analytics,
        marketing
      );

      backdrop.remove();
      tfmCloseCookieBanner();
    });
  }

  function tfmShowCookieBanner() {
    if (tfmGetConsent()) return;

    tfmInjectConsentStyles();

    var banner = document.createElement('div');
    banner.className = 'tfm-cookie-banner';
    banner.setAttribute(
      'role',
      'dialog'
    );

    banner.setAttribute(
      'aria-label',
      'Cookiekeuze'
    );

    banner.innerHTML = `
      <h3>Cookies op T.F.M. Construct</h3>
      <p>
        Wij gebruiken noodzakelijke cookies en,
        met uw toestemming, analytische en
        marketingcookies om onze website en
        campagnes te verbeteren.
        <a href="/cookiebeleid/">
          Lees ons cookiebeleid
        </a>.
      </p>

      <div class="tfm-cookie-actions">
        <button type="button"
                class="tfm-cookie-accept">
          Alles accepteren
        </button>

        <button type="button"
                class="tfm-cookie-essential">
          Alleen noodzakelijk
        </button>

        <button type="button"
                class="tfm-cookie-preferences">
          Voorkeuren
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    banner.querySelector(
      '.tfm-cookie-accept'
    ).addEventListener('click', function () {
      tfmSetConsent(true, true);
      tfmCloseCookieBanner();
    });

    banner.querySelector(
      '.tfm-cookie-essential'
    ).addEventListener('click', function () {
      tfmSetConsent(false, false);
      tfmCloseCookieBanner();
    });

    banner.querySelector(
      '.tfm-cookie-preferences'
    ).addEventListener('click', function () {
      tfmOpenPreferences();
    });
  }

  function tfmAddSettingsButton() {
    tfmInjectConsentStyles();

    if (
      document.querySelector(
        '.tfm-cookie-settings'
      )
    ) return;

    var btn = document.createElement('button');

    btn.type = 'button';
    btn.className = 'tfm-cookie-settings';
    btn.textContent = 'Cookie-instellingen';

    btn.addEventListener(
      'click',
      tfmOpenPreferences
    );

    document.body.appendChild(btn);
  }

  tfmShowCookieBanner();
  tfmAddSettingsButton();

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
