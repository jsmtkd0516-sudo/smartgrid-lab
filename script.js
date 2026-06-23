const labData = window.labData ?? {};
const canvas = document.querySelector("[data-grid-canvas]");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderParagraphs = (value = "", className = "") => {
  const paragraphs = String(value)
    .split(/\n{2,}|\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (!paragraphs.length) return "";
  const cls = className ? ` class="${className}"` : "";
  return `<div${cls}>${paragraphs.map((part) => `<p>${escapeHtml(part)}</p>`).join("")}</div>`;
};

const SITE_BASE_URL = "https://jsmtkd0516-sudo.github.io/smartgrid-lab/";

const toAbsoluteUrl = (path = "") => {
  try {
    return new URL(path || ".", SITE_BASE_URL).href;
  } catch {
    return SITE_BASE_URL;
  }
};

const slugify = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const makePostId = (preferred, fallback) => slugify(preferred) || slugify(fallback) || "post";
const postPermalink = (post) => `news.html?post=${encodeURIComponent(post.id)}`;
const absolutePostPermalink = (post) => toAbsoluteUrl(postPermalink(post));

const setMetaContent = (selector, attrs, content) => {
  if (!content) return;
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => meta.setAttribute(key, value));
    document.head.append(meta);
  }
  meta.setAttribute("content", content);
};

const setCanonicalUrl = (href) => {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = href;
};

const defaultPageMeta = {
  title: document.title,
  description: document.head.querySelector('meta[name="description"]')?.content || "",
  image: document.head.querySelector('meta[property="og:image"]')?.content || toAbsoluteUrl("assets/hero-smart-grid.png"),
  url: (() => {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    return url.href;
  })(),
};

const updateDefaultMeta = () => {
  document.title = defaultPageMeta.title;
  setMetaContent('meta[name="description"]', { name: "description" }, defaultPageMeta.description);
  setMetaContent('meta[property="og:type"]', { property: "og:type" }, "website");
  setMetaContent('meta[property="og:title"]', { property: "og:title" }, defaultPageMeta.title);
  setMetaContent('meta[property="og:description"]', { property: "og:description" }, defaultPageMeta.description);
  setMetaContent('meta[property="og:image"]', { property: "og:image" }, defaultPageMeta.image);
  setMetaContent('meta[property="og:url"]', { property: "og:url" }, defaultPageMeta.url);
  setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, defaultPageMeta.title);
  setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, defaultPageMeta.description);
  setMetaContent('meta[name="twitter:image"]', { name: "twitter:image" }, defaultPageMeta.image);
  setCanonicalUrl(defaultPageMeta.url);
};

const updatePostMeta = (post) => {
  const title = `${post.title} · Yonsei Smartgrid Laboratory`;
  const description = post.description || "Yonsei University Smartgrid Laboratory post.";
  const image = post.image ? toAbsoluteUrl(post.image) : defaultPageMeta.image;
  const url = absolutePostPermalink(post);
  document.title = title;
  setMetaContent('meta[name="description"]', { name: "description" }, description);
  setMetaContent('meta[property="og:type"]', { property: "og:type" }, "article");
  setMetaContent('meta[property="og:title"]', { property: "og:title" }, title);
  setMetaContent('meta[property="og:description"]', { property: "og:description" }, description);
  setMetaContent('meta[property="og:image"]', { property: "og:image" }, image);
  setMetaContent('meta[property="og:url"]', { property: "og:url" }, url);
  setMetaContent('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
  setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, title);
  setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  setMetaContent('meta[name="twitter:image"]', { name: "twitter:image" }, image);
  setCanonicalUrl(url);
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

  const all = (labData.projects ?? []).filter((item) => !item.empty);
  const isActive = (item) => /active/i.test(item.status ?? "");
  const active = all.filter(isActive);
  const completed = all.filter((item) => !isActive(item));

  const card = (item, statusKey) => `
    <article data-status="${statusKey}">
      <span class="project-status-tag ${statusKey}">${escapeHtml(item.status)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      ${item.description ? `<p class="project-funder">${escapeHtml(item.description)}</p>` : ""}
    </article>`;

  const divider = (label, n) =>
    `<div class="project-divider"><span>${escapeHtml(label)}</span><span class="project-divider-count">${n}</span></div>`;

  const sections = [
    `<div class="project-summary">
       <span class="proj-stat"><strong>${all.length}</strong> 총 과제</span>
       <span class="proj-stat"><strong>${active.length}</strong> 진행 중</span>
       <span class="proj-stat"><strong>${completed.length}</strong> 완료</span>
     </div>`,
  ];
  if (active.length) {
    sections.push(divider("진행 중 과제", active.length));
    sections.push(...active.map((item) => card(item, "active")));
  }
  if (completed.length) {
    sections.push(divider("완료 과제", completed.length));
    sections.push(...completed.map((item) => card(item, "completed")));
  }
  target.innerHTML = sections.join("");
};

