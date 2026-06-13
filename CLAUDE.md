# Smartgrid Lab Website - Agent Guide

연세대학교 전기전자공학과 허견 교수님 Smartgrid Laboratory 홈페이지.
빌드 도구 없는 순수 정적 사이트(HTML/CSS/JS)이며, GitHub Pages로 배포된다.

- 저장소: https://github.com/jsmtkd0516-sudo/smartgrid-lab
- 라이브: https://jsmtkd0516-sudo.github.io/smartgrid-lab/
- `main` 브랜치에 push하면 1~2분 내 자동 배포된다. 별도 빌드/배포 명령 없음.

## 파일 구조와 역할

| 파일 | 역할 |
| --- | --- |
| `data/lab-data.js` | **모든 콘텐츠 데이터** (멤버·졸업생·논문·과제·특허·뉴스·갤러리). 내용 수정은 거의 항상 이 파일만 |
| `*.html` (14개 멀티 페이지) | `index.html`(Home) · `overview`·`milestones`·`contact` · `research`·`projects`·`collaborators` · `professor`·`members`·`alumni` · `publications`·`patents` · `news`·`gallery` |
| `chrome.js` | 모든 페이지 공통 헤더(호버 드롭다운 메뉴)·페이지 배너·푸터·favicon을 한 곳에서 주입. 메뉴 변경은 이 파일의 `NAV` 배열만 |
| `styles.css` | 디자인 시스템. `:root` CSS 변수(블루 계열 팔레트), 반응형 분기점 1040/820/600px |
| `script.js` | `lab-data.js`를 각 페이지 DOM으로 렌더링 + 히어로 전력계통 단선도 캔버스 + 숫자 카운터 + 60Hz 데모 + 논문 BibTeX 복사 |
| `editor.html` | 브라우저에서 여는 로컬 콘텐츠 편집기. 뉴스, 멤버, 과제, 논문, 실적, 갤러리 데이터를 수정하고 `data/lab-data.js`를 저장/다운로드 |
| `publish-site.cmd`, `publish-site.ps1` | 편집 후 변경 목록 확인 → 커밋 → push까지 진행하는 Windows용 배포 보조 스크립트 |
| `LAB_PC_HANDOFF.md` | 연구실 컴퓨터에서 받기/수정/배포하는 사람용 안내서 |

## 콘텐츠 수정 규칙 (lab-data.js)

- 배열 항목의 `empty: true`는 "추가 자리" 자리표시자 — 실제 데이터로 교체할 때 이 플래그를 지운다.
- 사진: 멤버는 `assets/members/`, 갤러리·뉴스 썸네일은 `assets/gallery/`에 넣고 경로를 적는다. 빈 문자열 `""`이면 자동 자리표시자.
- `news` 항목: `date`("2026.06" 형식), `category`, `title`, `description`, `image`(선택).
- 히어로의 Researchers / Active Projects 카운터는 `members`(empty 제외)와 `projects`(status가 Active인 것 + featuredProject)에서 **자동 집계**된다. 숫자를 직접 고치지 말 것.
- 코드에 익숙하지 않은 사용자는 `py -m http.server 5173` 실행 후 `http://localhost:5173/editor.html`에서 콘텐츠를 수정한다.
- 편집 후 GitHub Pages에 올릴 때는 `publish-site.cmd`를 실행한다. 이 스크립트는 변경 목록을 보여주고 `y` 확인을 받은 뒤에만 `git add --all`, `git commit`, `git push`를 수행한다.

## 코드 수정 시 주의

- `script.js`의 렌더 함수들은 모두 `escapeHtml()`로 이스케이프한다 — 새 렌더 코드도 동일하게.
- `prefers-reduced-motion` 대응이 캔버스 애니메이션/카운터/reveal에 들어가 있다. 모션 추가 시 유지할 것.
- `.hero-metrics div > span` 처럼 직계 자식 셀렉터를 쓰는 곳이 있다 — strong 안의 값 span에 라벨 스타일이 새지 않게 하기 위함.
- 600px 이하에서 `.vision-list article`은 1칼럼이 되고 `p { grid-column: auto }` 오버라이드가 필요하다(이미 있음).

## 로컬 확인 방법

브라우저로 `index.html`을 직접 열면 된다. 서버가 필요하면:

```powershell
py -m http.server 5173
```

헤드리스 스크린샷 검증(이 프로젝트에서 쓰는 방식):

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --hide-scrollbars --window-size=1440,950 --virtual-time-budget=9000 --screenshot="$env:TEMP\shot.png" "file:///C:/path/to/index.html"
```

주의: virtual-time 환경에서는 카운트업 애니메이션이 중간 값으로 찍히고, reveal 페이드인이 안 풀려 아래쪽 섹션이 빈 화면으로 나올 수 있다(실제 브라우저에선 정상).

## 절대 규칙

- **공개 저장소다.** 개인 전화번호, 비공개 과제 정보, 학생 얼굴 사진 등은 본인 동의/검수 전에 커밋하지 않는다.
- 교수/연구실 공식 정보(연락처, 논문, 과제)는 게시 전 연구실 내부 검수가 필요하다.
