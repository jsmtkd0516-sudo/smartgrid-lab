# Smartgrid Lab 사이트 — 빌드 핸드오프 노트

> 이 파일은 사이트 콘텐츠가 아니라 **이어받기용 개발 메모**다. (다음 세션 / Codex / 사람 누구든 이걸 읽고 이어서 작업)
> 최종 갱신: 2026-06-22 · 캐시버전 태그: `?v=20260622-cards`

## ⚠️ 동시 편집 금지
Claude와 Codex가 **동시에** 이 레포를 고치면 같은 파일을 서로 덮어쓴다(특히 `script.js`의 중복 `const` → 사이트 전체 깨짐). **한 번에 한 도구만.** 작업 전 `node -c script.js && node -c chrome.js`로 문법 확인.

## ⚠️ 데모 콘텐츠 — 절대 진짜로 배포 금지
- `news.html?demo=1`로 접속하면 **"[예시]" 라벨이 붙은 샘플 게시글 4개**가 보인다 (레이아웃 미리보기용).
- 이 샘플은 `script.js`의 `DEMO_POSTS`에 있고 **`?demo=1` 플래그가 있을 때만** 나온다. 플래그 없는 기본/배포 화면엔 **안 나온다**(검증: 기본 뷰 "[예시]" 0개).
- 진짜 뉴스는 `data/lab-data.js`의 `news` 배열에 넣어야 한다. `DEMO_POSTS`를 실제 소식으로 착각해 옮기지 말 것 — 전부 가짜 예시다.
- 논문은 **이미 실제 65편**이 `lab-data.js`에 있다(지어낸 것 아님). 추가 날조 금지.

## 이번 세션에 한 일 (전부 실데이터 기반 / 날조 0)
| 영역 | 내용 | 파일 |
|---|---|---|
| 홈 | Research Impact 스트립 (논문/과제/특허 자동집계) | `index.html`, `script.js`(setupHeroStats) |
| 논문 | 죽은 필터 부활 → 요약+필터칩+유형배지+주제태그 카드, `?topic=KEY` 사전필터 | `publications.html`, `script.js`(renderPublications) |
| 연구 | 분야별 "관련 논문 N편 →" cross-link (→ publications?topic=) | `research.html`(data-topic-key), `script.js`(renderResearchTopics) |
| 과제 | 진행중/완료 그룹 + 펀딩기관 + 카운트 | `script.js`(renderProjects) |
| 특허 | 요약바 (52·국제8·국내44) | `script.js`(renderPatents) |
| 모집 | 메일 양식 + 복사버튼 | `recruiting.html`, `script.js`(setupCopyButtons) |
| 협력 | 빈 placeholder → 실제 협력기관 18곳 신뢰벽 (과제 발주기관에서 도출) | `collaborators.html`(정적) |
| SEO | JSON-LD(ResearchOrganization) + robots.txt + sitemap.xml | `index.html`, 신규 파일 2개 |
| 멤버 | 사진 없는 실제 멤버 → 이름 기반 컬러 이니셜 아바타 (가짜 얼굴 아님) | `script.js`(initialAvatar), `styles.css` |
| 뉴스 | `?demo=1` 미리보기 데모 (위 경고 참조) | `script.js`(DEMO_POSTS, DEMO_MODE) |

## 실제 콘텐츠로 채우는 법 (남은 진짜 작업 = 콘텐츠)
- **멤버 사진**: `assets/members/`에 사진 넣고 `lab-data.js` 해당 멤버 `photo: "assets/members/이름.jpg"`. 그러면 아바타 대신 사진이 뜬다.
- **뉴스**: `lab-data.js`의 `news` 배열에 `{date:"2026.06", category, title, description, image?}` 추가. `empty:true` 자리표시자는 실제 데이터로 교체.
- **논문 링크**: `publications` 항목에 `doi`/`paper`/`code`/`video` 또는 `links:{...}` 추가하면 카드에 버튼 자동 점등 (graceful — 없으면 안 뜸).

## 검증/배포
- 로컬 시각 QA: `py -3 scripts\render_html_qa.py 연구실홈페이지제작\<page>.html` → `_qa_renders\*.png` (gitignore됨).
- 배포: `publish-site.cmd` (변경목록 확인 후 커밋·푸시). **AI는 push 안 함** — 사람이 실행.
- 배포 전 점검: 데모 콘텐츠는 기본 뷰에 안 나오는 게 정상. `node -c script.js` 통과 확인.