// 제목/게재지 텍스트에서 연구 주제 태그를 추정한다 (필터·표시용 보조 분류, 사실 단정 아님).
const PUB_TOPICS = [
  { key: "hvdc", label: "HVDC/MMC", re: /\bhvdc\b|\bmmc\b|modular multilevel|multilevel converter|\bvsc\b|\blcc\b|dc grid|dc network|dc fault|dc transmission/i },
  { key: "power-electronics", label: "Power Electronics", re: /converter|inverter|power electronic|\bfacts\b|statcom|grid-forming|grid forming|grid following|\bpwm\b/i },
  { key: "emt", label: "EMT", re: /\bemt\b|electromagnetic transient/i },
  { key: "renewable", label: "Renewable/ESS", re: /\bwind\b|solar|photovolt|\bpv\b|renewable|energy storage|\bess\b|battery|\bder\b|distributed generation|distributed energy/i },
  { key: "stability", label: "Stability/Dynamics", re: /stability|inertia|damping|dynamic|frequency|oscillat|sub-?synchronous|\bsso\b|\bssr\b|small-?signal/i },
  { key: "ai", label: "AI/Forecasting", re: /forecast|prediction|deep learning|machine learning|neural|reinforcement|data-driven|learning-based/i },
  { key: "estimation", label: "Parameter Est.", re: /estimation|parameter|identification|calibrat/i },
  { key: "load", label: "Load Modeling", re: /load model|composite load|load modell?ing/i },
  { key: "protection", label: "Protection/Fault", re: /protection|\bfault\b|relay|breaker|short-?circuit/i },
  { key: "market", label: "Market/Operation", re: /market|economic dispatch|unit commitment|\boperation\b|reserve|ancillary|scheduling|optimal power flow|\bopf\b/i },
];

const pubTopicTags = (text = "") => PUB_TOPICS.filter((topic) => topic.re.test(text));

const pubType = (venue = "") => {
  if (/대한전기학회|전기학회|한국|korean institute|\bkiee\b|transactions of the korean/i.test(venue))
    return { key: "domestic", label: "Domestic" };
  if (/conference|proceedings|symposium|\bmeeting\b|workshop|congress|\bpesgm\b|powertech|\becce\b|\bapec\b|\bipec\b/i.test(venue))
    return { key: "conference", label: "Conference" };
  return { key: "journal", label: "Journal" };
};

// links/doi 등이 데이터에 있을 때만 버튼을 그린다 (없는 링크를 지어내지 않는다).
const PUB_LINK_DEFS = [
  ["doi", "DOI"],
  ["paper", "PDF"],
  ["code", "Code"],
  ["slides", "Slides"],
  ["video", "Video"],
];

const pubLinkButtons = (item) => {
  const links = item.links ?? {};
  const parts = PUB_LINK_DEFS.filter(([key]) => item[key] || links[key]).map(([key, label]) => {
    const href = item[key] || links[key];
    return `<a class="pub-link-btn" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${label}</a>`;
  });
  return parts.length ? `<div class="pub-links">${parts.join("")}</div>` : "";
};

