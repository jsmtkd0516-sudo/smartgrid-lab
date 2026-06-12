const labData = window.labData ?? {};
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const canvas = document.querySelector("[data-grid-canvas]");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const initials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SG";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const renderFeaturedProject = () => {
  const target = document.querySelector("[data-featured-project]");
  const item = labData.featuredProject;
  if (!target || !item) return;

  target.innerHTML = `
    <p class="panel-label">${escapeHtml(item.label)}</p>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.description)}</p>
    <span>${escapeHtml(item.sponsor)}</span>
  `;
};

const renderProjects = () => {
  const target = document.querySelector("[data-project-list]");
  if (!target) return;

  target.innerHTML = (labData.projects ?? [])
    .map(
      (item) => `
        <article class="${item.empty ? "empty-card" : ""}">
          <span>${escapeHtml(item.status)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
};

const renderPublications = () => {
  const target = document.querySelector("[data-publication-list]");
  if (!target) return;

  target.innerHTML = (labData.publications ?? [])
    .map(
      (item) => `
        <article class="publication-item reveal ${item.empty ? "empty-card" : ""}" data-tags="${escapeHtml(
          (item.tags ?? []).join(" ")
        )}">
          <time>${escapeHtml(item.year)}</time>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.venue)}</p>
          </div>
        </article>
      `
    )
    .join("");
};

const renderAchievements = () => {
  const target = document.querySelector("[data-achievement-list]");
  if (!target) return;

  target.innerHTML = (labData.achievements ?? [])
    .map(
      (item) => `
        <article class="achievement-card reveal ${item.empty ? "empty-card" : ""}">
          <span>${escapeHtml(item.type)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="achievement-meta">${escapeHtml(item.meta)}</p>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
};

const renderMembers = () => {
  const target = document.querySelector("[data-member-list]");
  if (!target) return;

  target.innerHTML = (labData.members ?? [])
    .map((person) => {
      const photo = person.photo
        ? `<img class="person-photo" src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)} profile photo" />`
        : `<span class="avatar small ${person.empty ? "empty-photo" : ""}">${escapeHtml(initials(person.name))}</span>`;

      return `
        <article class="person-card reveal ${person.lead ? "lead" : ""} ${person.empty ? "empty-card" : ""}">
          ${photo}
          <h3>${escapeHtml(person.name)}</h3>
          <p>${escapeHtml(person.role)}</p>
          <small>${escapeHtml(person.interest)}</small>
        </article>
      `;
    })
    .join("");
};

const renderAlumni = () => {
  const target = document.querySelector("[data-alumni-list]");
  if (!target) return;

  const alumni = labData.alumni ?? [];
  target.innerHTML = `
    <strong>Alumni Network</strong>
    ${alumni.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
  `;
};

const renderNews = () => {
  const target = document.querySelector("[data-news-list]");
  if (!target) return;

  target.innerHTML = (labData.news ?? [])
    .map(
      (item) => `
        <article class="${item.empty ? "empty-card" : ""}">
          <time>${escapeHtml(item.category)}</time>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
};

const renderGallery = () => {
  const target = document.querySelector("[data-gallery-list]");
  if (!target) return;

  target.innerHTML = (labData.gallery ?? [])
    .map((item) => {
      const media = item.image
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.caption)}" />`
        : `<div class="gallery-placeholder" role="img" aria-label="${escapeHtml(item.alt || "사진 추가 자리")}">
            <span>사진 추가</span>
          </div>`;

      return `
        <figure class="${item.image ? "" : "empty-card"}">
          ${media}
          <figcaption>${escapeHtml(item.caption)}</figcaption>
        </figure>
      `;
    })
    .join("");
};

const renderContent = () => {
  renderFeaturedProject();
  renderProjects();
  renderPublications();
  renderAchievements();
  renderMembers();
  renderAlumni();
  renderNews();
  renderGallery();
};

const setupNavigation = () => {
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
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  });
};

const setupPublicationFilters = () => {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const publications = document.querySelectorAll("[data-publication-list] .publication-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter ?? "all";
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

      publications.forEach((publication) => {
        const tags = publication.dataset.tags ?? "";
        publication.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
      });
    });
  });
};

const setupReveal = () => {
  const revealItems = document.querySelectorAll(".reveal");
  const isInViewport = (item) => {
    const rect = item.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => {
      if (isInViewport(item)) {
        item.classList.add("is-visible");
      } else {
        observer.observe(item);
      }
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
};

const setupHeroCanvas = () => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const nodes = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const createNodes = () => {
    nodes.length = 0;
    const count = Math.max(26, Math.floor(width / 52));

    for (let index = 0; index < count; index += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1.4 + Math.random() * 1.6,
      });
    }
  };

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    createNodes();
  };

  const draw = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 150) {
          const alpha = 1 - distance / 150;
          ctx.strokeStyle = `rgba(92, 218, 255, ${alpha * 0.34})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      ctx.fillStyle = "rgba(127, 232, 255, 0.82)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrame = window.requestAnimationFrame(draw);
  };

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!motionQuery.matches) {
    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  motionQuery.addEventListener?.("change", (event) => {
    if (event.matches) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      resize();
      draw();
    }
  });
};

renderContent();
setupNavigation();
setupPublicationFilters();
setupReveal();
setupHeroCanvas();
