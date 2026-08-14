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
                  <a href="${root}/documents/privacy-policy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  <a href="${root}/documents/terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
                  <a href="${root}/documents/risk-disclosure.pdf" target="_blank" rel="noopener noreferrer">Risk Disclosure</a>
                  <a href="${root}/documents/order-execution-policy.pdf" target="_blank" rel="noopener noreferrer">Order Execution Policy</a>
                  <a href="${root}/documents/aml-kyc-policy.pdf" target="_blank" rel="noopener noreferrer">AML/KYC Policy</a>
                </div>
              </section>
            </div>
          </div>

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
