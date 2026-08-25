(function (global) {
  function normalizeBasePath(basePath) {
    if (!basePath) return ".";
    return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  }

  function buildHeaderMarkup(basePath) {
    const root = normalizeBasePath(basePath);
    const homeHref = `${root}/index.html`;
    const blogHref = `${root}/pages/blog.html`;
    const logoSrc = `${root}/public/images/Logo-GB-1024x1024_2.png`;
    const isBlogPage = /\/pages\/blog(?:_details\/|\.html|\/|$)/.test(global.location.pathname);

    return `
      <header id="site-header" class="site-header shared-site-header">
        <div class="shared-container shared-header-inner">
          <a class="shared-brand" href="${homeHref}" aria-label="GreatBless home">
            <img src="${logoSrc}" alt="" width="64" height="64" />
            <span>GreatBless</span>
          </a>

          <button
            type="button"
            class="shared-menu-toggle"
            id="shared-menu-toggle"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="shared-site-menu"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path class="shared-icon-open" d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
              <path class="shared-icon-close" d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            </svg>
          </button>

          <nav id="shared-site-menu" class="shared-menu" aria-label="Primary navigation">
            <a href="${homeHref}#platforms" data-shared-section="platforms">Platforms</a>
            <a href="${homeHref}#about-us" data-shared-section="about-us">About Us</a>
            <a href="${homeHref}#why-choose-us" data-shared-section="why-choose-us">Why Choose Us</a>
            <a href="${blogHref}"${isBlogPage ? ' class="is-active" aria-current="page"' : ""}>Blog</a>
            <a href="https://support-app.greatbless.com" target="_blank" rel="noopener noreferrer">Support</a>
          </nav>

          <div class="shared-header-cta">
            <a href="https://trading.greatbless.com/user-auth/login" class="shared-header-btn shared-login-btn">Login</a>
            <a href="https://trading.greatbless.com/user-auth/register" class="shared-header-btn shared-account-btn">Open Account</a>
          </div>
        </div>
      </header>
    `;
  }

  function initializeSharedHeader(header) {
    if (!header || header.dataset.initialized === "true") return;
    header.dataset.initialized = "true";

    const menuToggle = header.querySelector("#shared-menu-toggle");
    const menuLinks = header.querySelectorAll(".shared-menu a");
    const sectionLinks = header.querySelectorAll("[data-shared-section]");
    const mobileQuery = global.matchMedia("(max-width: 1199px)");
    const scrollDelta = 8;
    const revealThreshold = 72;
    let lastScrollY = Math.max(global.scrollY, 0);

    const closeMenu = () => {
      header.classList.remove("menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "Open navigation menu");
    };

    const updateHeaderState = () => {
      const currentScrollY = Math.max(global.scrollY, 0);
      const isMenuOpen = header.classList.contains("menu-open");

      header.classList.toggle("scrolled", currentScrollY > 6);

      if (currentScrollY <= revealThreshold || isMenuOpen) {
        header.classList.remove("header-hidden");
        lastScrollY = currentScrollY;
      } else if (currentScrollY > lastScrollY + scrollDelta) {
        header.classList.add("header-hidden");
        lastScrollY = currentScrollY;
      } else if (currentScrollY < lastScrollY - scrollDelta) {
        header.classList.remove("header-hidden");
        lastScrollY = currentScrollY;
      }
    };

    menuToggle?.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      if (isOpen) header.classList.remove("header-hidden");
    });

    sectionLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const sectionId = link.getAttribute("data-shared-section");
        const section = sectionId ? document.getElementById(sectionId) : null;

        if (section) {
          event.preventDefault();
          const headerOffset = header.getBoundingClientRect().height;
          const sectionTop = section.getBoundingClientRect().top + global.scrollY;
          global.scrollTo({ top: sectionTop - headerOffset, behavior: "smooth" });
          if (global.location.protocol !== "file:") {
            global.history.replaceState(null, "", `#${sectionId}`);
          }
        }

        if (mobileQuery.matches) closeMenu();
      });
    });

    menuLinks.forEach((link) => {
      if (link.hasAttribute("data-shared-section")) return;
      link.addEventListener("click", () => {
        if (mobileQuery.matches) closeMenu();
      });
    });

    global.addEventListener("scroll", updateHeaderState, { passive: true });
    global.addEventListener("resize", () => {
      if (!mobileQuery.matches) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    updateHeaderState();
  }

  function renderSharedHeader(targetId, options) {
    const opts = options || {};
    const mountId = targetId || "shared-header-root";
    const mountNode = document.getElementById(mountId);
    if (!mountNode) return;

    mountNode.innerHTML = buildHeaderMarkup(opts.basePath || ".");
    document.body.classList.add("shared-header-ready");
    initializeSharedHeader(mountNode.querySelector(".shared-site-header"));
  }

  global.renderSharedHeader = renderSharedHeader;
})(window);