const renderPublications = () => {
  const target = document.querySelector("[data-publication-list]");
  if (!target) return;

  const yearNum = (value) => {
    const n = parseInt(String(value).replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : -1;
  };

  const pubs = (labData.publications ?? [])
    .filter((item) => !item.empty)
    .map((item) => {
      const type = pubType(item.venue || "");
      const topics = pubTopicTags(`${item.title || ""} ${item.venue || ""}`);
      const recent = Array.isArray(item.tags) && item.tags.includes("recent");
      return {
        ...item,
        _type: type,
        _topics: topics,
        _recent: recent,
        _tags: [type.key, ...(recent ? ["recent"] : []), ...topics.map((topic) => topic.key)],
      };
    })
    .sort((a, b) => yearNum(b.year) - yearNum(a.year));

  const typeCount = (key) => pubs.filter((item) => item._type.key === key).length;
  const recentCount = pubs.filter((item) => item._recent).length;
  const years = pubs.map((item) => yearNum(item.year)).filter((n) => n > 0);
  const yearRange = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "";

  // 요약 통계
  const summary = document.querySelector("[data-pub-summary]");
  if (summary) {
    const stat = (n, label) => `<span class="pub-stat"><strong>${n}</strong>${escapeHtml(label)}</span>`;
    summary.innerHTML = [
      stat(pubs.length, " publications"),
      typeCount("journal") ? stat(typeCount("journal"), " journal") : "",
      typeCount("conference") ? stat(typeCount("conference"), " conference") : "",
      typeCount("domestic") ? stat(typeCount("domestic"), " domestic") : "",
      yearRange ? `<span class="pub-stat pub-stat-muted">${escapeHtml(yearRange)}</span>` : "",
    ].join("");
  }

  // 필터 칩: All / Recent / 유형 / 주제(2건 이상)
  const topicCounts = new Map();
  pubs.forEach((item) => item._topics.forEach((topic) => topicCounts.set(topic.key, (topicCounts.get(topic.key) || 0) + 1)));
  const topicChips = PUB_TOPICS.filter((topic) => (topicCounts.get(topic.key) || 0) >= 2);

  const filterBar = document.querySelector("[data-pub-filter-bar]");
  if (filterBar) {
    const chip = (key, label, n) =>
      `<button class="filter-button" type="button" data-pub-filter="${escapeHtml(key)}">${escapeHtml(label)}<span class="chip-count">${n}</span></button>`;
    filterBar.innerHTML = [
      chip("all", "All", pubs.length),
      recentCount ? chip("recent", "Recent", recentCount) : "",
      typeCount("journal") ? chip("journal", "Journal", typeCount("journal")) : "",
      typeCount("conference") ? chip("conference", "Conference", typeCount("conference")) : "",
      typeCount("domestic") ? chip("domestic", "Domestic", typeCount("domestic")) : "",
      ...topicChips.map((topic) => chip(topic.key, topic.label, topicCounts.get(topic.key))),
    ].join("");
  }

  // 카드 (연도 내림차순 평면 목록, 좌측에 연도+유형)
  target.innerHTML = pubs
    .map(
      (item) => `
        <article class="publication-item reveal" data-tags="${escapeHtml(item._tags.join(" "))}">
          <div class="pub-side">
            <time>${escapeHtml(item.year || "")}</time>
            <span class="pub-type pub-type-${item._type.key}">${escapeHtml(item._type.label)}</span>
          </div>
          <div class="pub-main">
            <h3 class="pub-title">${escapeHtml(item.title)}</h3>
            ${item.authors ? `<p class="pub-authors">${escapeHtml(item.authors)}</p>` : ""}
            <p class="pub-venue">${escapeHtml(item.venue || "")}</p>
            ${item._topics.length ? `<div class="pub-tags">${item._topics.map((topic) => `<span>${escapeHtml(topic.label)}</span>`).join("")}</div>` : ""}
            ${pubLinkButtons(item)}
          </div>
        </article>`
    )
    .join("");

  // 필터 동작 (단일 선택, 토큰 단위 정확 매칭)
  if (filterBar) {
    const apply = (key) => {
      target.querySelectorAll(".publication-item").forEach((card) => {
        const tags = (card.dataset.tags || "").split(/\s+/);
        card.classList.toggle("is-hidden", key !== "all" && !tags.includes(key));
      });
    };
    const update = (key) => {
      filterBar.querySelectorAll("[data-pub-filter]").forEach((button) =>
        button.classList.toggle("is-active", button.dataset.pubFilter === key)
      );
      apply(key);
    };
    filterBar.onclick = (event) => {
      const button = event.target instanceof Element ? event.target.closest("[data-pub-filter]") : null;
      if (!button) return;
      update(button.dataset.pubFilter || "all");
    };
    // 다른 페이지(예: research.html?topic=hvdc)에서 넘어오면 해당 필터로 시작한다.
    const params = new URLSearchParams(location.search);
    const requested = params.get("topic") || params.get("filter") || "all";
    const valid = [...filterBar.querySelectorAll("[data-pub-filter]")].some(
      (button) => button.dataset.pubFilter === requested
    );
    update(valid ? requested : "all");
  }
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

// 사진이 없을 때 보여줄 "얼굴 들어갈 자리" 자리표시자 (실제 사진과 같은 크기/모양).
const photoSlot = (name, empty) => `
  <span class="person-photo person-photo-empty ${empty ? "is-add" : ""}" role="img" aria-label="${escapeHtml(
    name
  )} 사진 자리">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5 19.4c0-3.7 3.2-5.7 7-5.7s7 2 7 5.7" />
    </svg>
  </span>
`;

const LINK_ICONS = {
  email:
    '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  scholar:
    '<svg viewBox="0 0 24 24"><path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V16c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5"/></svg>',
  github:
    '<svg viewBox="0 0 24 24"><path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.52.1.71-.23.71-.5v-1.96C6.5 20 5.9 18.2 5.9 18.2c-.46-1.17-1.12-1.48-1.12-1.48-.92-.63.07-.62.07-.62 1.02.07 1.55 1.05 1.55 1.05.9 1.55 2.37 1.1 2.95.84.09-.66.35-1.1.64-1.36-2.25-.26-4.62-1.13-4.62-5.02 0-1.11.4-2.02 1.04-2.73-.1-.26-.45-1.3.1-2.7 0 0 .85-.27 2.78 1.04a9.6 9.6 0 0 1 5.06 0c1.93-1.31 2.78-1.04 2.78-1.04.55 1.4.2 2.44.1 2.7.65.71 1.04 1.62 1.04 2.73 0 3.9-2.38 4.76-4.64 5.01.36.32.69.94.69 1.9v2.82c0 .27.18.6.71.5A10.5 10.5 0 0 0 12 1.5Z"/></svg>',
};

// 링크가 있으면 활성 아이콘, 없으면 점선 자리표시 아이콘.
const linkIcon = (type, href) => {
  const cls = type === "github" ? "person-link gh" : "person-link";
  const svg = LINK_ICONS[type];
  if (href) {
    return `<a class="${cls}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" aria-label="${type}">${svg}</a>`;
  }
  return `<span class="${cls} is-empty" aria-hidden="true">${svg}</span>`;
};

// 사진이 없는 실제 멤버에게는 이름 기반 컬러 이니셜 아바타 (가짜 얼굴이 아니라 자리표시 아바타).
const AVATAR_COLORS = ["#145fbb", "#0b4a97", "#3bb7e8", "#1fbf9a", "#2b6fb0", "#1b8f7a", "#5a7fb5", "#0f7a63"];
const initialsOf = (name = "") => {
  const n = String(name).trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2 && /[A-Za-z]/.test(parts[0])) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (/[A-Za-z]/.test(n) ? n.slice(0, 2) : n.slice(0, 1)).toUpperCase();
};
const avatarColor = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};
const initialAvatar = (name) => `
  <span class="person-photo person-avatar" role="img" aria-label="${escapeHtml(name)}" style="background:${avatarColor(name)}">
    <span class="person-avatar-initials">${escapeHtml(initialsOf(name))}</span>
  </span>`;

