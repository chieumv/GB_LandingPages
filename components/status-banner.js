/**
 * Fixed launch-status banner + waitlist email capture.
 * Self-contained: injects its own CSS, markup and behaviour, so it can be added
 * to every page with a single <script> tag without touching per-page styles.
 * Posts signups to /api/subscribe (Cloudflare Pages Function -> Resend).
 */
(function () {
  var CSS =
    '#gb-status-banner{position:fixed;top:0;left:0;right:0;z-index:100;' +
    'background:#160826;border-bottom:1px solid rgba(255,255,255,.1);' +
    'box-shadow:0 2px 12px rgba(0,0,0,.35);color:#eae6f2;' +
    "font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:14px}" +
    '#gb-status-banner .gb-sb-inner{max-width:1600px;margin:0 auto;padding:9px 20px;' +
    'display:flex;align-items:center;gap:14px 22px;flex-wrap:wrap;justify-content:center}' +
    '#gb-status-banner .gb-sb-msg{display:flex;align-items:center;gap:9px;line-height:1.35;flex:1 1 auto;min-width:240px}' +
    '#gb-status-banner .gb-sb-dot{flex:none;width:9px;height:9px;border-radius:50%;background:#ffb020;' +
    'box-shadow:0 0 0 4px rgba(255,176,32,.18)}' +
    '#gb-status-banner .gb-sb-msg b{color:#ffce6b;font-weight:700}' +
    '#gb-status-banner form{display:flex;gap:8px;flex:none;align-items:center}' +
    '#gb-status-banner input[type=email]{height:36px;width:210px;max-width:52vw;padding:0 12px;border-radius:8px;' +
    'border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:#fff;font-size:13.5px;outline:none}' +
    '#gb-status-banner input[type=email]::placeholder{color:#b7add0}' +
    '#gb-status-banner input[type=email]:focus{border-color:#7cecff}' +
    '#gb-status-banner button{height:36px;padding:0 16px;border:0;border-radius:8px;cursor:pointer;' +
    'font-weight:700;font-size:13.5px;background:linear-gradient(135deg,#31B099,#299481);color:#fff;white-space:nowrap}' +
    '#gb-status-banner button:disabled{opacity:.6;cursor:default}' +
    '#gb-status-banner .gb-sb-note{font-size:13px;flex-basis:100%;text-align:center;margin:2px 0 0}' +
    '#gb-status-banner .gb-sb-note.ok{color:#79e2b8}#gb-status-banner .gb-sb-note.err{color:#ff9b9b}' +
    '@media (max-width:640px){#gb-status-banner{font-size:13px}' +
    '#gb-status-banner .gb-sb-inner{padding:8px 14px;gap:8px 14px}' +
    '#gb-status-banner input[type=email]{width:150px}}';

  var MSG =
    '<span class="gb-sb-dot" aria-hidden="true"></span>' +
    '<span><b>Preview</b> — GreatBless is not yet open for live trading or real-money deposits/withdrawals. ' +
    'Explore the platform with a <b>free demo account</b>. We\'ll email you when live trading launches.</span>';

  var FORM =
    '<form id="gb-waitlist-form" novalidate>' +
    '<input type="email" id="gb-waitlist-email" placeholder="Your email" aria-label="Email for launch notification" required />' +
    '<button type="submit" id="gb-waitlist-btn">Notify me</button>' +
    '</form>';

  var basePad = null;

  function applyOffset(bar) {
    var h = bar.offsetHeight;
    var header = document.getElementById('site-header');
    if (header) header.style.top = h + 'px';
    if (basePad === null) basePad = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = basePad + h + 'px';
  }

  function init() {
    if (document.getElementById('gb-status-banner')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'gb-status-banner';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Platform status');
    bar.innerHTML =
      '<div class="gb-sb-inner">' +
      '<div class="gb-sb-msg">' + MSG + '</div>' +
      FORM +
      '<p class="gb-sb-note" id="gb-sb-note" style="display:none"></p>' +
      '</div>';
    document.body.insertBefore(bar, document.body.firstChild);

    var form = bar.querySelector('#gb-waitlist-form');
    var input = bar.querySelector('#gb-waitlist-email');
    var btn = bar.querySelector('#gb-waitlist-btn');
    var note = bar.querySelector('#gb-sb-note');

    function showNote(text, ok) {
      note.textContent = text;
      note.className = 'gb-sb-note ' + (ok ? 'ok' : 'err');
      note.style.display = 'block';
      applyOffset(bar);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNote('Please enter a valid email address.', false);
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sending…';
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, source: location.pathname }),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && res.d && res.d.success) {
            form.style.display = 'none';
            showNote("Thanks! We'll email you at launch.", true);
          } else {
            showNote((res.d && res.d.error) || 'Could not submit. Please try again later.', false);
            btn.disabled = false;
            btn.textContent = 'Notify me';
          }
        })
        .catch(function () {
          showNote('Network error. Please try again later.', false);
          btn.disabled = false;
          btn.textContent = 'Notify me';
        });
    });

    applyOffset(bar);
    // The shared header is injected asynchronously on sub-pages; re-apply the
    // offset a few times so the header lands below the banner.
    window.addEventListener('resize', function () { applyOffset(bar); });
    window.addEventListener('load', function () { applyOffset(bar); });
    setTimeout(function () { applyOffset(bar); }, 250);
    setTimeout(function () { applyOffset(bar); }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
