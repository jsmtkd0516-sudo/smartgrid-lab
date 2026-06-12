# Smartgrid Lab Website

연세대 Smartgrid Lab 홈페이지 — 순수 정적 사이트(HTML/CSS/JS), GitHub Pages 배포.

**상세 가이드는 [AGENTS.md](AGENTS.md)를 먼저 읽을 것.** 핵심 요약:

- 콘텐츠 수정은 `data/lab-data.js`만 고치면 된다 (멤버/논문/과제/뉴스/갤러리).
- `main`에 push하면 https://jsmtkd0516-sudo.github.io/smartgrid-lab/ 에 자동 배포 (1~2분).
- 히어로 카운터는 데이터에서 자동 집계 — 숫자 하드코딩 금지.
- 렌더 코드는 `escapeHtml()` 필수, `prefers-reduced-motion` 대응 유지.
- 공개 저장소: 개인정보/학생 사진/비공개 과제 정보는 검수 전 커밋 금지.
