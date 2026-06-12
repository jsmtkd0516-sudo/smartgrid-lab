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
    .map((item) => {
      const thumb = item.image
        ? `<img class="news-thumb" src="${escapeHtml(item.image)}" alt="" loading="lazy" />`
        : "";

      return `
        <article class="news-item ${item.image ? "has-thumb" : ""} ${item.empty ? "empty-card" : ""}">
          ${thumb}
          <div>
            <p class="news-meta">
              ${item.date ? `<time>${escapeHtml(item.date)}</time>` : ""}
              <span class="news-category">${escapeHtml(item.category)}</span>
            </p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </article>
      `;
    })
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

const setupHeroStats = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const members = (labData.members ?? []).filter((item) => !item.empty).length;
  const projects =
    (labData.projects ?? []).filter((item) => !item.empty && /active/i.test(item.status ?? "")).length +
    (labData.featuredProject ? 1 : 0);
  const targets = { members, projects };

  document.querySelectorAll("[data-stat]").forEach((el) => {
    const key = el.dataset.stat;
    if (!(key in targets)) return;
    const to = targets[key];

    if (reduceMotion) {
      el.textContent = String(to);
      return;
    }

    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = String(Math.round(to * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  });
};

const setupFrequencyMeter = () => {
  const valueEl = document.querySelector("[data-freq-value]");
  const freqCanvas = document.querySelector("[data-freq-canvas]");
  if (!valueEl) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    valueEl.textContent = "60.000";
    return;
  }

  const ctx = freqCanvas?.getContext("2d");
  const history = [];
  const capacity = 90;
  let frequency = 60;
  let tick = 0;
  let width = 0;
  let height = 0;

  const resize = () => {
    if (!freqCanvas || !ctx) return;
    const ratio = window.devicePixelRatio || 1;
    width = freqCanvas.offsetWidth;
    height = freqCanvas.offsetHeight;
    freqCanvas.width = Math.floor(width * ratio);
    freqCanvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = () => {
    // 60 Hz 주변을 작게 출렁이는 모사 신호 (평균 회귀 랜덤워크)
    frequency += (60 - frequency) * 0.02 + (Math.random() - 0.5) * 0.0045;
    frequency = Math.min(60.05, Math.max(59.95, frequency));

    tick += 1;
    if (tick % 4 === 0) {
      history.push(frequency);
      if (history.length > capacity) history.shift();
    }
    if (tick % 9 === 0) valueEl.textContent = frequency.toFixed(3);

    if (ctx && width > 0 && history.length > 1) {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      history.forEach((sample, index) => {
        const x = (index / (capacity - 1)) * width;
        const y = height / 2 - ((sample - 60) / 0.05) * (height / 2 - 1);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "rgba(127, 232, 255, 0.9)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    window.requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  draw();
};

const setupHeroCanvas = () => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 양식화된 계통 단선도: 좌측 발전단지(풍력/화력/태양광)가 모선을 거쳐
  // 우측 도시 부하로 이어지고, 하단 해상풍력은 HVDC 링크로 연계됩니다.
  const NODES = {
    wind1: { x: 0.33, y: 0.14, type: "gen" },
    wind2: { x: 0.29, y: 0.33, type: "gen" },
    thermal: { x: 0.32, y: 0.56, type: "gen" },
    solar: { x: 0.37, y: 0.78, type: "gen" },
    offshore: { x: 0.45, y: 0.92, type: "gen" },
    bus1: { x: 0.49, y: 0.24, type: "bus" },
    bus2: { x: 0.52, y: 0.62, type: "bus" },
    hub: { x: 0.66, y: 0.4, type: "bus", major: true },
    conv1: { x: 0.57, y: 0.87, type: "conv" },
    conv2: { x: 0.8, y: 0.83, type: "conv" },
    load1: { x: 0.87, y: 0.15, type: "load" },
    load2: { x: 0.94, y: 0.4, type: "load" },
    load3: { x: 0.92, y: 0.64, type: "load" },
  };

  const LINES = [
    { from: "wind1", to: "bus1", bend: -0.04 },
    { from: "wind2", to: "bus1", bend: 0.03 },
    { from: "thermal", to: "bus2", bend: -0.03 },
    { from: "solar", to: "bus2", bend: 0.04 },
    { from: "bus1", to: "hub", bend: 0.04 },
    { from: "bus2", to: "hub", bend: -0.04 },
    { from: "bus1", to: "bus2", bend: 0.06, faint: true },
    { from: "hub", to: "load1", bend: -0.05 },
    { from: "hub", to: "load2", bend: 0 },
    { from: "hub", to: "load3", bend: 0.04 },
    { from: "offshore", to: "conv1", bend: 0.02 },
    { from: "conv1", to: "conv2", bend: 0.05, dc: true },
    { from: "conv2", to: "load3", bend: -0.03 },
  ];

  const NODE_COLORS = {
    gen: "rgba(82, 226, 164, 0.92)",
    bus: "rgba(127, 232, 255, 0.92)",
    conv: "rgba(246, 179, 74, 0.95)",
    load: "rgba(232, 244, 255, 0.95)",
  };

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  const particles = [];

  LINES.forEach((line, index) => {
    const count = line.dc ? 4 : line.faint ? 1 : 2;
    for (let i = 0; i < count; i += 1) {
      particles.push({
        line: index,
        t: (i + Math.random()) / count,
        speed: (line.dc ? 0.0034 : 0.0017) + Math.random() * 0.0009,
      });
    }
  });

  const lineGeometry = (line) => {
    const a = NODES[line.from];
    const b = NODES[line.to];
    const ax = a.x * width;
    const ay = a.y * height;
    const bx = b.x * width;
    const by = b.y * height;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const offset = line.bend * width;
    return {
      ax,
      ay,
      bx,
      by,
      cx: (ax + bx) / 2 - (dy / len) * offset,
      cy: (ay + by) / 2 + (dx / len) * offset,
    };
  };

  const quadPoint = (g, t) => {
    const u = 1 - t;
    return {
      x: u * u * g.ax + 2 * u * t * g.cx + t * t * g.bx,
      y: u * u * g.ay + 2 * u * t * g.cy + t * t * g.by,
    };
  };

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const drawScene = (time, withMotion) => {
    ctx.clearRect(0, 0, width, height);

    LINES.forEach((line) => {
      const g = lineGeometry(line);
      ctx.beginPath();
      ctx.moveTo(g.ax, g.ay);
      ctx.quadraticCurveTo(g.cx, g.cy, g.bx, g.by);

      if (line.dc) {
        ctx.strokeStyle = "rgba(246, 179, 74, 0.4)";
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = `rgba(96, 190, 255, ${line.faint ? 0.14 : 0.28})`;
        ctx.lineWidth = 1.2;
      }
      ctx.stroke();
    });

    if (withMotion) {
      particles.forEach((particle) => {
        particle.t += particle.speed;
        if (particle.t > 1) particle.t -= 1;

        const line = LINES[particle.line];
        const pos = quadPoint(lineGeometry(line), particle.t);

        ctx.save();
        ctx.shadowBlur = 7;
        ctx.shadowColor = line.dc ? "rgba(255, 196, 110, 0.9)" : "rgba(127, 232, 255, 0.9)";
        ctx.fillStyle = line.dc ? "rgba(255, 206, 130, 0.95)" : "rgba(170, 238, 255, 0.95)";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, line.dc ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    Object.values(NODES).forEach((node, index) => {
      const x = node.x * width;
      const y = node.y * height;
      const phase = index * 1.7;
      const pulse = withMotion ? 1 + 0.12 * Math.sin(time * 0.002 + phase) : 1;
      const radius = (node.major ? 6 : node.type === "load" ? 5 : 4.2) * pulse;
      const color = NODE_COLORS[node.type];

      if (withMotion && node.type === "gen") {
        const ringProgress = ((time * 0.001 + phase) % 3.4) / 3.4;
        ctx.strokeStyle = `rgba(82, 226, 164, ${0.34 * (1 - ringProgress)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(x, y, radius + ringProgress * 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (node.type === "conv") {
        ctx.fillStyle = color;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      } else if (node.type === "load") {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const loop = (time) => {
    drawScene(time, true);
    animationFrame = window.requestAnimationFrame(loop);
  };

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  resize();
  window.addEventListener("resize", resize);

  if (motionQuery.matches) {
    drawScene(0, false);
  } else {
    animationFrame = window.requestAnimationFrame(loop);
  }

  motionQuery.addEventListener?.("change", (event) => {
    if (event.matches) {
      window.cancelAnimationFrame(animationFrame);
      drawScene(0, false);
    } else {
      animationFrame = window.requestAnimationFrame(loop);
    }
  });
};

renderContent();
setupNavigation();
setupPublicationFilters();
setupReveal();
setupHeroStats();
setupFrequencyMeter();
setupHeroCanvas();
