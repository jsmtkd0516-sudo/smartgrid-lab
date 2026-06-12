# Yonsei Smartgrid Laboratory Website Draft

연세대학교 전기전자공학과 Smartgrid Laboratory 홈페이지 리디자인 초안입니다.

## 구성

- `index.html`: 단일 페이지 연구실 홈페이지
- `styles.css`: 반응형 레이아웃과 블루 계열 디자인 시스템
- `script.js`: 모바일 내비게이션, 논문 필터, 스크롤 reveal, 히어로 네트워크 애니메이션
- `data/lab-data.js`: 멤버, 논문, 과제, 실적, 뉴스, 갤러리 데이터
- `assets/hero-smart-grid.png`: 생성형 이미지 기반 히어로 배경
- `assets/members/`: 멤버 사진을 넣는 폴더
- `assets/gallery/`: 연구실 활동 사진을 넣는 폴더

## 내용 수정 방법

대부분의 내용은 `data/lab-data.js`만 고치면 됩니다.

- 멤버 추가: `members` 배열의 객체를 복사해 이름, 과정, 연구분야를 수정합니다.
- 멤버 사진 추가: 사진 파일을 `assets/members/`에 넣고 `photo`에 경로를 씁니다.
- 논문 추가: `publications` 배열에 `year`, `title`, `venue`, `tags`를 추가합니다.
- 실적 추가: `achievements` 배열에 수상, 특허, 기술이전, 보도자료 등을 추가합니다.
- 갤러리 사진 추가: 사진 파일을 `assets/gallery/`에 넣고 `gallery`의 `image`에 경로를 씁니다.

사진이나 실적이 아직 없으면 빈 문자열(`""`)로 두면 됩니다. 웹사이트가 자동으로 자리표시자를 보여줍니다.

## 확인 방법

브라우저에서 `index.html`을 열거나, 로컬 서버를 실행해 확인할 수 있습니다.

```powershell
py -m http.server 5173
```

그 다음 `http://localhost:5173`에 접속하세요.

## 콘텐츠 출처 확인 필요

교수 정보, 연락처, 연구분야, 프로젝트, 대표 논문은 공개된 Smartgrid Laboratory 및 연세대학교 전기전자공학부 자료를 바탕으로 구성했습니다. 실제 게시 전에 최신 멤버, 논문, 과제, 사진은 연구실 내부 자료로 검수해야 합니다.
