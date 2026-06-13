# Yonsei Smartgrid Laboratory Website Draft

연세대학교 전기전자공학과 Smartgrid Laboratory 홈페이지 리디자인 초안입니다.

## 구성

- `index.html` 외 14개 `*.html`: 멀티 페이지 (Home / Introduction[Overview·Milestones·Contact] / Research[Research·Projects·Collaborators] / Our Team[Professor·Members·Alumni] / Publications[Journals·Patents] / News[News·Gallery])
- `chrome.js`: 공통 헤더(호버 드롭다운 메뉴)·페이지 배너·푸터·favicon 주입
- `styles.css`: 반응형 레이아웃과 블루 계열 디자인 시스템
- `script.js`: 콘텐츠 렌더링 + 논문 연도 필터·BibTeX + 전력계통 단선도 애니메이션 + 숫자 카운터
- `data/lab-data.js`: 멤버·졸업생·논문·과제·특허·뉴스·갤러리 데이터
- `editor.html`: 브라우저에서 여는 로컬 콘텐츠 편집기
- `assets/hero-smart-grid.png`: 히어로 배경 / `assets/members/`·`assets/gallery/`: 사진 폴더
- `LAB_PC_HANDOFF.md`: 연구실 컴퓨터에서 이어서 수정·배포하는 방법

## 공개 주소

- GitHub 저장소: https://github.com/jsmtkd0516-sudo/smartgrid-lab
- GitHub Pages 주소: https://jsmtkd0516-sudo.github.io/smartgrid-lab/

## 내용 수정 방법

대부분의 내용은 `data/lab-data.js`만 고치면 됩니다.

코드를 직접 만지기 어렵다면 아래 편집기를 먼저 쓰세요.

```text
editor.html
```

권장 실행 방법:

```powershell
py -m http.server 5173
```

그 다음 브라우저에서 아래 주소를 엽니다.

```text
http://localhost:5173/editor.html
```

편집기에서 뉴스, 멤버, 과제, 논문, 실적, 갤러리를 수정한 뒤 `파일로 저장` 또는 `다운로드`를 눌러 `data/lab-data.js`를 교체합니다.

## GitHub에 올리는 방법

내용을 고치고 브라우저에서 확인한 뒤 아래 파일을 실행합니다.

```text
publish-site.cmd
```

실행하면 변경된 파일 목록을 먼저 보여줍니다. 공개해도 되는 파일인지 확인한 뒤 `y`를 입력하면 자동으로 `git add`, `git commit`, `git push`를 실행합니다.

터미널에서 직접 실행하려면:

```powershell
.\publish-site.ps1
```

push 후 GitHub Pages가 보통 1-3분 안에 반영됩니다.

- 멤버 추가: `members` 배열의 객체를 복사해 이름, 과정, 연구분야를 수정합니다.
- 멤버 사진 추가: 사진 파일을 `assets/members/`에 넣고 `photo`에 경로를 씁니다.
- 논문 추가: `publications` 배열에 `year`, `title`, `venue`, `tags`를 추가합니다.
- 실적 추가: `achievements` 배열에 수상, 특허, 기술이전, 보도자료 등을 추가합니다.
- 갤러리 사진 추가: 사진 파일을 `assets/gallery/`에 넣고 `gallery`의 `image`에 경로를 씁니다.
- 뉴스 추가: `news` 배열에 `date`("2026.06" 형식), `category`, `title`, `description`을 적습니다. `image`에 사진 경로를 넣으면 썸네일이 붙습니다.

첫 화면의 Researchers / Active Projects 숫자는 `members`와 `projects` 데이터에서 자동으로 계산되므로 따로 고칠 필요가 없습니다.

사진이나 실적이 아직 없으면 빈 문자열(`""`)로 두면 됩니다. 웹사이트가 자동으로 자리표시자를 보여줍니다.

## 확인 방법

브라우저에서 `index.html`을 열거나, 로컬 서버를 실행해 확인할 수 있습니다.

```powershell
py -m http.server 5173
```

그 다음 `http://localhost:5173`에 접속하세요.

## 콘텐츠 출처 확인 필요

교수 정보, 연락처, 연구분야, 프로젝트, 대표 논문은 공개된 Smartgrid Laboratory 및 연세대학교 전기전자공학부 자료를 바탕으로 구성했습니다. 실제 게시 전에 최신 멤버, 논문, 과제, 사진은 연구실 내부 자료로 검수해야 합니다.
