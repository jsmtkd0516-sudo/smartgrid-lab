# Smartgrid Lab Website Handoff Guide

이 문서는 연구실 컴퓨터에서 홈페이지를 이어서 수정하고 배포하기 위한 간단한 인수인계 문서입니다.

## 현재 배포 구조

- GitHub 저장소: https://github.com/jsmtkd0516-sudo/smartgrid-lab
- 공개 홈페이지 주소: https://jsmtkd0516-sudo.github.io/smartgrid-lab/
- 배포 방식: GitHub Pages
- 배포 소스: `main` 브랜치의 `/ root`

GitHub Pages를 켜두면 `main` 브랜치에 push할 때마다 몇 분 뒤 홈페이지가 자동으로 업데이트됩니다.

## 연구실 컴퓨터에서 처음 시작하기

먼저 연구실 컴퓨터에 아래 프로그램이 있으면 좋습니다.

- Git for Windows
- VS Code 또는 Cursor 같은 코드 편집기
- GitHub 계정 로그인 권한

처음에는 ZIP을 수정하는 것보다 GitHub에서 직접 clone하는 방식을 추천합니다.

```powershell
cd 원하는\작업\폴더
git clone https://github.com/jsmtkd0516-sudo/smartgrid-lab.git
cd smartgrid-lab
```

## 가장 자주 수정하는 파일

대부분의 내용은 아래 파일 하나에서 수정합니다.

```text
data/lab-data.js
```

여기에서 수정할 수 있는 항목:

- `projects`: 연구과제
- `publications`: 논문
- `achievements`: 수상, 특허, 기술이전, 보도자료
- `members`: 교수, 박사과정, 석사과정 멤버
- `alumni`: 졸업생/진출 기관
- `news`: 연구실 소식
- `gallery`: 연구실 사진

## 코드 없이 내용 수정하기

코드를 직접 수정하지 않으려면 관리 PC에만 있는 로컬 편집기를 엽니다. `editor.html`은 공개 저장소와 GitHub Pages에 올리지 않는 로컬 전용 파일입니다.

```powershell
py -m http.server 5173
```

브라우저에서 아래 주소로 들어갑니다.

```text
http://localhost:5173/editor.html
```

편집기에서 뉴스, 멤버, 과제, 논문, 실적, 갤러리를 고친 뒤 오른쪽 위 `파일로 저장`을 누릅니다. 파일 선택 창에서 기존 파일을 선택해 덮어씁니다.

새로 clone한 PC에 `editor.html`이 없으면 `data/lab-data.js`를 직접 수정하거나, 기존 관리 PC의 로컬 전용 편집기를 따로 받아서 사용합니다.

폴더 경로:

```text
data
```

파일 이름:

```text
lab-data.js
```

브라우저가 직접 저장을 지원하지 않으면 `다운로드`를 누른 뒤 내려받은 `lab-data.js`로 기존 파일을 교체합니다.

## 편집 후 GitHub Pages에 올리기

브라우저에서 홈페이지가 정상인지 확인한 뒤 아래 파일을 더블클릭합니다.

```text
publish-site.cmd
```

이 파일은 다음 일을 순서대로 합니다.

1. 변경된 파일 목록을 보여줍니다.
2. 공개해도 되는지 `y` 입력으로 확인합니다.
3. 커밋 메시지를 입력받습니다.
4. `git add`, `git commit`, `git push`를 실행합니다.
5. GitHub Pages 주소를 알려줍니다.

직접 명령어로 실행하려면:

```powershell
.\publish-site.ps1
```

주의: 이 저장소는 공개 저장소입니다. 변경 목록에 공개하면 안 되는 사진, 전화번호, 비공개 과제 정보가 있으면 `y`를 누르지 마세요.

## 사진 추가 방법

멤버 사진:

```text
assets/members/
```

연구실 활동 사진:

```text
assets/gallery/
```

예를 들어 `assets/members/hong-gildong.jpg`를 넣었다면 `data/lab-data.js`에서 이렇게 씁니다.

```js
{
  name: "Gildong Hong",
  role: "M.S. Candidate",
  interest: "Power systems, optimization",
  photo: "assets/members/hong-gildong.jpg"
}
```

사진이 아직 없으면 `photo: ""`로 두면 됩니다. 사이트가 자동으로 이니셜 자리표시자를 보여줍니다.

## 로컬에서 확인하기

가장 쉬운 방법:

```text
index.html
```

파일을 더블클릭해서 브라우저로 엽니다.

조금 더 실제 서버처럼 확인하려면:

```powershell
py -m http.server 5173
```

그 다음 브라우저에서 아래 주소를 엽니다.

```text
http://localhost:5173
```

## 수정한 내용을 GitHub에 올리기

수정 후 아래 순서로 업로드합니다.

```powershell
git status
git add .
git commit -m "Update lab website content"
git push
```

push 후 GitHub Pages가 자동으로 다시 배포됩니다. 보통 1-3분 정도 걸립니다.

## 다른 사람이 볼 수 있는 것과 수정할 수 있는 것

공개 홈페이지는 누구나 볼 수 있습니다.

```text
https://jsmtkd0516-sudo.github.io/smartgrid-lab/
```

저장소가 Public이면 GitHub 저장소 안의 파일도 누구나 볼 수 있습니다. 즉 `data/lab-data.js`, 이미지 파일, README도 공개됩니다. 로컬 편집기 `editor.html`과 이미지 생성 원본 `assets/generated/`는 공개 저장소에 올리지 않습니다.

하지만 아무나 실제 홈페이지를 수정할 수는 없습니다. 홈페이지를 바꾸려면 GitHub 저장소에 write 권한이 있는 계정으로 push해야 합니다.

Public 저장소에서 외부인이 할 수 있는 일:

- 홈페이지 보기
- GitHub 저장소 파일 보기
- 저장소를 fork해서 자기 사본 만들기
- Pull Request로 수정 제안하기

외부인이 할 수 없는 일:

- 원본 저장소에 마음대로 push하기
- 실제 홈페이지 내용을 직접 바꾸기
- 저장소 Settings나 Pages 설정 바꾸기

## 공개 전에 조심할 것

아래 정보는 공개해도 되는지 꼭 확인하세요.

- 멤버 개인 이메일
- 개인 휴대폰 번호
- 미공개 연구과제명
- 논문 투고 전 원고 정보
- 내부 회의 사진
- 학생 얼굴 사진과 이름 공개 동의
- 연구실 내부 장비 사진

공개하면 안 되는 정보는 GitHub에 올리지 않는 것이 가장 안전합니다.

## 새 멤버/논문 추가 예시

멤버 추가:

```js
{
  name: "New Member",
  role: "Ph.D. Candidate",
  interest: "HVDC, EMT simulation",
  photo: "assets/members/new-member.jpg"
}
```

논문 추가:

```js
{
  year: "2026",
  title: "Paper title goes here",
  venue: "IEEE Transactions on Power Systems",
  tags: ["stability", "2026"]
}
```

뉴스 추가:

```js
{
  category: "Award",
  title: "Best Paper Award",
  description: "학회명, 날짜, 수상자 정보를 적습니다."
}
```

## 문제가 생겼을 때

변경한 뒤 사이트가 이상하면 먼저 아래를 확인합니다.

```powershell
git status
```

그리고 `data/lab-data.js`에서 쉼표가 빠졌는지 확인하세요. JavaScript 데이터 파일이라 항목 사이에는 쉼표가 필요합니다.

예:

```js
{
  name: "A"
},
{
  name: "B"
}
```

배포가 늦으면 GitHub 저장소의 `Actions` 탭 또는 `Settings > Pages`를 확인합니다.
