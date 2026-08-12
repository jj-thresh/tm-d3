/* =========================================================
   Shared page chrome (nav + footer)
   ---------------------------------------------------------
   Injected into every page via <div data-chrome="nav"> and
   <div data-chrome="footer"> placeholders so the markup lives
   in one place. Asset paths are RELATIVE (no leading slash) so
   they resolve under the GitHub Pages subpath (/tm-d3/…) as well
   as locally — the injected HTML is not processed by Vite.
   ========================================================= */

const NAV_HTML = `
  <header class="nav">
    <div class="nav__inner">
      <a class="nav__logo" href="index.html" aria-label="Threshold Media home">
        <img src="img/logo-header.svg" alt="Threshold Media" />
      </a>
      <nav class="nav__links">
        <a href="about.html">About</a>
        <a href="capabilities.html">Capabilities</a>
        <a href="work.html">Work</a>
        <a href="insights.html">Insights</a>
        <a href="connect.html">Connect</a>
      </nav>
      <button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;

const FOOTER_HTML = `
  <footer class="sec sec--footer">
    <div class="in in--footer">
      <div class="footer__logo">
        <img class="footer__logo-img" src="img/logo-footer-white.svg" alt="Threshold Media" />
      </div>
      <div class="footer__right">
        <div class="footer__connect">
          <p class="footer__cta">Let&rsquo;s connect.<br />Start by saying hello.</p>
          <div class="footer__social">
            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
        <div class="footer__bottom">
          <ul class="footer__services">
            <li>Brand &amp; Strategy</li>
            <li>Web &amp; Digital Experiences</li>
            <li>Search &amp; Paid Media</li>
            <li>Communication &amp; Engagement</li>
            <li>Social Media &amp; Content</li>
          </ul>
          <address class="footer__address">
            20755 Williamsport Pl. #180<br />
            Ashburn, VA 20147<br />
            Phone +1 (571) 333-7999<br />
            <a href="mailto:info@thresholdmedia.com">info@thresholdmedia.com</a><br />
            <a href="https://www.thresholdmedia.com">www.thresholdmedia.com</a>
          </address>
          <div class="footer__policy">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </div>
  </footer>`;

export function mountChrome() {
  const navMount = document.querySelector('[data-chrome="nav"]');
  if (navMount) navMount.outerHTML = NAV_HTML;
  const footMount = document.querySelector('[data-chrome="footer"]');
  if (footMount) footMount.outerHTML = FOOTER_HTML;

  // Mark the current page's nav link as active.
  const page = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav__links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href !== '#' && page === href) a.classList.add('is-active');
  });
}
