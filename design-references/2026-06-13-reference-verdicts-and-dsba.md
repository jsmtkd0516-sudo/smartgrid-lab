# 2026-06-13 — 레퍼런스 우선순위 갱신 + SNU DSBA 추가

연구실 운영자 검토 결과에 따라 우선순위를 조정하고, 새 레퍼런스(SNU DSBA)를 추가했습니다.

## 오늘 사이트에 실제 적용한 것

- **호버 드롭다운 메뉴** — 큰 메뉴에 마우스를 올리면 하위 항목이 뜨는 구조. (참고: 한양대 PESL `Member → Professor/Students/Alumni`, 실제 Smartgrid Lab 메뉴 구조) → `chrome.js`에 6개 메뉴 + 하위 항목으로 적용 완료.
- **Current Research Topics 3단 레이아웃** — 그림 그리드 + 주제명 + 세부주제(국문/영문) 카드. (참고: SNU DSBA) → `research.html`에 전력전자·계통동특성·재생에너지 통합 3축으로 적용 완료.

## 우선순위 갱신

| 구분 | 사이트 | 메모 |
| --- | --- | --- |
| 1순위 | 한양대 PESL — http://pesl.hanyang.ac.kr/ | 같은 분야. 호버 드롭다운, 연구분야 실사 카드 |
| 1순위 | SNU DSBA — https://dsba.snu.ac.kr/ | Current Research Topics 3단(그림+세부주제) — 신규 추가 |
| 유지 | 한양대 EPECS — http://epecs.hanyang.ac.kr/ | 숫자 카운터, 개별 참고 |
| 구성만 참고 | ETH PSL — https://psl.ee.ethz.ch/ | 메뉴 구성은 합격, 비주얼은 우리 블루 톤으로 별도 |
| 일반 참고로 강등 | 연세대 BEM — https://bemlab.yonsei.ac.kr/ | 더 이상 기준점이 아님 |
| 우선순위 제외 | KAIST 계열(KIXLAB/advnano) | 분야·톤이 우리 방향과 거리가 있어 제외 |

## 신규 레퍼런스 — SNU DSBA (데이터사이언스·비즈니스애널리틱스 연구실)

- URL: https://dsba.snu.ac.kr/ , Apply: https://dsba.snu.ac.kr/apply/
- 핵심: **Current Research Topics** — 3개 연구축을 컬럼으로, 각 컬럼 상단에 2×2 대표 그림 그리드, 그 아래 주제명 + 설명 + 세부주제 카드(국문 굵게 + 영문 이탤릭 + 설명).
- 훔쳐올 것: 3단 주제 구성(적용됨), 세부주제 국문/영문 병기 카드(적용됨), 대표 그림 2×2 썸네일(자리만 적용 — 실제 그림 추후).
