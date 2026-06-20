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

  // 연도별로 묶어 헤더는 한 번씩, 각 논문은 한 줄(제목 + 저자 + 게재지) 행으로.
  const pubs = (labData.publications ?? []).filter((item) => !item.empty);
  const order = [];
  const byYear = new Map();
  pubs.forEach((item) => {
    const year = item.year || "";
    if (!byYear.has(year)) {
      byYear.set(year, []);
      order.push(year);
    }
    byYear.get(year).push(item);
  });

  target.innerHTML = order
    .map(
      (year) => `
        <div class="pub-group">
          <h3 class="pub-year">${escapeHtml(year)}</h3>
          <ul class="pub-rows">
            ${byYear
              .get(year)
              .map(
                (item) => `
                <li class="pub-row reveal">
                  <p class="pub-title">${escapeHtml(item.title)}</p>
                  ${item.authors ? `<p class="pub-authors">${escapeHtml(item.authors)}</p>` : ""}
                  <p class="pub-venue">${escapeHtml(item.venue)}</p>
                </li>`
              )
              .join("")}
          </ul>
        </div>
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

const memberCard = (person) => {
  const photo = person.photo
    ? `<img class="person-photo" src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)} profile photo" />`
    : photoSlot(person.name, person.empty);

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

const buildPostFeed = () => {
  const posts = (labData.news ?? [])
    .filter((item) => !item.empty)
    .map((item, index) => ({
      id: item.id || item.slug || makePostId(item.title, `news-${index + 1}`),
      source: "News",
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

  return ensureUniquePostIds(posts);
};

const postMedia = (post, className = "post-thumb") =>
  post.image
    ? `<img class="${className}" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt || post.title)}" loading="lazy" />`
    : `<span class="${className} post-thumb-placeholder" role="img" aria-label="${escapeHtml(post.title)} 썸네일">
        <span>${escapeHtml(post.category || post.source || "Post")}</span>
      </span>`;

const getRoutePostId = () => {
  const params = new URLSearchParams(location.search);
  return params.get("post") || params.get("id") || decodeURIComponent(location.hash.replace(/^#/, ""));
};

const setPostRoute = (post, replace = false) => {
  const url = new URL(location.href);
  url.searchParams.set("post", post.id);
  url.searchParams.delete("id");
  url.hash = "";
  const method = replace ? "replaceState" : "pushState";
  history[method]?.({ postId: post.id }, "", url);
};

const clearPostRoute = () => {
  const url = new URL(location.href);
  if (!url.searchParams.has("post") && !url.searchParams.has("id") && !url.hash) return;
  url.searchParams.delete("post");
  url.searchParams.delete("id");
  url.hash = "";
  history.pushState?.({}, "", url);
};

let activePostFeed = [];
let postRouteBound = false;

const closePostModal = (options = {}) => {
  const modal = document.querySelector("[data-post-modal]");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  if (options.updateUrl !== false) clearPostRoute();
  updateDefaultMeta();
};

const openPostModal = (post, options = {}) => {
  const modal = document.querySelector("[data-post-modal]");
  if (!modal) return;

  modal.querySelector("[data-post-modal-media]").innerHTML = post.image
    ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt)}" />`
    : `<div class="gallery-placeholder"><span>${escapeHtml(post.category || "Post")}</span></div>`;
  modal.querySelector("[data-post-modal-meta]").innerHTML = `
    ${post.date ? `<time>${escapeHtml(post.date)}</time>` : ""}
    <span class="news-category">${escapeHtml(post.category)}</span>
  `;
  modal.querySelector("[data-post-modal-title]").textContent = post.title;
  modal.querySelector("[data-post-modal-description]").textContent = post.description;
  modal.querySelector("[data-post-modal-body]").innerHTML = renderParagraphs(post.body || post.description, "news-post-body");
  const link = modal.querySelector("[data-post-modal-link]");
  if (link) link.href = postPermalink(post);
  const copyButton = modal.querySelector("[data-post-modal-copy]");
  if (copyButton) {
    copyButton.dataset.postUrl = absolutePostPermalink(post);
    copyButton.textContent = "링크 복사";
  }

  modal.hidden = false;
  document.body.classList.add("modal-open");
  updatePostMeta(post);
  if (options.updateUrl !== false) setPostRoute(post, options.replaceUrl);
  modal.querySelector("[data-post-modal-close]")?.focus();
};

const handlePostRoute = () => {
  const id = getRoutePostId();
  if (!id) {
    closePostModal({ updateUrl: false });
    return;
  }
  const post = activePostFeed.find((item) => item.id === id);
  if (post) openPostModal(post, { updateUrl: false });
};

const ensurePostModal = () => {
  let modal = document.querySelector("[data-post-modal]");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = "gallery-modal post-modal";
  modal.hidden = true;
  modal.dataset.postModal = "";
  modal.innerHTML = `
    <div class="gallery-modal-backdrop" data-post-modal-close></div>
    <article class="gallery-modal-card" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
      <button class="gallery-modal-close" type="button" aria-label="닫기" data-post-modal-close>&times;</button>
      <div class="gallery-modal-media" data-post-modal-media></div>
      <div class="gallery-modal-body">
        <p class="news-meta" data-post-modal-meta></p>
        <h2 id="gallery-modal-title" data-post-modal-title></h2>
        <p data-post-modal-description></p>
        <div data-post-modal-body></div>
        <div class="post-modal-actions">
          <a class="post-modal-link" href="news.html" data-post-modal-link>게시글 링크 열기</a>
          <button class="post-modal-copy" type="button" data-post-modal-copy>링크 복사</button>
        </div>
      </div>
    </article>
  `;
  modal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-post-modal-close]")) closePostModal();
    const copyButton = event.target instanceof Element ? event.target.closest("[data-post-modal-copy]") : null;
    if (copyButton) {
      const url = copyButton.dataset.postUrl || location.href;
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
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closePostModal();
  });
  document.body.append(modal);
  return modal;
};

const renderPostBoard = (target) => {
  ensurePostModal();
  const posts = buildPostFeed();
  activePostFeed = posts;

  target.innerHTML = posts
    .map(
      (post, index) => `
        <article class="post-card-wrap reveal">
          <a class="post-card" href="${escapeHtml(postPermalink(post))}" data-post-id="${escapeHtml(post.id)}" data-post-index="${index}">
            <span class="post-thumb-frame">${postMedia(post)}</span>
            <span class="post-card-body">
              <span class="news-meta">
                ${post.date ? `<time>${escapeHtml(post.date)}</time>` : ""}
                <span class="news-category">${escapeHtml(post.category)}</span>
              </span>
              <span class="post-card-title">${escapeHtml(post.title)}</span>
              <span class="post-card-summary">${escapeHtml(post.description)}</span>
            </span>
          </a>
        </article>
      `
    )
    .join("");

  target.querySelectorAll("[data-post-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const post = posts.find((item) => item.id === link.dataset.postId);
      if (post) openPostModal(post);
    });
  });

  if (!postRouteBound) {
    window.addEventListener("popstate", handlePostRoute);
    postRouteBound = true;
  }
  handlePostRoute();
};

const renderNews = () => {
  document.querySelectorAll("[data-post-list], [data-news-list]").forEach(renderPostBoard);
};

const renderGallery = () => {
  document.querySelectorAll("[data-gallery-list]").forEach(renderPostBoard);
};

const renderPatents = () => {
  const target = document.querySelector("[data-patent-list]");
  if (!target) return;

  const data = labData.patents ?? {};
  const groups = [
    { title: "International Patents", list: data.international ?? [] },
    { title: "Domestic Patents (국내)", list: data.domestic ?? [] },
  ];

  target.innerHTML = groups
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

const renderContent = () => {
  renderFeaturedProject();
  renderProjects();
  renderPublications();
  renderAchievements();
  renderMembers();
  renderAlumni();
  renderPatents();
  renderNews();
  renderHomeNews();
  renderGallery();
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
setupPublicationFilters();
setupReveal();
setupHeroStats();
setupHeroCanvas();
