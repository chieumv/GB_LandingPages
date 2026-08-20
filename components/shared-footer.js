(function (global) {
  function normalizeBasePath(basePath) {
    if (!basePath) return ".";
    return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  }

  function buildFooterMarkup(basePath) {
    const root = normalizeBasePath(basePath);
    const logoSrc = `${root}/public/images/Logo-GB-1024x1024_2.png`;

    return `
      <footer class="site-footer shared-site-footer">
        <div class="shared-container">
          <div class="shared-footer-top">
            <section class="shared-footer-card shared-footer-company">
              <div class="shared-footer-brand">
                <img src="${logoSrc}" alt="" width="80" height="80" />
                <div>
                  <span>GreatBless Global Markets</span>
                  <h3>GB Broker</h3>
                </div>
              </div>
              <div class="shared-footer-company-copy">
                <p>
                  GreatBless Global Markets Ltd. is incorporated in Saint Lucia as an International
                  Business Company (IBC) with Registration Number 2025-00698.
                </p>
                <p>
                  Registered Address: Ground Floor, The Sotheby Building, Rodney Village, Rodney Bay,
                  Gros-Islet, Saint Lucia.
                </p>
              </div>
            </section>

            <div class="shared-footer-side">
              <section class="shared-footer-card shared-footer-contact">
                <p class="shared-footer-card-label">Contact</p>
                <h4>Contact Us</h4>
                <a href="mailto:support@greatbless.com">
                  <span>Email</span>
                  <strong>support@greatbless.com</strong>
                </a>
                <a href="tel:+17585720049">
                  <span>Phone</span>
                  <strong>+1 (758) 572-0049</strong>
                </a>
              </section>

              <section class="shared-footer-card shared-footer-links">
                <p class="shared-footer-card-label">Documents</p>
                <h4>Legal</h4>
                <div class="shared-footer-link-grid">
                  <a href="${root}/documents/PRIVACY POLICY - V3.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  <a href="${root}/documents/TERMS_CONDITIONS - V3.pdf" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
                  <a href="${root}/documents/RISK DISCLOSURE - V3.pdf" target="_blank" rel="noopener noreferrer">Risk Disclosure</a>
                  <a href="${root}/documents/ORDER EXECUTION POLICY - V3.pdf" target="_blank" rel="noopener noreferrer">Order Execution Policy</a>
                  <a href="${root}/documents/AML_KYC POLICY - V3.pdf" target="_blank" rel="noopener noreferrer">AML/KYC Policy</a>
                </div>
              </section>
            </div>
          </div>

          <section class="shared-footer-social" aria-labelledby="shared-footer-social-title">
            <div class="shared-footer-social-copy">
              <p class="shared-footer-card-label">Stay connected</p>
              <h3 id="shared-footer-social-title">Follow GreatBless</h3>
              <p>Official updates, announcements, and platform news from GreatBless.</p>
            </div>

            <div class="shared-footer-social-links" aria-label="GreatBless social channels">
              <a class="shared-social-link shared-social-facebook" href="https://www.facebook.com/profile.php?id=61591606401113" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.6 21v-7.7h2.6l.4-3h-3V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H9.3v3h2.5V21h2.8Z" fill="currentColor"></path></svg>
              </a>
              <a class="shared-social-link shared-social-tiktok" href="https://www.tiktok.com/explore" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 3c.5 2.1 1.7 3.4 3.8 3.6v3c-1.4 0-2.6-.4-3.8-1.1v6.1c0 3.6-2.9 6.4-6.5 6.4a6.4 6.4 0 1 1 3.9-11.5v3.1a3.3 3.3 0 1 0-.9 4.6c.4-.4.7-1.1.7-1.9V3h2.8Z" fill="currentColor"></path></svg>
              </a>
              <a class="shared-social-link shared-social-x shared-social-twitter" href="https://x.com/GreatBless2024" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"></path></svg>
              </a>
              <a class="shared-social-link shared-social-instagram" href="https://www.instagram.com/greatbless_2024/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.9"></rect><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.9"></circle><circle cx="17.4" cy="6.7" r="1.1" fill="currentColor"></circle></svg>
              </a>
              <a class="shared-social-link shared-social-youtube" href="https://www.youtube.com/@greatbless2026" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8ZM10.1 15.1V8.9l5.4 3.1-5.4 3.1Z" fill="currentColor"></path></svg>
              </a>
            </div>
          </section>

          <section class="shared-footer-disclosures" aria-labelledby="shared-footer-disclosures-title">
            <h3 id="shared-footer-disclosures-title">Important Information &amp; Disclaimer</h3>

            <div class="shared-footer-disclosure">
              <h4>Risk Warning:</h4>
              <p>
                Trading Forex and CFDs carries a high level of risk to your capital and may not
                be suitable for all investors. Leverage can work against you as well as for you.
                Before deciding to trade, you should carefully consider your investment
                objectives, level of experience, and risk appetite.
              </p>
            </div>

            <div class="shared-footer-disclosure">
              <h4>Regional Restrictions:</h4>
              <p>
                GreatBless Global Markets Ltd. does not provide services to residents of the
                United States, Cuba, Canada, Iraq, Iran, Myanmar, North Korea, Sudan, Syria and United Arab Emirates
                and certain other jurisdictions due to legal restrictions.
              </p>
            </div>

            <div class="shared-footer-disclaimer">
              <h4>Disclaimer:</h4>
              <ul>
                <li>
                  Before trading Forex, consider your goals, experience, and risk tolerance. Only
                  invest money you can afford to lose.
                </li>
                <li>
                  Forex trading involves significant risk, including leverage, market volatility,
                  and limited regulatory protection. Prices and liquidity can change rapidly.
                </li>
                <li>
                  Online trading systems may fail due to technical issues. All information provided
                  is for general purposes only and not investment advice. We are not responsible for
                  any losses resulting from its use.
                </li>
                <li>
                  Trading derivatives carries high risk, and we are not liable for any direct or
                  indirect losses or damages.
                </li>
              </ul>
            </div>
          </section>

          <div class="shared-footer-bottom">
            <p class="shared-footer-copy">&copy; 2026 GreatBless Global Markets Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function renderSharedFooter(targetId, options) {
    const opts = options || {};
    const mountId = targetId || "shared-footer-root";
    const mountNode = document.getElementById(mountId);
    if (!mountNode) return;

    mountNode.innerHTML = buildFooterMarkup(opts.basePath || ".");
    document.body.classList.add("shared-footer-ready");
  }

  global.renderSharedFooter = renderSharedFooter;
})(window);
