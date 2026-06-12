/*
  연구실 홈페이지에서 자주 바뀌는 내용은 이 파일에서만 수정하면 됩니다.

  사진 넣는 법:
  1. 멤버 사진은 assets/members/ 폴더에 넣기
  2. 연구실 사진은 assets/gallery/ 폴더에 넣기
  3. 아래 photo 또는 image 값에 경로 쓰기
     예: photo: "assets/members/kyeon-hur.jpg"

  아직 사진이나 실적이 없으면 빈 문자열("")로 두세요.
  웹사이트가 자동으로 자리표시자를 보여줍니다.
*/

window.labData = {
  featuredProject: {
    label: "Featured Active Project",
    title: "nZC 전력망 수급 균형 및 안정화 기술",
    description:
      "nearly Zero Carbon 전력망을 대상으로 수급 균형, 안정화, 계통 유연성 확보 기술을 다룹니다.",
    sponsor: "National Research Foundation of Korea",
  },

  projects: [
    {
      status: "Active",
      title: "신 전력망 핵심기술 공동연구센터",
      description: "한-미 연구재단 국제 산학협력 연구센터.",
    },
    {
      status: "Active",
      title: "한국형 Net-zero 전력망 개념 설계",
      description: "기술적 타당성 검증과 미래 전력망 운용 설계.",
    },
    {
      status: "Active",
      title: "Embedded HVDC 최적 운영전략",
      description: "레플리카 제어기 기반 상호 영향 분석 기술 개발.",
    },
    {
      status: "Completed",
      title: "AC/DC 하이브리드 송전망 핵심 기술",
      description: "HVDC, FACTS, 송전망 확충과 안정도 분석 연구.",
    },
    {
      status: "Add",
      title: "새 연구과제 추가 자리",
      description: "과제명, 지원기관, 기간, 역할을 확정한 뒤 이 항목을 교체하세요.",
      empty: true,
    },
  ],

  publications: [
    {
      year: "2023",
      title: "An improved high-accuracy interpolation method for switching devices in EMT simulation programs",
      venue: "Electric Power Systems Research, Vol. 223",
      tags: ["hvdc", "2023"],
    },
    {
      year: "Early Access",
      title: "Interleaving Clusters of Submodules to Enhance Scalability of Modular Multilevel Converters",
      venue: "IEEE Transactions on Power Delivery",
      tags: ["hvdc"],
    },
    {
      year: "Early Access",
      title: "Dynamic Performance Modeling and Analysis of Power Grids With High Levels of Stochastic Resources",
      venue: "Proceedings of the IEEE",
      tags: ["stability"],
    },
    {
      year: "2022",
      title: "Feedforward Error Learning Deep Neural Networks for Multivariate Deterministic Power Forecasting",
      venue: "IEEE Transactions on Industrial Informatics, Vol. 18, No. 2",
      tags: ["forecasting", "2022"],
    },
    {
      year: "2021",
      title: "Deep Concatenated Residual Network With Bidirectional LSTM for One-Hour-Ahead Wind Power Forecasting",
      venue: "IEEE Transactions on Sustainable Energy, Vol. 12, No. 2",
      tags: ["forecasting", "2021"],
    },
    {
      year: "Add",
      title: "새 논문 추가 자리",
      venue: "저자, 저널/학회, 권호, DOI 등을 넣어 교체하세요.",
      tags: ["all"],
      empty: true,
    },
  ],

  achievements: [
    {
      type: "Publication",
      title: "Selected IEEE and EPSR papers",
      meta: "HVDC · EMT · Forecasting · Stability",
      description: "대표 논문을 선별해 보여주는 실적 카드입니다. 전체 목록은 Publications에 확장하세요.",
    },
    {
      type: "Patent",
      title: "특허 실적 추가 자리",
      meta: "출원/등록 번호, 날짜",
      description: "공식 특허 목록을 정리한 뒤 이 항목을 교체하세요.",
      empty: true,
    },
    {
      type: "Award",
      title: "수상 및 보도 추가 자리",
      meta: "수상명, 기관, 날짜",
      description: "연구실 수상, 학회 우수논문상, 보도자료 링크 등을 넣을 수 있습니다.",
      empty: true,
    },
    {
      type: "Technology",
      title: "기술이전/창업/산학협력 추가 자리",
      meta: "기업명 또는 기관명",
      description: "기술사업화, 창업기업, 산학협력 성과를 요약해 넣는 자리입니다.",
      empty: true,
    },
  ],

  members: [
    {
      name: "Kyeon Hur",
      role: "Professor",
      interest: "Power systems, HVDC, power quality, grid operation",
      photo: "",
      lead: true,
    },
    {
      name: "Sang Min Kim",
      role: "Ph.D. Candidate",
      interest: "HVDC/FACTS, MMC, SSR",
      photo: "",
    },
    {
      name: "Jee Hoon Lee",
      role: "Ph.D. Candidate",
      interest: "Load modeling, voltage stability",
      photo: "",
    },
    {
      name: "Yeonsoo Kim",
      role: "M.S. Candidate",
      interest: "Deep learning, renewable energy, optimization",
      photo: "",
    },
    {
      name: "New Member",
      role: "Add profile",
      interest: "이름, 과정, 연구분야, 사진 경로를 채워 넣으세요.",
      photo: "",
      empty: true,
    },
    {
      name: "New Member",
      role: "Add profile",
      interest: "멤버가 늘어나면 이 객체를 복사해서 하나 더 추가하면 됩니다.",
      photo: "",
      empty: true,
    },
  ],

  alumni: ["KERI", "KEPCO", "Samsung Electronics", "Hyundai Electric", "KGFM", "Add alumni"],

  /*
    news 항목 작성법:
    - date: "2026.06" 처럼 적으면 뉴스 카드에 크게 표시됩니다 (비워도 됨)
    - image: 썸네일 사진 경로 (예: "assets/gallery/award.jpg", 없으면 "")
  */
  news: [
    {
      date: "2026.06",
      category: "Research",
      title: "Grid-forming and converter-rich power system studies",
      description: "인버터 기반 설비 확대에 따른 전력망 안정도와 정밀 해석 기술을 고도화합니다.",
      image: "",
    },
    {
      date: "2026.05",
      category: "Publication",
      title: "Selected IEEE and EPSR papers updated",
      description: "HVDC, EMT simulation, forecasting, power grid dynamics 관련 대표 논문을 정리했습니다.",
      image: "",
    },
    {
      date: "2026.03",
      category: "Recruiting",
      title: "Graduate students interested in power systems are welcome",
      description: "전력계통, 전력전자, AI 기반 운영, 최적화 연구에 관심 있는 학생을 기다립니다.",
      image: "",
    },
    {
      date: "",
      category: "Add",
      title: "새 소식 추가 자리",
      description: "학회 발표, 논문 게재, 수상, 연구실 행사 소식을 여기에 넣으세요.",
      image: "",
      empty: true,
    },
  ],

  gallery: [
    {
      caption: "Lab Photo",
      image: "",
      alt: "연구실 단체 사진 자리",
    },
    {
      caption: "Conference",
      image: "",
      alt: "학회 발표 사진 자리",
    },
    {
      caption: "Research Demo",
      image: "",
      alt: "연구 데모 사진 자리",
    },
  ],
};