const memberCard = (person) => {
  const photo = person.photo
    ? `<img class="person-photo" src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)} profile photo" />`
    : person.empty
      ? photoSlot(person.name, true)
      : initialAvatar(person.name);

  // 값이 있는 링크만 활성 아이콘으로 표시 (이메일은 mailto로).
  const links = person.links ?? {};
  const parts = [];
  if (links.email) parts.push(linkIcon("email", "mailto:" + links.email));
  if (links.scholar) parts.push(linkIcon("scholar", links.scholar));
  if (links.github) parts.push(linkIcon("github", links.github));
  const linkRow = parts.length ? `<div class="person-links">${parts.join("")}</div>` : "";

  return `
    <article class="person-card reveal ${person.empty ? "empty-card" : ""}">
      ${photo}
      <div class="person-info">
        <h3>${escapeHtml(person.name)}</h3>
        <p>${escapeHtml(person.role)}</p>
        <small>${escapeHtml(person.interest)}</small>
        ${linkRow}
      </div>
    </article>
  `;
};

const renderMembers = () => {
  const target = document.querySelector("[data-member-list]");
  if (!target) return;

  // 교수(lead)는 Professor 페이지에서 따로 보여주므로 제외하고, 나머지는 과정(role)별로 묶는다.
  const people = (labData.members ?? []).filter((person) => !person.lead);
  const real = people.filter((person) => !person.empty);
  const adds = people.filter((person) => person.empty);

  const order = [];
  const byRole = new Map();
  real.forEach((person) => {
    if (!byRole.has(person.role)) {
      byRole.set(person.role, []);
      order.push(person.role);
    }
    byRole.get(person.role).push(person);
  });

  let html = order
    .map(
      (role) => `
        <div class="people-group">
          <h3 class="people-group-title">${escapeHtml(role)}</h3>
          <div class="people-grid">${byRole.get(role).map(memberCard).join("")}</div>
        </div>
      `
    )
    .join("");

  if (adds.length) {
    html += `
      <div class="people-group">
        <h3 class="people-group-title is-muted">멤버 추가 자리</h3>
        <div class="people-grid">${adds.map(memberCard).join("")}</div>
      </div>
    `;
  }

  target.innerHTML = html;
};

const renderAlumni = () => {
  const target = document.querySelector("[data-alumni-list]");
  if (!target) return;

  // 진출처 문자열로 진로 유형을 분류 (기업/학계/연구소/공공).
  const classify = (to) => {
    if (!to) return null;
    const t = to.toLowerCase();
    if (/university|professor|polytechnic|kaist|postdoc|univ\.?\b/.test(t)) return { cls: "academia", label: "Academia" };
    if (/keri|kitech|krri|kepri|research institute/.test(t)) return { cls: "research", label: "Research" };
    if (/navy|air force|army/.test(t)) return { cls: "public", label: "Public" };
    return { cls: "industry", label: "Industry" };
  };

  const data = labData.alumni ?? {};
  const groups = [
    { title: "Ph.D. Alumni", list: data.phd ?? [] },
    { title: "M.S. Alumni", list: data.ms ?? [] },
  ];

  target.innerHTML = groups
    .filter((group) => group.list.length)
    .map(
      (group) => `
        <div class="alumni-group">
          <h3 class="people-group-title">${escapeHtml(group.title)}</h3>
          <ul class="alumni-list">
            ${group.list
              .map((a) => {
                const ty = classify(a.to);
                return `
                <li>
                  <span class="al-name">${escapeHtml(a.name)}</span>
                  ${a.year ? `<span class="al-year">${escapeHtml(a.year)}</span>` : ""}
                  ${ty ? `<span class="al-type ${ty.cls}">${ty.label}</span>` : ""}
                  ${a.to ? `<span class="al-to">${escapeHtml(a.to)}</span>` : ""}
                </li>`;
              })
              .join("")}
          </ul>
        </div>
      `
    )
    .join("");
};

const findRelatedNews = (item) => {
  const key = (item.relatedNewsTitle || item.newsTitle || item.caption || "").trim().toLowerCase();
  if (!key) return null;
  return (labData.news ?? []).find((news) => !news.empty && String(news.title || "").trim().toLowerCase() === key) || null;
};

