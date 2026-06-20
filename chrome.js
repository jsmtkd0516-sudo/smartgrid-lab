/*
  chrome.js — 모든 페이지가 공유하는 헤더(메뉴)·페이지 배너·푸터를 한 곳에서 만들어 끼운다.
  - 큰 메뉴에 마우스를 올리면(호버) 하위 항목이 드롭다운으로 뜨고, 각 하위 항목은 "별도 페이지"로 이동한다.
  - 메뉴/페이지를 바꾸려면 이 파일의 NAV 배열만 고치면 모든 페이지에 한꺼번에 반영된다.
*/
(() => {
  const NAV = [
    { label: "Home", href: "index.html" },
    {
      label: "Introduction",
      href: "overview.html",
      menu: [
        { label: "Overview", href: "overview.html" },
        { label: "Contact", href: "contact.html" },
      ],
    },
    {
      label: "Research",
      href: "research.html",
      menu: [
        { label: "Research Topics", href: "research.html" },
        { label: "Projects", href: "projects.html" },
        { label: "Collaborators", href: "collaborators.html" },
      ],
    },
    {
      label: "Our Team",
      href: "professor.html",
      menu: [
        { label: "Professor", href: "professor.html" },
        { label: "Members", href: "members.html" },
        { label: "Alumni", href: "alumni.html" },
      ],
    },
    {
      label: "Publications",
      href: "publications.html",
      menu: [
        { label: "Journals", href: "publications.html" },
        { label: "Patents", href: "patents.html" },
      ],
    },
    { label: "News & Gallery", href: "news.html" },
  ];

  const current = (() => {
    const path = location.pathname.split("/").pop();
    return !path ? "index.html" : path;
  })();

  const isActive = (item) =>
    item.href === current ||
    (item.href === "news.html" && current === "gallery.html") ||
    (item.menu && item.menu.some((m) => m.href === current));

  const navItems = NAV.map((item) => {
    const active = isActive(item);
    const top = `<a class="nav-top${active ? " is-active" : ""}" href="${item.href}"${
      active ? ' aria-current="page"' : ""
    }>${item.label}</a>`;
    if (!item.menu) return `<div class="nav-item">${top}</div>`;
    const sub = item.menu
      .map((m) => `<a${m.href === current ? ' class="is-current"' : ""} href="${m.href}">${m.label}</a>`)
      .join("");
    return `<div class="nav-item has-menu">${top}<div class="nav-menu">${sub}</div></div>`;
  }).join("");

  const headerHtml = `
    <a class="brand" href="index.html" aria-label="Yonsei Smartgrid Laboratory home">
      <span class="brand-mark">SG</span>
      <span>
        <strong>Smartgrid Lab</strong>
        <small>Yonsei EEE</small>
      </span>
    </a>
    <button class="nav-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" data-nav-toggle>
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="site-nav" aria-label="Primary navigation" data-nav>${navItems}</nav>
  `;

  const footerHtml = `
    <div class="affiliation-strip" aria-label="Affiliations">
      <span>YONSEI UNIVERSITY</span>
      <span>COLLEGE OF ENGINEERING</span>
      <span>SCHOOL OF ELECTRICAL &amp; ELECTRONIC ENGINEERING</span>
    </div>
    <footer class="site-footer">
      <div class="footer-contact">
        <strong>Yonsei University Smartgrid Laboratory</strong>
        <a href="mailto:khur@yonsei.ac.kr">khur@yonsei.ac.kr</a>
        <span>Engineering Research Park 246C · Engineering Building C626</span>
        <span>50 Yonsei-ro, Seodaemun-gu, Seoul 03722, Korea</span>
      </div>
      <p class="footer-note">Concept website draft. Content should be reviewed before publication.</p>
    </footer>
  `;

  const headerSlot = document.querySelector("[data-site-header]");
  if (headerSlot) headerSlot.innerHTML = headerHtml;
  const footerSlot = document.querySelector("[data-site-footer]");
  if (footerSlot) footerSlot.innerHTML = footerHtml;

  // favicon + 모바일 테마색 주입 (모든 페이지 공통)
  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.href = "favicon.svg";
    document.head.appendChild(icon);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const theme = document.createElement("meta");
    theme.name = "theme-color";
    theme.content = "#07172f";
    document.head.appendChild(theme);
  }

  // 현재 페이지의 섹션/제목을 찾아 페이지 배너를 자동으로 얹는다 (Home 제외).
  const headerEl = document.querySelector("[data-header]");
  if (current !== "index.html" && headerEl) {
    let section = "";
    let title = "";
    for (const item of NAV) {
      if (item.menu) {
        const hit = item.menu.find((m) => m.href === current);
        if (hit) {
          section = item.label;
          title = hit.label;
          break;
        }
      } else if (item.href === current || (item.href === "news.html" && current === "gallery.html")) {
        title = item.label;
        break;
      }
    }
    if (title) {
      const banner = document.createElement("section");
      banner.className = "page-hero";
      banner.innerHTML = `
        <div class="page-hero-inner">
          ${section ? `<p class="eyebrow">${section}</p>` : ""}
          <h1>${title}</h1>
        </div>
      `;
      headerEl.insertAdjacentElement("afterend", banner);
    }
  }

  // 헤더를 끼운 뒤에 메뉴 동작을 배선한다.
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  navToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  nav?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("scroll", () => {
    headerEl?.classList.toggle("is-scrolled", window.scrollY > 20);
  });

  // 터치(호버 불가) 기기: 큰 메뉴 첫 탭 = 드롭다운 열기, 두 번째 탭 = 이동.
  if (window.matchMedia("(hover: none)").matches) {
    nav?.querySelectorAll(".nav-item.has-menu > .nav-top").forEach((top) => {
      top.addEventListener("click", (event) => {
        if (window.innerWidth <= 820) return; // 모바일 패널은 하위메뉴가 이미 펼쳐져 있음
        const item = top.parentElement;
        if (!item.classList.contains("is-open")) {
          event.preventDefault();
          nav.querySelectorAll(".nav-item.is-open").forEach((el) => {
            if (el !== item) el.classList.remove("is-open");
          });
          item.classList.add("is-open");
        }
      });
    });
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element) || !event.target.closest(".nav-item")) {
        nav?.querySelectorAll(".nav-item.is-open").forEach((el) => el.classList.remove("is-open"));
      }
    });
  }
})();