const galleryPost = (item, index = 0) => {
  const related = findRelatedNews(item);
  return {
    id: item.id || item.slug || makePostId(item.caption || item.title || related?.title, `gallery-${index + 1}`),
    source: "Gallery",
    date: item.date || related?.date || "",
    category: item.category || related?.category || "Gallery",
    type: "Gallery",
    title: item.title || item.caption || related?.title || "Gallery",
    description: item.description || related?.description || item.alt || "",
    body: item.body || related?.body || "",
    image: item.image || related?.image || "",
    alt: item.alt || item.caption || related?.title || "Gallery image",
  };
};

const titleKey = (value = "") => String(value).trim().toLowerCase();

const ensureUniquePostIds = (posts) => {
  const used = new Set();
  return posts.map((post, index) => {
    const base = makePostId(post.id || post.title, `${post.source || "post"}-${index + 1}`);
    let id = base;
    let suffix = 2;
    while (used.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(id);
    return { ...post, id };
  });
};

// ?demo=1 미리보기 전용 샘플 게시글 — 기본/배포에는 절대 포함되지 않으며 모두 "[예시]" 라벨이 붙는다.
// 배포 전 실제 소식으로 교체하거나 그대로 두면(플래그 없으면) 사이트에 안 나온다.
const DEMO_MODE = new URLSearchParams(location.search).get("demo") === "1";
const DEMO_POSTS = [
  {
    date: "2026.06", category: "예시 데이터", type: "Award",
    title: "[예시] 연구실, IEEE PES General Meeting 2026 논문 발표",
    description: "데모용 샘플 게시글입니다. 실제 소식이 아니며 ?demo=1 미리보기에서만 보입니다.",
    body: "이 글은 뉴스 페이지가 실제 콘텐츠로 채워졌을 때의 레이아웃을 보여주기 위한 예시입니다.\n\n배포 전에 실제 소식으로 교체하거나 삭제하세요. 플래그(?demo=1) 없이 접속하면 이 글은 표시되지 않습니다.",
  },
  {
    date: "2026.05", category: "예시 데이터", type: "Paper",
    title: "[예시] 그리드포밍 컨버터 안정도 연구 국제 학술지 게재",
    description: "데모용 샘플 게시글입니다. 실제 소식이 아닙니다.",
    body: "예시 본문입니다. 실제 논문/수상/행사 소식으로 교체하세요.",
  },
  {
    date: "2026.04", category: "예시 데이터", type: "Welcome",
    title: "[예시] 신규 석박사통합과정 연구원 합류",
    description: "데모용 샘플 게시글입니다. 실제 소식이 아닙니다.",
    body: "예시 본문입니다. 실제 소식으로 교체하세요.",
  },
  {
    date: "2026.03", category: "예시 데이터", type: "Research",
    title: "[예시] 한전 전력연구원 공동연구 과제 착수",
    description: "데모용 샘플 게시글입니다. 실제 소식이 아닙니다.",
    body: "예시 본문입니다. 실제 소식으로 교체하세요.",
  },
];

const buildPostFeed = () => {
  const posts = (labData.news ?? [])
    .filter((item) => !item.empty)
    .map((item, index) => ({
      id: item.id || item.slug || makePostId(item.title, `news-${index + 1}`),
      source: "News",
      type: item.type || item.category || "News",
      date: item.date || "",
      category: item.category || "News",
      title: item.title || "Untitled",
      description: item.description || "",
      body: item.body || "",
      image: item.image || "",
      alt: item.alt || item.title || "News image",
    }));

  (labData.gallery ?? [])
    .filter((item) => !item.empty)
    .forEach((item, index) => {
      const related = findRelatedNews(item);
      const relatedKey = titleKey(related?.title);
      const existing = relatedKey ? posts.find((post) => titleKey(post.title) === relatedKey) : null;
      if (existing) {
        if (!existing.image && item.image) existing.image = item.image;
        if (!existing.body && item.body) existing.body = item.body;
        if (!existing.description && item.description) existing.description = item.description;
        existing.alt = item.alt || existing.alt;
        return;
      }
      posts.push(galleryPost(item, index));
    });

  const feed = DEMO_MODE
    ? [
        ...DEMO_POSTS.map((post, index) => ({
          id: `demo-${index + 1}`,
          source: "Demo",
          type: post.type || "News",
          date: post.date || "",
          category: post.category || "예시 데이터",
          title: post.title,
          description: post.description || "",
          body: post.body || "",
          image: "",
          alt: post.title,
          demo: true,
        })),
        ...posts,
      ]
    : posts;

  return ensureUniquePostIds(feed);
};

const postMedia = (post, className = "post-thumb") =>
  post.image
    ? `<img class="${className}" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt || post.title)}" loading="lazy" />`
    : `<span class="${className} post-thumb-placeholder" role="img" aria-label="${escapeHtml(post.title)} 썸네일">
        <span>${escapeHtml(post.category || post.source || "Post")}</span>
      </span>`;

const postCategoryKey = (post) => slugify(post.category || post.source || "Post") || "post";

const postTypeLabel = (post) => {
  const type = post.type || post.category || post.source || "Post";
  if (/recruit/i.test(type)) return "Recruiting";
  if (/gallery|visual|photo/i.test(type)) return "Gallery";
  if (/paper|publication/i.test(type)) return "Publication";
  if (/award|press|media/i.test(type)) return "Achievement";
  if (/research|center|project/i.test(type)) return "Research";
  return type;
};

const postContextLinks = (post) => {
  const text = `${post.category || ""} ${post.type || ""} ${post.title || ""}`.toLowerCase();
  const links = [];
  if (/recruit|모집/.test(text)) links.push(["Recruiting", "recruiting.html"]);
  if (/research|grid|hvdc|converter|ai|center|project|연구/.test(text)) links.push(["Research", "research.html"]);
  if (/project|center|hvdc|과제/.test(text)) links.push(["Projects", "projects.html"]);
  if (/paper|publication|논문/.test(text)) links.push(["Publications", "publications.html"]);
  links.push(["Contact", "contact.html"]);

  const seen = new Set();
  return links.filter(([, href]) => {
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
};

const relatedPostsFor = (post, posts) => {
  const category = postCategoryKey(post);
  const words = new Set(
    `${post.title || ""} ${post.category || ""} ${post.description || ""}`
      .toLowerCase()
      .split(/[^a-z0-9가-힣]+/)
      .filter((word) => word.length > 2)
  );

  return posts
    .filter((item) => item.id !== post.id)
    .map((item) => {
      let score = postCategoryKey(item) === category ? 5 : 0;
      `${item.title || ""} ${item.category || ""} ${item.description || ""}`
        .toLowerCase()
        .split(/[^a-z0-9가-힣]+/)
        .filter((word) => word.length > 2)
        .forEach((word) => {
          if (words.has(word)) score += 1;
        });
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
};

const postCategories = (posts) => {
  const seen = new Map();
  posts.forEach((post) => {
    const key = postCategoryKey(post);
    if (!seen.has(key)) seen.set(key, post.category || post.source || "Post");
  });
  return [...seen].map(([key, label]) => ({ key, label }));
};

const applyPostFilter = (board, key) => {
  board.querySelectorAll("[data-post-category]").forEach((card) => {
    card.classList.toggle("is-hidden", key !== "all" && card.dataset.postCategory !== key);
  });
};

const renderPostFilters = (board, posts) => {
  const filterBar = board.parentElement?.querySelector("[data-post-filters]");
  if (!filterBar) return;

  const categories = postCategories(posts);
  if (categories.length < 2) {
    filterBar.hidden = true;
    return;
  }

  const active = categories.some((item) => item.key === filterBar.dataset.activeFilter)
    ? filterBar.dataset.activeFilter
    : "all";

  filterBar.hidden = false;
  filterBar.innerHTML = [
    `<button class="post-filter-button" type="button" data-post-filter="all">All</button>`,
    ...categories.map(
      (item) =>
        `<button class="post-filter-button" type="button" data-post-filter="${escapeHtml(item.key)}">${escapeHtml(
          item.label
        )}</button>`
    ),
  ].join("");

  const update = (key) => {
    filterBar.dataset.activeFilter = key;
    filterBar.querySelectorAll("[data-post-filter]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.postFilter === key);
    });
    applyPostFilter(board, key);
  };

  filterBar.onclick = (event) => {
    const button = event.target instanceof Element ? event.target.closest("[data-post-filter]") : null;
    if (!button) return;
    update(button.dataset.postFilter || "all");
  };

  update(active);
};

const getRoutePostId = () => {
  const params = new URLSearchParams(location.search);
  return params.get("post") || params.get("id") || decodeURIComponent(location.hash.replace(/^#/, ""));
};

let activePostFeed = [];

const renderPostDetail = (target, post) => {
  const posts = buildPostFeed();
  const relatedPosts = relatedPostsFor(post, posts);
  const contextLinks = postContextLinks(post);
  const body = post.body || post.description || "상세 본문이 아직 입력되지 않았습니다. 관리자 편집기에서 본문을 추가하면 이 영역이 게시글 본문으로 표시됩니다.";

  target.innerHTML = `
    <a class="post-detail-back" href="news.html">&larr; 모든 게시글</a>
    <div class="post-detail-shell">
      <header class="post-detail-header">
        <div class="post-detail-kicker">
          <span>${escapeHtml(post.source || "Post")}</span>
          <span>${escapeHtml(postTypeLabel(post))}</span>
        </div>
        <p class="news-meta">
          ${post.date ? `<time>${escapeHtml(post.date)}</time>` : ""}
          <span class="news-category">${escapeHtml(post.category)}</span>
        </p>
        <h1>${escapeHtml(post.title)}</h1>
        ${post.description ? `<p class="post-detail-summary">${escapeHtml(post.description)}</p>` : ""}
      </header>
      <figure class="post-detail-media">
        ${
          post.image
            ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt || post.title)}" />`
            : `<div class="gallery-placeholder"><span>${escapeHtml(post.category || "Post")}</span></div>`
        }
      </figure>
      <div class="post-detail-layout">
        ${renderParagraphs(body, "post-detail-body")}
        <aside class="post-detail-sidebar" aria-label="게시글 정보">
          <div class="post-info-card">
            <span>Post type</span>
            <strong>${escapeHtml(postTypeLabel(post))}</strong>
          </div>
          <div class="post-info-card">
            <span>Permalink</span>
            <a href="${escapeHtml(postPermalink(post))}">${escapeHtml(post.id)}</a>
          </div>
          <div class="post-info-card">
            <span>Related pages</span>
            <div class="post-context-links">
              ${contextLinks.map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("")}
            </div>
          </div>
        </aside>
      </div>
      ${
        relatedPosts.length
          ? `<section class="post-related" aria-label="관련 게시글">
              <div class="post-related-head">
                <span>More from the lab</span>
                <h2>관련 게시글</h2>
              </div>
              <div class="post-related-grid">
                ${relatedPosts
                  .map(
                    (item) => `
                      <a class="post-related-card" href="${escapeHtml(postPermalink(item))}">
                        <span>${escapeHtml(item.category || postTypeLabel(item))}</span>
                        <strong>${escapeHtml(item.title)}</strong>
                        <small>${escapeHtml(item.description || "")}</small>
                      </a>
                    `
                  )
                  .join("")}
              </div>
            </section>`
          : ""
      }
      <footer class="post-detail-actions">
        <a class="post-detail-link" href="news.html">목록으로</a>
        <button class="post-detail-copy" type="button" data-post-detail-copy="${escapeHtml(
          absolutePostPermalink(post)
        )}">링크 복사</button>
      </footer>
    </div>
  `;

  const copyButton = target.querySelector("[data-post-detail-copy]");
  copyButton?.addEventListener("click", () => {
    const url = copyButton.dataset.postDetailCopy || location.href;
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        copyButton.textContent = "복사됨";
        window.setTimeout(() => {
          copyButton.textContent = "링크 복사";
        }, 1200);
      })
      .catch(() => {
        copyButton.textContent = "복사 실패";
      });
  });

  updatePostMeta(post);
};

const renderMissingPost = (target, id) => {
  target.innerHTML = `
    <a class="post-detail-back" href="news.html">&larr; 모든 게시글</a>
    <div class="post-detail-shell post-detail-missing">
      <p class="eyebrow">Post not found</p>
      <h1>게시글을 찾을 수 없습니다.</h1>
      <p>요청한 게시글 ID ${escapeHtml(id || "")}에 해당하는 게시글이 없습니다.</p>
      <a class="post-detail-link" href="news.html">목록으로 돌아가기</a>
    </div>
  `;
  updateDefaultMeta();
};

const renderPostPage = (posts) => {
  const detail = document.querySelector("[data-post-detail]");
  if (!detail) return false;

  const routeId = getRoutePostId();
  const indexHeading = document.querySelector("[data-post-index-heading]");
  const list = document.querySelector("[data-post-list], [data-news-list]");
  const filters = document.querySelector("[data-post-filters]");

  if (!routeId) {
    detail.hidden = true;
    if (indexHeading) indexHeading.hidden = false;
    if (list) list.hidden = false;
    if (filters) filters.hidden = false;
    updateDefaultMeta();
    return false;
  }

  if (indexHeading) indexHeading.hidden = true;
  if (list) list.hidden = true;
  if (filters) filters.hidden = true;
  detail.hidden = false;

  const post = posts.find((item) => item.id === routeId);
  if (post) renderPostDetail(detail, post);
  else renderMissingPost(detail, routeId);
  return true;
};

const renderPostBoard = (target) => {
  const posts = buildPostFeed();
  activePostFeed = posts;

  target.innerHTML = posts
    .map(
      (post, index) => `
        <article class="post-card-wrap reveal" data-post-category="${escapeHtml(postCategoryKey(post))}">
          <a class="post-card" href="${escapeHtml(postPermalink(post))}" data-post-id="${escapeHtml(post.id)}" data-post-index="${index}">
            <span class="post-thumb-frame">${postMedia(post)}</span>
            <span class="post-card-body">
              <span class="post-card-kicker">
                <span>${escapeHtml(post.source || "Post")}</span>
                <span>${escapeHtml(postTypeLabel(post))}</span>
              </span>
              <span class="news-meta">
                ${post.date ? `<time>${escapeHtml(post.date)}</time>` : ""}
                <span class="news-category">${escapeHtml(post.category)}</span>
              </span>
              <span class="post-card-title">${escapeHtml(post.title)}</span>
              <span class="post-card-summary">${escapeHtml(post.description)}</span>
              <span class="post-card-cta">게시글 보기</span>
            </span>
          </a>
        </article>
      `
    )
    .join("");

  renderPostFilters(target, posts);
};

const renderNews = () => {
  const posts = buildPostFeed();
  activePostFeed = posts;
  if (renderPostPage(posts)) return;
  document.querySelectorAll("[data-post-list], [data-news-list]").forEach(renderPostBoard);
};

const renderGallery = () => {
  document.querySelectorAll("[data-gallery-list]").forEach(renderPostBoard);
};

const renderPatents = () => {
  const target = document.querySelector("[data-patent-list]");
  if (!target) return;

  const data = labData.patents ?? {};
  const intl = (data.international ?? []).length;
  const domestic = (data.domestic ?? []).length;
  const groups = [
    { title: "International Patents", list: data.international ?? [] },
    { title: "Domestic Patents (국내)", list: data.domestic ?? [] },
  ];

  const summary = `
    <div class="patent-summary">
      <span class="proj-stat"><strong>${intl + domestic}</strong> 특허</span>
      ${intl ? `<span class="proj-stat"><strong>${intl}</strong> 국제</span>` : ""}
      ${domestic ? `<span class="proj-stat"><strong>${domestic}</strong> 국내</span>` : ""}
    </div>`;

  target.innerHTML = summary + groups
    .filter((group) => group.list.length)
    .map(
      (group) => `
        <div class="patent-group">
          <h3 class="people-group-title">${escapeHtml(group.title)}</h3>
          <div class="patent-list">
            ${group.list
              .map(
                (p) => `
                <article class="patent-item">
                  <h4>${escapeHtml(p.title)}</h4>
                  <div class="patent-meta">
                    ${p.no ? `<span class="patent-no">${escapeHtml(p.no)}</span>` : ""}
                    ${p.date ? `<span>${escapeHtml(p.date)}</span>` : ""}
                    ${p.inventors ? `<span>${escapeHtml(p.inventors)}</span>` : ""}
                  </div>
                </article>`
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");
};

const renderHomeNews = () => {
  const target = document.querySelector("[data-home-news]");
  if (!target) return;

  const items = buildPostFeed().slice(0, 3);
  target.innerHTML = items
    .map(
      (item) => `
        <a class="home-news-item" href="${escapeHtml(postPermalink(item))}">
          <span class="home-news-thumb-frame">${postMedia(item, "home-news-thumb")}</span>
          <span class="home-news-copy">
            <span class="news-meta">
              ${item.date ? `<time>${escapeHtml(item.date)}</time>` : ""}
              <span class="news-category">${escapeHtml(item.category)}</span>
            </span>
            <span class="home-news-title">${escapeHtml(item.title)}</span>
            <span class="home-news-summary">${escapeHtml(item.description)}</span>
          </span>
        </a>
      `
    )
    .join("");
};

// research.html의 각 연구 주제 컬럼을 실제 논문 수와 연결한다 (cross-link).
const renderResearchTopics = () => {
  const cols = document.querySelectorAll("[data-topic-key]");
  if (!cols.length) return;

  const pubs = (labData.publications ?? []).filter((item) => !item.empty);
  const countForTopic = (key) => {
    const topic = PUB_TOPICS.find((t) => t.key === key);
    if (!topic) return 0;
    return pubs.filter((item) => topic.re.test(`${item.title || ""} ${item.venue || ""}`)).length;
  };

  cols.forEach((col) => {
    const slot = col.querySelector("[data-topic-links]");
    if (!slot) return;
    const key = col.dataset.topicKey;
    const n = countForTopic(key);
    slot.innerHTML = [
      n
        ? `<a class="topic-link" href="publications.html?topic=${encodeURIComponent(key)}">관련 논문 <strong>${n}</strong>편 &rarr;</a>`
        : "",
      `<a class="topic-link topic-link-ghost" href="projects.html">관련 과제 &rarr;</a>`,
    ].join("");
  });
};

// data-copy-text 속성을 가진 버튼: 클릭 시 그 텍스트를 클립보드에 복사한다.
const setupCopyButtons = () => {
  document.querySelectorAll("[data-copy-text], [data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      let text = button.dataset.copyText || "";
      if (button.dataset.copyTarget) {
        const el = document.querySelector(button.dataset.copyTarget);
        text = el ? (el.value ?? el.textContent ?? "") : "";
      }
      const label = button.textContent;
      navigator.clipboard
        ?.writeText(text)
        .then(() => {
          button.textContent = "복사됨";
          window.setTimeout(() => {
            button.textContent = label;
          }, 1200);
        })
        .catch(() => {
          button.textContent = "복사 실패";
        });
    });
  });
};

const renderContent = () => {
  renderFeaturedProject();
  renderProjects();
  renderPublications();
  renderResearchTopics();
  renderAchievements();
  renderMembers();
  renderAlumni();
  renderPatents();
  renderNews();
  renderHomeNews();
  renderGallery();
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
  const members = (labData.members ?? []).filter((item) => !item.empty).length;
  const projectList = (labData.projects ?? []).filter((item) => !item.empty);
  const projects =
    projectList.filter((item) => /active/i.test(item.status ?? "")).length + (labData.featuredProject ? 1 : 0);
  const projectsTotal = projectList.length;
  const publications = (labData.publications ?? []).filter((item) => !item.empty).length;
  const patentsData = labData.patents ?? {};
  const patents = (patentsData.international ?? []).length + (patentsData.domestic ?? []).length;
  const targets = { members, projects, projectsTotal, publications, patents };

  document.querySelectorAll("[data-stat]").forEach((el) => {
    const key = el.dataset.stat;
    if (!(key in targets)) return;
    el.textContent = String(targets[key]);
  });
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
setupReveal();
setupHeroStats();
setupHeroCanvas();
setupCopyButtons();
