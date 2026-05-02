import React, { useEffect, useMemo, useState } from "react";

/* =========================================================
   JARADA Growth Briefing System
   - 초기 심화설문지 = 학부모 니즈
   - JARVIS 누적 관찰일지 = 실제 성장 근거
   - 이번달 키워드/메모 = 교사 해석
   - 기본값 = 지난달까지의 압축된 성장 프로필
   - 이번달 전달 저장 시 다음달 기본값으로 진화
========================================================= */

/* =========================
   기본 키워드 데이터
========================= */

const monthBands = ["1~6개월", "7~12개월", "13~18개월", "19~24개월 이상"];

const stageKeywords = {
  "1~6개월": ["흥미 탐색", "공간 적응", "표현 시작", "강점 발견", "도구 경험"],
  "7~12개월": ["반복 경험", "디테일 강화", "재료 확장", "문제 해결", "완성 경험"],
  "13~18개월": ["난이도 상승", "재도전", "자기주도", "대형 작업 준비", "완수 경험"],
  "19~24개월 이상": ["관계 인식", "상호작용", "역할 수행", "협동 경험", "갈등 조율"],
};

const ageBands = ["6–7세", "8–11세", "12–13세"];

const ageDomains = {
  "6–7세": {
    감정이해: ["감정인식", "감정표현", "감정말하기"],
    충동조절: ["멈추기", "기다리기", "차례지키기"],
    규칙: ["규칙이해", "순서지키기", "교실규칙"],
    안정감: ["분리안정", "교사신뢰", "환경안정"],
  },
  "8–11세": {
    과제설정: ["목표정하기", "시작하기", "선택하기"],
    계획: ["단계나누기", "순서생각", "방법정리"],
    수행: ["단계수행", "반복연습", "도구사용"],
    지속: ["과제지속", "몰입유지", "끝까지하기"],
    조율: ["의견조율", "양보하기", "차이조정"],
    역할: ["역할수행", "역할분담", "책임맡기"],
  },
  "12–13세": {
    자기이해: ["강점이해", "약점이해", "상태파악"],
    자기조정: ["방향설정", "방법선택", "자기조절"],
    한계돌파: ["어려움버티기", "기준넘기", "재도전"],
    내적동기: ["의미찾기", "스스로시작", "주도유지"],
    역할정체성: ["역할찾기", "역할수행", "팀기여"],
  },
};

const projects = ["연작", "협동작업", "100호캔버스"];

const projectKeywords = {
  연작: ["주제지속", "반복탐구", "관찰심화", "표현확장", "몰입경험", "발전흐름"],
  협동작업: ["협력경험", "역할분담", "의사소통", "관계조율", "갈등해결", "공동성취"],
  "100호캔버스": ["스케일확장", "공간이해", "계획구성", "몰입지속", "도전극복", "완수경험"],
};

const socialMainKeywords = {
  관계인식: ["차례지키기", "거리조절", "방해인식", "상황살피기", "기본배려"],
  상호작용: ["요청하기", "도움요청", "도움주기", "의견표현", "기다렸다말하기"],
  관계조율: ["의견조율", "양해구하기", "의견수용", "갈등해결", "사과하기"],
  협동: ["역할수행", "역할분담", "협력수행", "도움주고받기", "공동성취"],
  자아실현: ["자발적시작", "자발적지속", "선택하기", "책임지기", "끝까지완성"],
};

const needOptions = {
  homeDirection: [
    "자기표현",
    "감정표현",
    "감정이해",
    "정서안정",
    "자기효능감",
    "자신감",
    "도전정신",
    "표현흥미",
    "미술자신감",
    "공동체이해",
  ],
  classFlow: [
    "감정조절",
    "충동조절",
    "집중유지",
    "과제지속",
    "문제해결",
    "자기주도성",
    "계획하기",
    "선택하기",
    "몰입경험",
    "반복탐구",
    "표현확장",
    "완수경험",
    "도전경험",
  ],
  peerBehavior: [
    "관계진입",
    "관계유지",
    "관계조율",
    "의사소통",
    "의견표현",
    "차례지키기",
    "기다리기",
    "양보하기",
    "갈등조절",
    "갈등해결",
    "협력하기",
    "역할수행",
    "책임지기",
  ],
};

const needMeaningMap = {
  자기표현: "자신의 생각과 감정을 관계 안에서 표현해보는 힘",
  감정표현: "감정을 말과 행동으로 건강하게 드러내보는 힘",
  감정이해: "자신의 마음 상태를 알아차리는 힘",
  정서안정: "감정이 흔들릴 때 다시 안정으로 돌아오는 힘",
  자기효능감: "스스로 해낼 수 있다는 감각",
  자신감: "자신의 시도를 긍정적으로 바라보는 힘",
  도전정신: "낯선 시도 앞에서도 물러서지 않고 해보는 힘",
  표현흥미: "표현 활동 안에서 즐거움과 관심을 찾아가는 힘",
  미술자신감: "그리기와 만들기에서 자신 있게 시도해보는 힘",
  공동체이해: "함께하는 공간의 약속과 흐름을 이해하는 힘",
  감정조절: "감정을 알아차리고 조절해보는 경험",
  충동조절: "하고 싶은 행동을 잠시 멈추고 조절해보는 경험",
  집중유지: "한 가지 흐름을 일정 시간 붙잡아보는 경험",
  과제지속: "쉽지 않아도 과제를 이어가보는 경험",
  문제해결: "막히는 지점에서 방법을 찾아보는 경험",
  자기주도성: "스스로 선택하고 이어가보는 경험",
  계획하기: "과정을 생각하고 순서를 잡아보는 경험",
  선택하기: "자신의 방식으로 선택해보는 경험",
  몰입경험: "작업 안으로 깊이 들어가보는 경험",
  반복탐구: "반복 속에서 차이를 발견하고 발전시키는 경험",
  표현확장: "표현 방식을 넓혀가는 경험",
  완수경험: "끝까지 해내며 성취감을 쌓는 경험",
  도전경험: "익숙하지 않은 영역에도 시도해보는 경험",
  관계진입: "또래 관계 안으로 자연스럽게 들어가보는 행동",
  관계유지: "관계를 안정적으로 이어가보는 행동",
  관계조율: "서로 다른 생각과 흐름을 맞춰가는 행동",
  의사소통: "말과 반응을 주고받으며 관계를 이어가는 행동",
  의견표현: "자기 생각을 관계 안에서 말해보는 행동",
  차례지키기: "관계 안에서 자신의 순서를 지켜보는 행동",
  기다리기: "상대와 흐름을 위해 기다려보는 행동",
  양보하기: "자신의 입장만 고집하지 않고 조정해보는 행동",
  갈등조절: "부딪히는 상황에서 감정을 다뤄보는 행동",
  갈등해결: "문제 상황을 관계 안에서 풀어보는 행동",
  협력하기: "친구와 함께 결과를 만들어가는 행동",
  역할수행: "맡은 역할을 책임 있게 이어가는 행동",
  책임지기: "자신이 선택한 일을 끝까지 감당해보는 행동",
};

const keywordTextHints = {
  자기표현: ["표현", "말", "생각", "의견", "선택", "설명", "이야기"],
  감정표현: ["감정", "속상", "기분", "화", "울", "짜증", "마음"],
  정서안정: ["안정", "진정", "기다", "멈추", "돌아오", "차분"],
  자기효능감: ["해냈", "완성", "성취", "다시", "끝까지", "성공"],
  도전정신: ["도전", "새로운", "어려", "시도", "재도전", "실패"],
  공동체이해: ["규칙", "약속", "함께", "차례", "친구", "공동"],
  감정조절: ["조절", "멈추", "기다", "감정", "화", "충동"],
  충동조절: ["충동", "허락", "먼저", "기다", "차례", "멈추"],
  집중유지: ["집중", "몰입", "계속", "지속", "오래", "끝까지"],
  과제지속: ["과제", "끝까지", "이어", "지속", "포기", "완성"],
  문제해결: ["문제", "방법", "해결", "막히", "찾", "수정"],
  자기주도성: ["스스로", "자발", "선택", "시작", "주도", "직접"],
  계획하기: ["계획", "순서", "단계", "구성", "먼저", "다음"],
  몰입경험: ["몰입", "집중", "빠져", "오래", "반복", "탐구"],
  표현확장: ["표현", "확장", "다양", "재료", "색", "방식"],
  완수경험: ["완성", "완수", "끝", "마무리", "해냈", "결과"],
  관계진입: ["친구", "다가", "함께", "참여", "들어가", "같이"],
  관계유지: ["친구", "이어", "함께", "유지", "놀이", "대화"],
  관계조율: ["조율", "의견", "갈등", "양보", "수용", "맞추"],
  의사소통: ["말", "대화", "요청", "반응", "묻", "답"],
  의견표현: ["의견", "생각", "말", "표현", "주장", "설명"],
  차례지키기: ["차례", "순서", "기다", "먼저", "규칙"],
  기다리기: ["기다", "멈추", "순서", "차례"],
  갈등조절: ["갈등", "다툼", "화", "조절", "부딪", "사과"],
  갈등해결: ["갈등", "해결", "사과", "화해", "조율", "대화"],
  협력하기: ["협력", "함께", "같이", "역할", "도움", "공동"],
  역할수행: ["역할", "담당", "맡", "책임", "팀", "기여"],
  책임지기: ["책임", "끝까지", "맡", "완성", "마무리"],
};

const surveyMapping = [
  { patterns: ["의견을 잘 표현하지 못", "싫다는 표현", "자신의 생각을 잘 표현"], homeDirection: "자기표현", peerBehavior: "의견표현", reason: "친구 관계 안에서 자신의 생각을 표현하는 데 어려움이 관찰됨" },
  { patterns: ["감정을 잘 표현하지 못", "감정을 잘 표현"], homeDirection: "감정표현", classFlow: "감정조절", reason: "감정을 말이나 행동으로 표현하고 조절하는 경험이 필요함" },
  { patterns: ["화를 자주", "감정 기복", "감정 충돌", "예민"], homeDirection: "정서안정", classFlow: "감정조절", peerBehavior: "갈등조절", reason: "감정 변화가 관계와 행동에 영향을 줄 수 있음" },
  { patterns: ["충동적으로", "허락받지 않고", "손이 나갈"], classFlow: "충동조절", peerBehavior: "차례지키기", reason: "행동으로 먼저 반응하기보다 잠시 멈추는 경험이 필요함" },
  { patterns: ["친구와 갈등", "자주 다투", "싸우"], homeDirection: "공동체이해", classFlow: "문제해결", peerBehavior: "관계조율", reason: "또래 관계 안에서 차이를 조율하는 경험이 필요함" },
  { patterns: ["먼저 다가가기 어려", "낯을 가리", "혼자"], homeDirection: "자기표현", classFlow: "도전경험", peerBehavior: "관계진입", reason: "관계 안으로 들어가는 시도와 표현 경험이 필요함" },
  { patterns: ["친구 눈치", "양보하는 편"], homeDirection: "자기표현", peerBehavior: "의사소통", reason: "관계 안에서 자기 기준을 표현하는 힘이 필요함" },
  { patterns: ["규칙을 잘 지키지", "규칙을 잘 지키는"], homeDirection: "공동체이해", classFlow: "충동조절", peerBehavior: "차례지키기", reason: "공동체 안의 약속과 순서를 이해하는 경험이 필요함" },
  { patterns: ["집중 시간이 짧", "집중해서 끝까지"], classFlow: "집중유지", peerBehavior: "책임지기", reason: "한 가지 흐름을 지속하고 끝까지 이어가는 경험이 필요함" },
  { patterns: ["쉽게 포기", "금방 포기"], homeDirection: "자기효능감", classFlow: "과제지속", peerBehavior: "책임지기", reason: "어려운 지점에서도 다시 이어가며 해냈다는 감각이 필요함" },
  { patterns: ["새로운 시도", "시도를 꺼리", "실패를 두려워", "도전하는 아이"], homeDirection: "도전정신", classFlow: "도전경험", reason: "익숙하지 않은 과제 앞에서도 시도해보는 경험이 필요함" },
  { patterns: ["자신감", "못한다고"], homeDirection: "자기효능감", classFlow: "완수경험", reason: "스스로 해낼 수 있다는 감각을 쌓는 경험이 필요함" },
  { patterns: ["미술을 좋아", "표현을 어려워", "흥미가 적", "미술 자신감"], homeDirection: "미술자신감", classFlow: "표현확장", reason: "미술 활동 안에서 표현 자신감을 쌓는 경험이 필요함" },
  { patterns: ["몰입"], homeDirection: "표현흥미", classFlow: "몰입경험", reason: "흥미를 바탕으로 작업에 깊이 들어가는 경험을 확장할 수 있음" },
  { patterns: ["협력", "함께", "역할"], classFlow: "자기주도성", peerBehavior: "협력하기", reason: "함께하는 과정에서 역할과 협력 경험이 필요함" },
];

/* =========================
   기본 상태
========================= */

const emptyNeeds = () => ({
  homeDirection: "",
  classFlow: "",
  peerBehavior: "",
  longTermGoal: "",
  evidence: [],
});

const emptyGrowthProfile = () => ({
  updatedUntil: "",
  sourceCount: 0,
  dominantMainKeywords: [],
  dominantSubKeywords: [],
  longTermFlow: "",
  repeatedStrengths: "",
  repeatedNeeds: "",
  recentTrend: "",
  nextFocus: "",
  evidence: [],
  keywordStats: {},
});

const getDefaultForm = () => ({
  student: "",
  date: new Date().toISOString().slice(0, 10),
  briefingMonth: new Date().toISOString().slice(0, 7),
  months: "1~6개월",
  stage: "흥미 탐색",
  ageBand: "6–7세",
  ageDomain: "감정이해",
  ageSubKeywords: [],
  project: "연작",
  projectKeywordsSelected: [],
  socialDomain: "관계인식",
  socialKeywordsSelected: [],
  memo: "",
  artworkFlow: "",
  images: [],
    parentNeeds: emptyNeeds(),
  growthProfile: emptyGrowthProfile(),
  growthBase: null,
  studentMeta: null,
  jarvisObservations: [],
});

/* =========================
   스타일
========================= */

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 45%, #ffffff 100%)", color: "#0f172a", fontFamily: "Arial, sans-serif" },
  container: { maxWidth: 1480, margin: "0 auto", padding: "28px 20px 40px" },
  grid: { display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 24, alignItems: "start" },
  topGrid: { display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 16, marginBottom: 24 },
  card: { background: "white", borderRadius: 28, padding: 28, boxShadow: "0 8px 24px rgba(15,23,42,0.06)", border: "1px solid #e2e8f0" },
  darkCard: { background: "#0f172a", color: "white", borderRadius: 28, padding: 28, boxShadow: "0 8px 24px rgba(15,23,42,0.14)" },
  title: { fontSize: 42, fontWeight: 800, margin: 0 },
  subtitle: { fontSize: 16, lineHeight: 1.8, color: "#475569", marginTop: 12 },
  sectionTitle: { fontSize: 28, fontWeight: 800, margin: 0 },
  sectionHint: { color: "#64748b", fontSize: 14, marginTop: 6 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 18 },
  label: { fontSize: 14, fontWeight: 700, marginBottom: 8 },
  hint: { fontSize: 12, color: "#94a3b8", marginTop: 6 },
  input: { width: "100%", borderRadius: 16, border: "1px solid #cbd5e1", padding: "14px 16px", fontSize: 14, boxSizing: "border-box", background: "white" },
  textarea: { width: "100%", minHeight: 130, borderRadius: 16, border: "1px solid #cbd5e1", padding: 16, fontSize: 14, boxSizing: "border-box", lineHeight: 1.6, resize: "vertical", background: "white" },
  softBox: { marginTop: 20, padding: 20, borderRadius: 24, border: "1px solid #e2e8f0", background: "#f8fafc" },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  primaryBtn: { background: "#0f172a", color: "white", border: "none", borderRadius: 16, padding: "13px 16px", fontWeight: 700, cursor: "pointer" },
  secondaryBtn: { background: "white", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 16, padding: "13px 16px", fontWeight: 700, cursor: "pointer" },
  dangerBtn: { background: "white", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 16, padding: "12px 14px", fontWeight: 700, cursor: "pointer" },
  previewBox: { marginTop: 16, borderRadius: 24, background: "#f8fafc", padding: 20, fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap", border: "1px solid #e2e8f0" },
  promptBox: { marginTop: 16, borderRadius: 24, background: "#020617", color: "#e2e8f0", padding: 20, fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap", maxHeight: 460, overflow: "auto" },
  imageGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 12 },
  image: { width: "100%", height: 120, objectFit: "cover", borderRadius: 16, border: "1px solid #e2e8f0" },
  recordCard: { borderRadius: 22, border: "1px solid #e2e8f0", padding: 16, background: "white", marginTop: 14 },
  miniStat: { borderRadius: 18, background: "white", border: "1px solid #e2e8f0", padding: 14, fontSize: 13, lineHeight: 1.6 },
};

/* =========================
   공통 컴포넌트
========================= */

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 999,
        border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
        background: active ? "#0f172a" : "white",
        color: active ? "white" : "#334155",
        padding: "10px 14px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <div>
      <div style={styles.label}>{label}</div>
      {children}
      {hint ? <div style={styles.hint}>{hint}</div> : null}
    </div>
  );
}

/* =========================
   유틸
========================= */

function uniq(list) {
  return Array.from(new Set((list || []).filter(Boolean)));
}

function countBy(list) {
  return (list || []).reduce((acc, item) => {
    if (!item) return acc;
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function topKeys(obj, limit = 5) {
  return Object.entries(obj || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
}

function normalizeDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const match = text.match(/(20\d{2})[.\-/년\s]*(\d{1,2})[.\-/월\s]*(\d{1,2})?/);
  if (!match) return text;
  const y = match[1];
  const m = String(match[2]).padStart(2, "0");
  const d = match[3] ? String(match[3]).padStart(2, "0") : "01";
  return `${y}-${m}-${d}`;
}

function sentenceSplit(text) {
  return String(text || "")
    .split(/(?<=[.!?。]|다\.|요\.|음\.|함\.|됨\.)\s+|\n+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 8);
}

function keywordMatchScore(text, keyword) {
  const hints = keywordTextHints[keyword] || [keyword];
  return hints.reduce((score, hint) => score + (String(text).includes(hint) ? 1 : 0), 0);
}

function inferKeywordsFromText(text, ageBand = "8–11세") {
  const mainPool = [
    ...Object.keys(ageDomains[ageBand] || {}),
    ...needOptions.homeDirection,
    ...needOptions.classFlow,
    ...needOptions.peerBehavior,
    ...Object.keys(socialMainKeywords),
  ];

  const subPool = [
    ...Object.values(ageDomains[ageBand] || {}).flat(),
    ...Object.values(socialMainKeywords).flat(),
    ...Object.values(projectKeywords).flat(),
    ...needOptions.classFlow,
    ...needOptions.peerBehavior,
  ];

  const mainScores = {};
  const subScores = {};

  uniq(mainPool).forEach((keyword) => {
    const score = keywordMatchScore(text, keyword);
    if (score > 0) mainScores[keyword] = score;
  });

  uniq(subPool).forEach((keyword) => {
    const score = keywordMatchScore(text, keyword);
    if (score > 0) subScores[keyword] = score;
  });

  return {
    mainKeywords: topKeys(mainScores, 4),
    subKeywords: topKeys(subScores, 8),
    scores: { ...mainScores, ...subScores },
  };
}

function extractEvidence(text, keywords, limit = 4) {
  const sentences = sentenceSplit(text);
  const picked = [];

  keywords.forEach((keyword) => {
    const hints = keywordTextHints[keyword] || [keyword];
    const found = sentences.find((sentence) => hints.some((hint) => sentence.includes(hint)));
    if (found) picked.push({ keyword, sentence: found.slice(0, 180) });
  });

  return picked.slice(0, limit);
}

/* =========================
   CSV 파싱 / 설문 분석
========================= */

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseCSV(text) {
  const rows = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseCSVLine);

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());

  return rows.slice(1).map((row, index) => {
    const obj = { __rowIndex: index };
    headers.forEach((header, headerIndex) => {
      obj[header] = row[headerIndex]?.trim() || "";
    });
    return obj;
  });
}

function findStudentName(row) {
  const keys = Object.keys(row);
  const nameKey =
    keys.find((key) => key.includes("아이 이름")) ||
    keys.find((key) => key.includes("학생명")) ||
    keys.find((key) => key.includes("원생명")) ||
    keys.find((key) => key.includes("이름"));

  return nameKey ? row[nameKey] : "이름없음";
}

function findSubmittedAt(row) {
  const keys = Object.keys(row);
  const timeKey =
    keys.find((key) => key.includes("타임스탬프")) ||
    keys.find((key) => key.includes("제출")) ||
    keys.find((key) => key.includes("시간")) ||
    keys.find((key) => key.includes("날짜"));

  return timeKey ? row[timeKey] : "";
}

function parseSubmittedTime(value) {
  if (!value) return 0;

  const normalized = String(value)
    .replace(/\./g, "-")
    .replace(/\//g, "-")
    .replace("오전", "AM")
    .replace("오후", "PM");

  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function analyzeSurvey(rawText) {
  const text = String(rawText || "");
  const scores = { homeDirection: {}, classFlow: {}, peerBehavior: {} };
  const evidence = [];

  surveyMapping.forEach((rule) => {
    const matched = rule.patterns.some((pattern) => text.includes(pattern));
    if (!matched) return;

    if (rule.homeDirection) scores.homeDirection[rule.homeDirection] = (scores.homeDirection[rule.homeDirection] || 0) + 1;
    if (rule.classFlow) scores.classFlow[rule.classFlow] = (scores.classFlow[rule.classFlow] || 0) + 1;
    if (rule.peerBehavior) scores.peerBehavior[rule.peerBehavior] = (scores.peerBehavior[rule.peerBehavior] || 0) + 1;
    evidence.push(rule.reason);
  });

  const top = (obj, fallback) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;

  const longTermGoal = text.includes("친구") || text.includes("또래")
    ? "안정적인 또래 관계 형성"
    : text.includes("자신감") || text.includes("못한다고")
    ? "자기효능감과 미술 자신감 형성"
    : text.includes("감정") || text.includes("조절")
    ? "정서안정과 자기조절력 향상"
    : text.includes("도전") || text.includes("포기")
    ? "도전정신과 완수 경험 확장"
    : "아이의 강점이 수업과 관계 안에서 자연스럽게 확장되는 성장";

  return {
    homeDirection: top(scores.homeDirection, "자기표현"),
    classFlow: top(scores.classFlow, "감정조절"),
    peerBehavior: top(scores.peerBehavior, "관계조율"),
    longTermGoal,
    evidence: uniq(evidence).slice(0, 6),
  };
}

/* =========================
   JARVIS 관찰일지 / 성장 프로필
========================= */

function parseManualJarvisText(text, student, ageBand) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const blocks = raw
    .split(/\n\s*---+\s*\n|\n\s*={3,}\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const date = normalizeDate(block) || "";
    const inferred = inferKeywordsFromText(block, ageBand);
    const allKeywords = uniq([...inferred.mainKeywords, ...inferred.subKeywords]);

    return {
      id: crypto.randomUUID(),
      student,
      date,
      title: `${student || "학생"} 관찰일지 ${index + 1}`,
      week: "",
      rawText: block,
      mainKeywords: inferred.mainKeywords,
      subKeywords: inferred.subKeywords,
      evidence: extractEvidence(block, allKeywords, 5),
      source: "manual-paste",
      createdAt: new Date().toISOString(),
    };
  });
}

function buildObservationFromCrawler(item, student, ageBand) {
  const rawText = item.rawText || item.text || item.content || "";
  const inferred = inferKeywordsFromText(rawText, ageBand);
  const allKeywords = uniq([...inferred.mainKeywords, ...inferred.subKeywords]);

  return {
    id: item.id || crypto.randomUUID(),
    student,
    date: normalizeDate(item.date),
    title: item.title || "JARVIS 관찰일지",
    week: item.week || "",
    rawText,
    mainKeywords: item.mainKeywords || inferred.mainKeywords,
    subKeywords: item.subKeywords || inferred.subKeywords,
    evidence: item.evidence || extractEvidence(rawText, allKeywords, 5),
    source: "jarvis-crawler",
    createdAt: new Date().toISOString(),
  };
}

function mergeObservations(existing, incoming) {
  const map = new Map();

  [...(existing || []), ...(incoming || [])].forEach((item) => {
    const key = `${item.date || "no-date"}-${item.title || ""}-${String(item.rawText || "").slice(0, 60)}`;
    map.set(key, item);
  });

  return Array.from(map.values()).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function buildLongTermFlow(name, profile, parentNeeds) {
  const main = profile.dominantMainKeywords.slice(0, 3).join(", ") || "자기표현과 관계 경험";
  const sub = profile.dominantSubKeywords.slice(0, 4).join(", ") || "시도와 조절";
  const need = parentNeeds?.homeDirection || "아이의 성장 방향";

  return `${name || "아이"}의 누적 관찰에서는 ${main} 흐름이 반복적으로 확인됩니다. 초기 심화설문에서 중요하게 잡힌 ${need} 방향과 연결해 보면, ${sub}이 수업 안에서 조금씩 경험으로 쌓이며 성장 서사의 중심을 이루고 있습니다.`;
}

function buildStrengthPattern(profile) {
  const keys = profile.dominantSubKeywords;
  if (keys.some((key) => ["몰입유지", "몰입경험", "과제지속", "끝까지하기", "완수경험"].includes(key))) {
    return "반복되는 작업 흐름 안에서 몰입을 유지하고 끝까지 이어가려는 힘이 강점으로 나타납니다.";
  }
  if (keys.some((key) => ["의견표현", "의사소통", "요청하기", "도움요청"].includes(key))) {
    return "관계 안에서 자신의 생각을 표현하거나 필요한 도움을 요청하려는 시도가 강점으로 나타납니다.";
  }
  if (keys.some((key) => ["재도전", "도전경험", "어려움버티기", "문제해결"].includes(key))) {
    return "어려운 지점에서 다시 시도하고 방법을 찾아가려는 태도가 강점으로 나타납니다.";
  }
  return "자신의 속도 안에서 수업 흐름에 참여하고 경험을 누적해가는 점이 강점으로 나타납니다.";
}

function buildNeedPattern(profile) {
  const keys = profile.dominantSubKeywords;
  if (keys.some((key) => ["갈등조절", "갈등해결", "의견조율", "양보하기"].includes(key))) {
    return "또래와 생각이 다를 때 감정이나 입장을 조율하는 경험이 지속적으로 필요합니다.";
  }
  if (keys.some((key) => ["차례지키기", "기다리기", "충동조절", "멈추기"].includes(key))) {
    return "하고 싶은 행동을 바로 실행하기보다 잠시 멈추고 순서를 기다리는 경험이 필요합니다.";
  }
  if (keys.some((key) => ["의견표현", "감정표현", "감정말하기"].includes(key))) {
    return "자신의 생각과 감정을 말로 정리해 관계 안에서 표현하는 경험이 필요합니다.";
  }
  return "강점이 안정적으로 드러날 수 있도록 수업 안에서 반복 경험과 관계 경험을 이어갈 필요가 있습니다.";
}

function buildRecentTrend(observations, profile) {
  const recent = (observations || []).slice(0, 4);
  const recentKeywords = uniq(recent.flatMap((item) => [...(item.mainKeywords || []), ...(item.subKeywords || [])]));

  if (recentKeywords.includes("의견표현") || recentKeywords.includes("요청하기") || recentKeywords.includes("도움요청")) {
    return "최근 기록에서는 자신의 생각을 짧게 표현하거나 필요한 도움을 먼저 요청하려는 변화가 두드러집니다.";
  }
  if (recentKeywords.includes("관계조율") || recentKeywords.includes("갈등해결") || recentKeywords.includes("의견조율")) {
    return "최근 기록에서는 또래와의 차이를 맞추고 관계 안에서 조율하려는 흐름이 나타납니다.";
  }
  if (recentKeywords.includes("완수경험") || recentKeywords.includes("끝까지하기") || recentKeywords.includes("과제지속")) {
    return "최근 기록에서는 작업을 끝까지 이어가며 완성 경험을 쌓는 흐름이 강화되고 있습니다.";
  }
  if (recentKeywords.includes("자기주도성") || recentKeywords.includes("선택하기") || recentKeywords.includes("스스로시작")) {
    return "최근 기록에서는 스스로 선택하고 시작하려는 자기주도적 흐름이 조금씩 늘어나고 있습니다.";
  }
  return profile.sourceCount > 0 ? "최근 기록에서는 기존 성장 흐름이 수업 안에서 반복적으로 이어지고 있습니다." : "아직 누적 기록이 충분하지 않아 최근 흐름은 이번 달 기록을 통해 형성됩니다.";
}

function buildNextFocus(profile, parentNeeds) {
  const home = parentNeeds?.homeDirection;
  const classFlow = parentNeeds?.classFlow;
  const peer = parentNeeds?.peerBehavior;

  const parts = [home, classFlow, peer].filter(Boolean).map((key) => needMeaningMap[key] || key);
  if (parts.length) return `${parts.join(", ")}이 다음 관찰과 브리핑의 중심 방향입니다.`;
  return "누적된 강점을 기반으로 이번 달 수업 안에서 새롭게 보인 변화와 반복되는 어려움을 함께 관찰합니다.";
}

function generateGrowthProfile({ student, observations, parentNeeds }) {
  const allMain = [];
  const allSub = [];
  const keywordStats = {};

  observations.forEach((item) => {
    [...(item.mainKeywords || []), ...(item.subKeywords || [])].forEach((key) => {
      keywordStats[key] = (keywordStats[key] || 0) + 1;
    });
    allMain.push(...(item.mainKeywords || []));
    allSub.push(...(item.subKeywords || []));
  });

  const profile = {
    updatedUntil: observations[0]?.date || new Date().toISOString().slice(0, 10),
    sourceCount: observations.length,
    dominantMainKeywords: topKeys(countBy(allMain), 6),
    dominantSubKeywords: topKeys(countBy(allSub), 10),
    longTermFlow: "",
    repeatedStrengths: "",
    repeatedNeeds: "",
    recentTrend: "",
    nextFocus: "",
    evidence: observations.flatMap((item) => item.evidence || []).slice(0, 10),
    keywordStats,
  };

  profile.longTermFlow = buildLongTermFlow(student, profile, parentNeeds);
  profile.repeatedStrengths = buildStrengthPattern(profile);
  profile.repeatedNeeds = buildNeedPattern(profile);
  profile.recentTrend = buildRecentTrend(observations, profile);
  profile.nextFocus = buildNextFocus(profile, parentNeeds);

  return profile;
}

function updateProfileWithMonthlyBriefing({ profile, monthlyRecord, parentNeeds }) {
  const currentStats = { ...(profile.keywordStats || {}) };
  const monthlyKeys = uniq([
    ...(monthlyRecord.ageSubKeywords || []),
    ...(monthlyRecord.projectKeywordsSelected || []),
    ...(monthlyRecord.socialKeywordsSelected || []),
    monthlyRecord.parentNeeds?.homeDirection,
    monthlyRecord.parentNeeds?.classFlow,
    monthlyRecord.parentNeeds?.peerBehavior,
  ]);

  monthlyKeys.forEach((key) => {
    if (!key) return;
    currentStats[key] = (currentStats[key] || 0) + 1;
  });

  const next = {
    ...profile,
    updatedUntil: monthlyRecord.date,
    sourceCount: (profile.sourceCount || 0) + 1,
    dominantMainKeywords: topKeys(currentStats, 6),
    dominantSubKeywords: topKeys(currentStats, 10),
    keywordStats: currentStats,
    evidence: [
      { keyword: "이번달 브리핑", sentence: monthlyRecord.preview?.slice(0, 180) || monthlyRecord.memo?.slice(0, 180) || "이번달 브리핑 저장" },
      ...(profile.evidence || []),
    ].slice(0, 12),
  };

  next.longTermFlow = buildLongTermFlow(monthlyRecord.student, next, parentNeeds);
  next.repeatedStrengths = buildStrengthPattern(next);
  next.repeatedNeeds = buildNeedPattern(next);
  next.recentTrend = monthlyRecord.memo
    ? `이번 달에는 ${monthlyRecord.memo.slice(0, 90)} 흐름이 새롭게 더해졌습니다.`
    : profile.recentTrend;
  next.nextFocus = buildNextFocus(next, parentNeeds);

  return next;
}

/* =========================
   브리핑 생성
========================= */

function interpretMemo(memo) {
  const text = String(memo || "").trim();
  if (!text) return "";

  const hasFriend = /친구|같이|함께|갈등|양보|의견|다툼|싸우/.test(text);
  const hasEmotion = /화|감정|울|짜증|멈춤|충동|기다/.test(text);
  const hasChallenge = /어려|포기|다시|재도전|실패|힘들/.test(text);
  const hasFocus = /집중|몰입|계속|끝까지|반복/.test(text);
  const hasExpression = /말|표현|설명|선택|생각/.test(text);

  if (hasFriend) return `수업 안에서는 ${text} 장면이 있었습니다. 이 장면은 또래 관계 안에서 자신의 생각과 상대의 흐름을 맞춰보는 경험으로 볼 수 있습니다.`;
  if (hasEmotion) return `수업 안에서는 ${text} 장면이 있었습니다. 이 과정은 감정이나 행동을 바로 드러내기보다 잠시 멈추고 다시 이어가보는 조절 경험으로 해석할 수 있습니다.`;
  if (hasChallenge) return `수업 안에서는 ${text} 장면이 있었습니다. 이 장면은 어려운 지점에서 멈추지 않고 다시 시도해보는 흐름으로, 스스로 해낼 수 있다는 감각을 쌓아가는 과정으로 볼 수 있습니다.`;
  if (hasFocus) return `수업 안에서는 ${text} 모습이 관찰되었습니다. 이는 한 가지 작업 흐름을 일정 시간 붙잡고 이어가려는 시도로, 몰입과 지속 경험이 함께 나타난 장면으로 볼 수 있습니다.`;
  if (hasExpression) return `수업 안에서는 ${text} 모습이 관찰되었습니다. 이 장면은 자신의 생각을 표현하고 선택해보는 과정으로, 수업 안에서 자기 방식이 조금씩 드러나는 흐름으로 볼 수 있습니다.`;

  return `수업 안에서는 ${text} 모습이 관찰되었습니다. 이 장면은 자신의 방식으로 수업 흐름에 참여하고, 경험을 통해 다음 단계로 이어가려는 시도로 해석할 수 있습니다.`;
}
function buildParentNeedsInsight(form) {
  const name = form.student?.trim() || "이 아이";

  const homeKey = form.parentNeeds?.homeDirection || "";
  const classKey = form.parentNeeds?.classFlow || "";
  const peerKey = form.parentNeeds?.peerBehavior || "";

  const homeMeaning = needMeaningMap[homeKey] || homeKey;
  const classMeaning = needMeaningMap[classKey] || classKey;
  const peerMeaning = needMeaningMap[peerKey] || peerKey;

  const parts = [];

  if (homeKey) {
    parts.push(
      `가정에서는 ${name}가 ${homeMeaning}을 조금 더 안정적으로 키워가기를 기대하고 있습니다.`
    );
  }

  if (classKey) {
    parts.push(
      `수업 안에서는 ${classMeaning}을 반복적으로 경험하며, 단순히 결과를 만드는 것보다 자신의 상태를 알아차리고 조절해보는 과정이 중요합니다.`
    );
  }

  if (peerKey) {
    parts.push(
      `또래 관계에서는 ${peerMeaning}이 핵심 관찰 포인트로 보이며, 친구와 생각이나 속도가 다를 때 관계 안에서 맞춰가는 경험이 필요합니다.`
    );
  }

  if (parts.length === 0) {
    return "아직 학부모 심화설문 기반 성장 방향이 충분히 정리되지 않았습니다. 구글폼 연계 후 이 영역에서 아이별 학부모 니즈가 문장으로 정리됩니다.";
  }

  return `${name}의 초기 심화설문을 보면, ${[homeKey, classKey, peerKey]
    .filter(Boolean)
    .join(", ")}이 중요한 성장 방향으로 보입니다. ${parts.join(" ")}`;
}

function buildNeedIntro(form) {
  const name = form.student?.trim() || "아이";
  const key = form.parentNeeds.homeDirection;
  const growth = form.growthProfile;
  const recent = growth?.recentTrend ? ` ${growth.recentTrend}` : "";

  const map = {
    자기표현: `${name}이는 이번 달에는 자신의 생각을 조금씩 표현해보려는 모습이 보였습니다.${recent} 특히 이전보다 말이나 행동으로 자신의 의사를 드러내려는 시도가 인상적이었습니다.`,
    감정표현: `${name}이는 이번 달에는 감정을 말과 행동으로 표현해보려는 모습이 나타났습니다.${recent} 특히 자신의 마음을 숨기기보다 조금씩 꺼내보려는 변화가 인상적이었습니다.`,
    감정이해: `${name}이는 이번 달에는 자신의 마음 상태를 알아차리려는 모습이 보였습니다.${recent} 특히 감정이 올라오는 순간에도 스스로를 느껴보려는 과정이 인상적이었습니다.`,
    정서안정: `${name}이는 이번 달에는 감정이 흔들리는 상황에서도 다시 수업 흐름으로 돌아오려는 모습이 나타났습니다.${recent} 특히 감정이 올라온 뒤에도 멈추고 다시 이어가려는 시도가 인상적이었습니다.`,
    자기효능감: `${name}이는 이번 달에는 스스로 해낼 수 있다는 감각을 조금씩 쌓아가는 모습이 보였습니다.${recent} 특히 어려운 지점에서도 다시 이어가려는 태도가 인상적이었습니다.`,
    자신감: `${name}이는 이번 달에는 자신의 시도를 긍정적으로 이어가려는 모습이 나타났습니다.${recent} 특히 결과보다 과정 안에서 자신감을 쌓아가는 흐름이 인상적이었습니다.`,
    도전정신: `${name}이는 이번 달에는 익숙하지 않은 상황에서도 다시 시도해보려는 모습이 이어졌습니다.${recent} 특히 어려운 지점에서도 멈추지 않고 이어가려는 태도가 인상적이었습니다.`,
    표현흥미: `${name}이는 이번 달에는 표현 활동에 대한 흥미와 몰입이 점차 늘어나는 모습이 보였습니다.${recent} 특히 스스로 표현을 이어가려는 흐름이 인상적이었습니다.`,
    미술자신감: `${name}이는 이번 달에는 미술 활동 안에서 자신 있게 시도하려는 모습이 나타났습니다.${recent} 특히 과정 안에서 표현을 확장해가는 모습이 인상적이었습니다.`,
    공동체이해: `${name}이는 이번 달에는 또래 관계 안에서 규칙과 흐름을 이해하려는 모습이 보였습니다.${recent} 특히 함께하는 상황 안에서 자신의 행동을 맞춰가려는 시도가 인상적이었습니다.`,
  };

  return map[key] || `${name}이는 이번 달에는 수업 안에서 자신의 방식으로 시도하고 이어가려는 모습이 보였습니다.${recent} 특히 경험을 통해 조금씩 다음 단계로 나아가려는 흐름이 인상적이었습니다.`;
}

function buildPastGrowthBridge(form) {
  const profile = form.growthProfile;
  if (!profile?.sourceCount) return "";

  const name = form.student?.trim() || "아이";
  const main = profile.dominantMainKeywords.slice(0, 3).join(", ");
  const sub = profile.dominantSubKeywords.slice(0, 4).join(", ");

  return `${name}이의 지난 기록을 함께 보면 ${main || "수업 참여와 관계 경험"} 흐름이 반복적으로 확인되며, 특히 ${sub || "자신의 방식으로 참여하려는 시도"}가 성장의 중요한 축으로 쌓여왔습니다.`;
}

function buildArtworkLine(form, visionResult) {
  if (visionResult?.flow_summary) return visionResult.flow_summary;
  if (form.artworkFlow.trim()) return `작품 흐름에서는 ${form.artworkFlow.trim()}`;
  if (form.images.length >= 4) return "작품 흐름에서는 한 번에 결과를 내기보다 주차가 지나며 시도와 수정, 보완이 조금씩 쌓여가는 과정이 드러났습니다.";
  return "";
}

function buildClassSummary(form, visionResult) {
  const pastLine = buildPastGrowthBridge(form);
  const memoLine = interpretMemo(form.memo);
  const artworkLine = buildArtworkLine(form, visionResult);

  return [pastLine, memoLine, artworkLine].filter(Boolean).join("\n\n") || "수업 안에서는 자신의 방식으로 시도하고 이어가려는 흐름이 보였습니다.";
}

function buildHomeGuide(form) {
  const key = form.parentNeeds.homeDirection;
  const map = {
    자기표현: "가정에서는 아이가 자신의 생각을 짧게라도 말로 표현해볼 수 있도록 “너는 어떻게 생각해?”처럼 선택과 표현의 기회를 자주 만들어주시면 좋습니다.",
    감정표현: "가정에서는 아이의 감정을 대신 판단하기보다 “속상했어?”, “아쉬웠어?”처럼 감정 단어를 함께 제안해주시면 표현이 더 쉬워질 수 있습니다.",
    감정이해: "가정에서는 하루 중 있었던 일을 함께 돌아보며 “그때 어떤 마음이었어?”처럼 감정을 떠올려보는 시간이 도움이 됩니다.",
    정서안정: "가정에서는 감정이 올라왔을 때 바로 해결하려 하기보다, 잠시 기다린 뒤 “지금 어떤 마음이었어?”처럼 감정을 말로 정리해보는 시간이 도움이 됩니다.",
    자기효능감: "가정에서는 결과보다 “다시 해본 점”, “끝까지 해본 점”을 구체적으로 인정해주시면 아이가 스스로 해냈다는 감각을 쌓는 데 도움이 됩니다.",
    자신감: "가정에서는 결과를 평가하기보다 시도한 과정을 먼저 인정해주시면 좋습니다. 작은 시도도 구체적으로 알아봐주는 말이 자신감으로 이어질 수 있습니다.",
    도전정신: "가정에서는 성공 여부보다 시도 자체를 먼저 인정해주시면 좋습니다. “처음인데 해보려고 했네” 같은 피드백이 도움이 됩니다.",
    표현흥미: "가정에서는 결과물을 평가하기보다 표현 과정에 관심을 보여주시면 좋습니다. “이 부분은 어떻게 생각해서 한 거야?”처럼 질문해주면 표현 흥미가 이어질 수 있습니다.",
    미술자신감: "가정에서는 잘 그렸는지보다 스스로 시도한 부분을 구체적으로 인정해주시면 좋습니다. 과정 중심의 반응이 미술 자신감으로 연결됩니다.",
    공동체이해: "가정에서는 규칙을 지시하기보다 “우리 같이 하려면 어떤 약속이 필요할까?”처럼 아이가 약속의 이유를 생각해보게 하는 대화가 도움이 됩니다.",
  };
  return map[key] || "가정에서는 아이가 스스로 선택하고 표현할 수 있는 기회를 만들어주시면 좋습니다.";
}

function buildNextMonthPlan(form) {
  const classFlow = form.parentNeeds.classFlow;
  const peer = form.parentNeeds.peerBehavior;
  const classMeaning = needMeaningMap[classFlow] || classFlow;
  const peerMeaning = needMeaningMap[peer] || peer;
  const nextFocus = form.growthProfile?.nextFocus;

  if (classMeaning && peerMeaning) {
    return `다음달 수업계획은 ${classMeaning}을 수업 안에서 반복 경험하고, ${peerMeaning}이 또래 관계 속에서도 자연스럽게 이어질 수 있도록 구성할 예정입니다.${nextFocus ? ` 특히 ${nextFocus}` : ""}`;
  }
  return "다음달 수업계획은 이번 달 흐름을 이어 아이가 관계와 수업 안에서 조금 더 자연스럽게 표현하고 조절해볼 수 있도록 구성할 예정입니다.";
}

function buildThreeMonthExpectation(form) {
  const home = form.parentNeeds.homeDirection;
  const peer = form.parentNeeds.peerBehavior;
  const homeMeaning = needMeaningMap[home] || home;
  const peerMeaning = needMeaningMap[peer] || peer;

  if (homeMeaning && peerMeaning) return `3개월 뒤에는 ${homeMeaning}이 조금 더 안정적으로 자리 잡고, ${peerMeaning}이 수업과 또래 관계 속에서 보다 자연스럽게 드러나는 모습을 기대해볼 수 있습니다.`;
  return "3개월 뒤에는 수업과 또래 관계 속에서 자신의 생각과 감정을 조금 더 안정적으로 표현하는 모습을 기대할 수 있습니다.";
}

function generatePreview(form, visionResult) {
  const memo = String(form.memo || "").trim();
  const artworkFlow = String(form.artworkFlow || "").trim();
  const visionFlow = String(visionResult?.flow_summary || "").trim();
  const profile = form.growthProfile || emptyGrowthProfile();
  const meta = form.studentMeta || {};
  const sourceCount = Number(profile.sourceCount || 0);

  if (!memo && !artworkFlow && !visionFlow && !sourceCount) {
    return "관찰 메모, 작품 흐름, 또는 JARVIS 누적 기록이 있으면 브리핑 초안이 여기에 표시됩니다.";
  }

  const name = form.student?.trim() || "아이";

  const enrollmentText =
    meta.classWeek && meta.enrolledMonths && meta.enrolledYear
      ? `${name}은 현재 ${meta.classWeek}주차, 약 ${meta.enrolledMonths}개월차, ${meta.enrolledYear}년차 재원 흐름에 있습니다.`
      : `${name}의 재원 흐름은 JARVIS 누적 기록을 기준으로 정리하고 있습니다.`;

  const ageText = meta.age
    ? `현재 ${meta.age}세로 ${meta.ageBand || form.ageBand} 발달 흐름에 해당합니다.`
    : "";

  const mainKeywords = (profile.dominantMainKeywords || []).slice(0, 3);
  const subKeywords = (profile.dominantSubKeywords || []).slice(0, 4);

  const centerAxis = mainKeywords.length
    ? mainKeywords.join(", ")
    : "수업 참여와 관계 경험";

  const detailAxis = subKeywords.length
    ? subKeywords.join(", ")
    : "표현, 관계, 몰입 경험";

  const selectedGrowthKeywords = [
    form.ageDomain,
    ...(form.ageSubKeywords || []),
    form.project,
    ...(form.projectKeywordsSelected || []),
    form.socialDomain,
    ...(form.socialKeywordsSelected || []),
  ].filter(Boolean);

  const monthlyKeywordText = selectedGrowthKeywords.length
    ? selectedGrowthKeywords.join(", ")
    : "이번달 수업에서 관찰된 성장 흐름";

  const actualObservation = [
    artworkFlow ? `작품 흐름에서는 ${artworkFlow}` : "",
    memo ? `수업 장면에서는 ${memo}` : "",
    visionFlow ? `작품 이미지 흐름에서는 ${visionFlow}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const repeatedStrength =
    profile.repeatedStrengths ||
    "자신의 속도 안에서 수업 흐름에 참여하고 경험을 누적해가는 점이 강점으로 보입니다.";

  const repeatedNeeds =
    profile.repeatedNeeds ||
    "강점이 안정적으로 드러날 수 있도록 반복 경험과 관계 경험을 이어갈 필요가 있습니다.";

  const recentTrend =
    profile.recentTrend ||
    "최근 기록에서는 기존 성장 흐름이 수업 안에서 반복적으로 이어지고 있습니다.";

  const nextFocus =
    profile.nextFocus ||
    "이번 달에는 아이가 자신의 생각을 어떻게 표현하는지, 감정이나 관계 상황에서 어떻게 조절하는지를 중심으로 관찰하면 좋습니다.";

  return [
    "안녕하세요.",
    "",
    `${name}의 이번 달 심화 브리핑입니다.`,
    "",
    "1. 지난달 계획과 누적 성장 흐름 연결",
    `${enrollmentText} ${ageText}`,
    `지난달까지의 누적 흐름을 보면 ${name}에게는 ${centerAxis}이 중심 성장축으로 반복 확인됩니다. 세부적으로는 ${detailAxis} 흐름이 함께 나타나며, 이번 달 수업은 이 누적 기본값 위에서 새롭게 보인 변화와 반복되는 어려움을 함께 살펴보는 방향으로 정리했습니다.`,
    "",
    "2. 이번달 실제 관찰 장면",
    actualObservation || `${name}의 이번 달 수업에서는 교사의 관찰 메모를 바탕으로 실제 장면을 더 구체화할 수 있습니다.`,
    "",
    "3. 이번달 성장 해석",
    `이번 달에는 ${monthlyKeywordText} 흐름을 중심으로 관찰했습니다. ${name}은 단순히 결과물을 완성하는 것보다, 수업 안에서 자신의 생각과 감정을 어떻게 표현하고 관계 안에서 어떻게 조율하는지가 중요한 성장 장면으로 보입니다. 반복 강점으로는 ${repeatedStrength} 반면 ${repeatedNeeds}`,
    "",
    "4. 가정 연계 포인트",
    buildHomeGuide(form),
    "",
    "5. 다음달 계획",
    buildNextMonthPlan(form),
    "",
    "6. 3개월 후 기대 방향",
    buildThreeMonthExpectation(form),
    "",
    `최근 변화로는 ${recentTrend} 따라서 다음 관찰에서는 ${nextFocus}`,
  ]
    .filter(Boolean)
    .join("\n");
}
function generatePrompt(form, visionResult) {
  const name = form.student?.trim() || "아이";
  const profile = form.growthProfile || emptyGrowthProfile();
  const meta = form.studentMeta || {};
  const parentNeeds = form.parentNeeds || emptyNeeds();

  const memo = String(form.memo || "").trim();
  const artworkFlow = String(form.artworkFlow || "").trim();
  const visionFlow = String(visionResult?.flow_summary || "").trim();

  const enrollmentText =
    meta.classWeek && meta.enrolledMonths && meta.enrolledYear
      ? `${name}은 현재 ${meta.classWeek}주차, 약 ${meta.enrolledMonths}개월차, ${meta.enrolledYear}년차 재원 흐름에 있습니다.`
      : `${name}의 재원 흐름은 JARVIS 누적 기록을 기준으로 정리하고 있습니다.`;

  const ageText = meta.age
    ? `${meta.age}세 / ${meta.ageBand || form.ageBand}`
    : form.ageBand || "연령대 미확인";

  const mainKeywords = (profile.dominantMainKeywords || []).slice(0, 5);
  const subKeywords = (profile.dominantSubKeywords || []).slice(0, 8);

  const selectedGrowthKeywords = [
    form.ageDomain,
    ...(form.ageSubKeywords || []),
    form.project,
    ...(form.projectKeywordsSelected || []),
    form.socialDomain,
    ...(form.socialKeywordsSelected || []),
  ].filter(Boolean);

  return `너는 자라다교육의 심화브리핑 작성 보조자다.
교사의 관찰 메모를 학부모에게 전달할 월간 심화 브리핑으로 정리한다.

[작성 원칙]
- 교사 메모를 그대로 복사하지 말고, 아이의 누적 성장 흐름과 연결해 해석한다.
- 과장하지 말고, 관찰된 장면을 기반으로 쓴다.
- "좋았다", "잘했다"보다 어떤 성장 과정이 있었는지 설명한다.
- 학부모가 읽었을 때 아이의 현재 방향과 다음 달 수업 목표가 이해되도록 쓴다.
- 문장은 따뜻하지만 전문적으로 작성한다.
- 전체 문장은 6~8문장 정도로 정리한다.
- "아이"라는 표현보다 가능한 한 학생 이름을 사용한다.

[학생 기본 정보]
학생명: ${name}
재원 흐름: ${enrollmentText}
연령 흐름: ${ageText}
집중브리핑 누적 수: ${profile.sourceCount || 0}개

[학부모 심화설문 기반 성장 니즈]
가정 성장 방향: ${parentNeeds.homeDirection || "미입력"}
수업 성장 흐름: ${parentNeeds.classFlow || "미입력"}
또래 행동 변화: ${parentNeeds.peerBehavior || "미입력"}
장기 목표: ${parentNeeds.longTermGoal || "미입력"}

학부모 니즈 해석:
${buildParentNeedsInsight(form)}

[아이 누적 성장 기본값]
${buildGrowthBaseInsight(form)}

[연차별 성장 흐름]
${buildYearlyGrowthText(form)}

[올해 분기별 성장 흐름]
${buildQuarterlyGrowthText(form)}

[지난달까지의 기본값]
${buildMonthlyBaseText(form)}

[이번달 수업 선택값]
이번달 성장 키워드: ${selectedGrowthKeywords.join(", ") || "미선택"}
프로젝트: ${form.project || "미선택"}
프로젝트 키워드: ${(form.projectKeywordsSelected || []).join(", ") || "미선택"}
사회성 메인영역: ${form.socialDomain || "미선택"}
사회성 파생키워드: ${(form.socialKeywordsSelected || []).join(", ") || "미선택"}

[이번달 교사 관찰 메모]
작품 흐름 메모:
${artworkFlow || "미입력"}

이번달 관찰 메모:
${memo || "미입력"}

작품 이미지 분석 흐름:
${visionFlow || "이미지 분석 없음"}

[누적 키워드 참고]
반복 메인키워드: ${mainKeywords.join(", ") || "없음"}
반복 파생키워드: ${subKeywords.join(", ") || "없음"}
반복 강점: ${profile.repeatedStrengths || "아직 없음"}
반복 보완점: ${profile.repeatedNeeds || "아직 없음"}
최근 변화: ${profile.recentTrend || "아직 없음"}
이번달 관찰 포인트: ${profile.nextFocus || "아직 없음"}

[브리핑 작성 구조]
아래 6개 흐름으로 작성한다.

1. 지난달 계획과 누적 성장 흐름 연결
- 아이가 지금 어떤 재원 흐름과 성장 단계에 있는지 짧게 연결한다.
- JARVIS 누적 기본값과 학부모 니즈를 함께 반영한다.

2. 이번달 실제 관찰 장면
- 교사 메모와 작품 흐름 메모를 바탕으로 실제 장면을 설명한다.
- 관찰 장면은 구체적이되 너무 길게 쓰지 않는다.

3. 이번달 성장 해석
- 이번달 키워드, 프로젝트, 사회성 방향을 연결해 해석한다.
- 단순 활동 설명이 아니라 아이의 변화와 성장 의미를 쓴다.

4. 가정 연계 포인트
- 학부모가 가정에서 이해하거나 도와줄 수 있는 방향을 제안한다.
- 부담스러운 과제처럼 쓰지 말고 자연스러운 관찰 포인트로 쓴다.

5. 다음달 계획
- 다음달 수업에서 이어갈 방향을 제시한다.
- 현재 강점과 보완점을 함께 반영한다.

6. 3개월 후 기대 방향
- 3개월 뒤 기대할 수 있는 변화를 현실적으로 쓴다.
- 과장하지 말고, 반복 경험을 통해 기대되는 모습을 쓴다.

[최종 출력]
학부모에게 바로 전달 가능한 브리핑 문장만 작성한다.
제목이나 대괄호 항목명은 쓰지 말고 자연스러운 문단으로 작성한다.`;
}
function analyzeObservationText(rawText) {
  const text = String(rawText || "");

  const keywordMap = [
    {
      main: "자기표현",
      subs: ["의견", "말", "표현", "이야기", "설명", "생각"],
    },
    {
      main: "관계조율",
      subs: ["친구", "함께", "협력", "양보", "조율", "갈등"],
    },
    {
      main: "몰입경험",
      subs: ["집중", "몰입", "끝까지", "지속", "계속", "반복"],
    },
    {
      main: "감정표현",
      subs: ["기분", "감정", "좋아", "싫어", "화", "속상"],
    },
    {
      main: "자기주도성",
      subs: ["스스로", "직접", "선택", "시작", "해보고", "하고 싶"],
    },
    {
      main: "문제해결",
      subs: ["어려", "방법", "해결", "수정", "다시", "도움"],
    },
    {
      main: "과제지속",
      subs: ["이어", "지속", "완성", "마무리", "포기하지", "끝까지"],
    },
    {
      main: "도전경험",
      subs: ["도전", "새로운", "처음", "시도", "재도전", "어렵지만"],
    },
  ];

  const sentences = text
    .split(/[\n.。!?]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const results = [];

  keywordMap.forEach((group) => {
    group.subs.forEach((sub) => {
      if (text.includes(sub)) {
        const evidence =
          sentences.find((sentence) => sentence.includes(sub)) || "";

        results.push({
          main: group.main,
          sub,
          evidence,
        });
      }
    });
  });

  return results;
}

function buildStudentGrowthBase(observations) {
  if (!observations || observations.length === 0) return null;

  const weeks = observations
    .map((observation) => {
      const rawText = String(observation.rawText || "");
      const match = rawText.match(/(\d+)주차/);
      return match ? Number(match[1]) : null;
    })
    .filter(Boolean);

  const totalWeeks = weeks.length ? Math.max(...weeks) : observations.length;
  const yearsEnrolled = Math.ceil(totalWeeks / 43);

  const keywordCount = {};

  observations.forEach((observation) => {
    (observation.mainKeywords || []).forEach((keyword) => {
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });
  });

  const topKeywords = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([keyword]) => keyword);

  return {
    totalWeeks,
    yearsEnrolled,
    overallFlow: topKeywords,

    yearlyFlow: Array.from({ length: yearsEnrolled }).map((_, index) => ({
      year: `${index + 1}년차`,
      summary: "데이터 기반 자동 생성 예정",
    })),

    quarterlyFlow: ["1분기", "2분기", "3분기", "4분기"].map((quarter) => ({
      quarter,
      summary: "데이터 기반 자동 생성 예정",
    })),

   monthlyBase: {
      centerAxis: topKeywords.join(", "),
      repeatedStrengths: topKeywords.join(", "),
      repeatedDifficulties: "관계 조율 필요",
      recentChange: "표현 증가 추세",
      observationPoint: "관계 속 표현 방식 관찰",
    },
  };
}

function buildGrowthBaseInsight(form) {
  const name = form.student?.trim() || "이 아이";
  const profile = form.growthProfile || emptyGrowthProfile();
  const growthBase = form.growthBase || null;

  const mainKeywords = (profile.dominantMainKeywords || []).slice(0, 3);
  const subKeywords = (profile.dominantSubKeywords || []).slice(0, 5);

  const sourceCount = profile.sourceCount || 0;

const studentMeta = form.studentMeta || {};
const classWeek = studentMeta.classWeek || growthBase?.totalWeeks || "";
const enrolledMonths = studentMeta.enrolledMonths || "";
const enrolledYear = studentMeta.enrolledYear || growthBase?.yearsEnrolled || "";
const age = studentMeta.age || "";
const ageBand = studentMeta.ageBand || form.ageBand || "";

  const hasProfile = sourceCount > 0;

  if (!hasProfile) {
    return `${name}의 누적 성장 기본값은 아직 충분히 생성되지 않았습니다. JARVIS 누적 성장 정보를 불러오면 아이의 재원 흐름, 반복되는 강점, 최근 변화, 이번 달 관찰 포인트가 문장으로 정리됩니다.`;
  }

const enrollmentText =
  classWeek && enrolledMonths && enrolledYear
    ? `${name}은 현재 총 ${classWeek}주차, 약 ${enrolledMonths}개월차, ${enrolledYear}년차 재원 흐름에 있습니다. ${
        age ? `현재 ${age}세로 ${ageBand} 발달 흐름에 해당하며, ` : ""
      }집중브리핑은 현재 ${sourceCount}개가 누적되어 있고 이 기록을 기준으로 성장 방향을 정리했습니다.`
    : `${name}의 누적 기록은 현재 ${sourceCount}개의 집중브리핑을 기준으로 정리되었습니다. 실제 재원 주차와 연차는 JARVIS 학생 목록의 수업주차를 연결한 뒤 자동 계산됩니다.`;

  const mainText = mainKeywords.length
    ? `${mainKeywords.join(", ")}이 성장 흐름의 중심축으로 반복해서 나타납니다.`
    : "수업 참여와 관계 경험이 성장 흐름의 중심축으로 나타납니다.";

const subKeywordMeaningMap = {
  생각: "자신의 생각을 알아차리고 표현해보는 경험",
  친구: "친구와 함께하는 관계 장면",
  화: "감정이 올라오는 순간을 조절해보는 경험",
  함께: "또래와 같은 흐름 안에서 참여하는 경험",
  말: "말로 자신의 의사나 감정을 표현하는 경험",
  표현: "자신의 생각과 감정을 드러내는 경험",
  관계조율: "친구와 생각이나 속도가 다를 때 맞춰가는 경험",
  자기주도성: "스스로 선택하고 시작해보는 경험",
  자기표현: "자신의 생각을 관계 안에서 표현하는 경험",
  감정표현: "감정을 말이나 행동으로 드러내는 경험",
  감정조절: "감정이 흔들릴 때 다시 조절해보는 경험",
  몰입경험: "작업 안에서 집중을 유지하는 경험",
  과제지속: "어려운 지점에서도 과제를 이어가는 경험",
  문제해결: "막히는 상황에서 방법을 찾아보는 경험",
};

const subText = subKeywords.length
  ? `세부적으로는 ${subKeywords
      .slice(0, 4)
      .map((keyword) => subKeywordMeaningMap[keyword] || `${keyword} 경험`)
      .join(", ")}이 함께 확인됩니다.`
  : "세부 흐름은 JARVIS 누적 기록이 쌓이면서 더 선명하게 정리됩니다.";
  const strengthText =
    profile.repeatedStrengths ||
    "반복되는 작업 흐름 안에서 자신의 방식으로 참여하고 경험을 누적해가는 점이 강점으로 보입니다.";

  const needText =
    profile.repeatedNeeds ||
    "강점이 안정적으로 드러날 수 있도록 수업 안에서 반복 경험과 관계 경험을 이어갈 필요가 있습니다.";

  const recentText =
    profile.recentTrend ||
    "최근 기록에서는 기존 성장 흐름이 수업 안에서 반복적으로 이어지고 있습니다.";

  const focusText =
    profile.nextFocus ||
    "이번 달에는 아이가 자신의 생각을 어떻게 표현하는지, 감정이나 관계 상황에서 어떻게 조절하는지를 중심으로 관찰하면 좋습니다.";

  return [
    enrollmentText,
    `${name}의 누적 성장 흐름을 보면, 단순히 작품 결과를 만드는 것보다 ${mainText} ${subText}`,
    `반복 강점으로는 ${strengthText}`,
    `반복적으로 살펴볼 지점은 ${needText}`,
    `최근 변화는 ${recentText}`,
    `따라서 이번 달 브리핑에서는 ${focusText}`,
  ].join("\n\n");
}
function buildYearlyGrowthText(form) {
  const name = form.student?.trim() || "이 아이";
  const profile = form.growthProfile || emptyGrowthProfile();
  const meta = form.studentMeta || {};

  const enrolledYear = Number(meta.enrolledYear || 0);
  const sourceCount = profile.sourceCount || 0;

  const mainKeywords = (profile.dominantMainKeywords || []).slice(0, 3);
  const keywordText = mainKeywords.length
    ? mainKeywords.join(", ")
    : "수업 참여, 표현, 관계 경험";

  if (!enrolledYear) {
    return "- JARVIS 수업주차를 연결하면 현재 재원 연차를 기준으로 연차별 성장 흐름이 자동 정리됩니다.";
  }

  const lines = [];

  for (let year = 1; year <= enrolledYear; year += 1) {
    if (year < enrolledYear - 1) {
      lines.push(
        `- ${year}년차: 집중브리핑 기록 이전의 누적 재원 구간입니다. 이 시기는 현재 확인되는 성장 흐름의 기반이 형성된 시기로, 수업 공간 적응, 교사와의 라포, 애정 주제 탐색, 반복 경험이 쌓였던 구간으로 볼 수 있습니다.`
      );
    } else if (year === enrolledYear - 1) {
      lines.push(
        `- ${year}년차: 현재 집중브리핑에서 확인되는 ${keywordText} 흐름으로 이어지기 전 단계입니다. 이 시기에는 아이가 자신의 방식으로 수업에 참여하고, 좋아하는 주제와 작업 흐름 안에서 표현 경험을 넓혀갔던 구간으로 해석할 수 있습니다.`
      );
    } else {
      lines.push(
        `- ${year}년차: 현재 JARVIS 집중브리핑 ${sourceCount}개를 기준으로 보면, ${keywordText}이 성장의 중심축으로 반복 확인됩니다. 이번 연차에서는 단순히 작품을 완성하는 것보다, 수업 안에서 자신의 생각을 표현하고 관계 안에서 조율하는 경험이 중요한 흐름으로 보입니다.`
      );
    }
  }

  return lines.join("\n");
}
function buildQuarterlyGrowthText(form) {
  const observations = form.jarvisObservations || [];
  const profile = form.growthProfile || emptyGrowthProfile();

  const currentDate = form.date ? new Date(form.date) : new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentQuarter = Math.ceil(currentMonth / 3);

  const keywordMeaningMap = {
    관계조율: "또래와 생각이나 속도가 다를 때 관계 안에서 맞춰가는 경험",
    자기주도성: "스스로 선택하고 시작해보는 경험",
    자기표현: "자신의 생각을 관계 안에서 표현하는 경험",
    감정표현: "감정을 말이나 행동으로 드러내는 경험",
    감정조절: "감정이 흔들릴 때 다시 조절해보는 경험",
    몰입경험: "작업 안에서 집중을 유지하는 경험",
    과제지속: "어려운 지점에서도 과제를 이어가는 경험",
    문제해결: "막히는 상황에서 방법을 찾아보는 경험",
  };

  const countKeywords = (items) => {
    const counter = {};

    items.forEach((item) => {
      (item.mainKeywords || []).forEach((keyword) => {
        counter[keyword] = (counter[keyword] || 0) + 1;
      });
    });

    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([keyword]) => keyword);
  };

  const fallbackKeywords = (profile.dominantMainKeywords || []).slice(0, 3);

  const getQuarterItems = (quarter) => {
    return observations.filter((item) => {
      if (!item.date) return false;

      const date = new Date(item.date);
      if (Number.isNaN(date.getTime())) return false;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const itemQuarter = Math.ceil(month / 3);

      return year === currentYear && itemQuarter === quarter;
    });
  };

  const lines = [];

  for (let quarter = 1; quarter <= 4; quarter += 1) {
    const items = getQuarterItems(quarter);
    const keywords = countKeywords(items);
    const activeKeywords = keywords.length ? keywords : fallbackKeywords;

    const keywordText = activeKeywords.length
      ? activeKeywords.join(", ")
      : "수업 참여와 관계 경험";

    const meaningText = activeKeywords.length
      ? activeKeywords
          .map((keyword) => keywordMeaningMap[keyword] || `${keyword} 경험`)
          .join(", ")
      : "수업 안에서 반복되는 참여 경험";

    if (items.length > 0) {
      lines.push(
        `- ${quarter}분기: ${currentYear}년 ${quarter}분기 집중브리핑 ${items.length}개를 기준으로 보면, ${keywordText} 흐름이 확인됩니다. 이 시기에는 ${meaningText}이 중요한 성장 장면으로 보입니다.`
      );
    } else if (quarter > currentQuarter) {
      lines.push(
        `- ${quarter}분기: 아직 진행 전인 구간입니다. 현재까지의 누적 흐름을 바탕으로 ${keywordText}을 안정적으로 이어가며, 새롭게 나타나는 변화와 반복되는 어려움을 관찰할 예정입니다.`
      );
    } else {
      lines.push(
        `- ${quarter}분기: 해당 분기의 집중브리핑 기록이 충분하지 않습니다. 현재까지 확인된 ${keywordText} 흐름과 연결해 수업 장면에서 추가 관찰이 필요합니다.`
      );
    }
  }

  return lines.join("\n");
}
function buildMonthlyBaseText(form) {
  const name = form.student?.trim() || "이 아이";
  const profile = form.growthProfile || emptyGrowthProfile();

  const mainKeywords = (profile.dominantMainKeywords || []).slice(0, 3);
  const keywordText = mainKeywords.length
    ? mainKeywords.join(", ")
    : "수업 참여와 관계 경험";

  const strengthText =
    profile.repeatedStrengths ||
    "자신의 속도 안에서 수업 흐름에 참여하고 경험을 누적해가는 점이 강점으로 보입니다.";

  const needText =
    profile.repeatedNeeds ||
    "강점이 안정적으로 드러날 수 있도록 반복 경험과 관계 경험을 이어갈 필요가 있습니다.";

  const recentText =
    profile.recentTrend ||
    "최근 기록에서는 기존 성장 흐름이 수업 안에서 반복적으로 이어지고 있습니다.";

  const focusText =
    profile.nextFocus ||
    "이번 달에는 아이가 자신의 생각을 어떻게 표현하는지, 감정이나 관계 상황에서 어떻게 조절하는지를 중심으로 관찰하면 좋습니다.";

  return [
    `지난달까지의 누적 흐름을 보면, ${name}에게는 ${keywordText}이 현재 성장의 중심축으로 보입니다.`,
    `강점은 ${strengthText}`,
    `다만 반복적으로 살펴볼 지점은 ${needText}`,
    `최근 변화로는 ${recentText}`,
    `따라서 이번 달 브리핑에서는 ${focusText}`,
  ].join("\n");
}
export default function App() {
  const [form, setForm] = useState(getDefaultForm);
  const [studentProfiles, setStudentProfiles] = useState({});
  const [records, setRecords] = useState([]);
  const [csvStudents, setCsvStudents] = useState([]);
  const [recordSearch, setRecordSearch] = useState("");
  const [manualJarvisText, setManualJarvisText] = useState("");
  const [crawlerLimit, setCrawlerLimit] = useState(200);
  const [crawlerLoading, setCrawlerLoading] = useState(false);
  const [crawlerError, setCrawlerError] = useState("");
  const [visionResult, setVisionResult] = useState(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionError, setVisionError] = useState("");
  const [copied, setCopied] = useState("");
const [showPrompt, setShowPrompt] = useState(false);
   const [googleFormMessage, setGoogleFormMessage] = useState("");
   const [googleFormCandidates, setGoogleFormCandidates] = useState([]);
   const [googleFormLoading, setGoogleFormLoading] = useState(false);
  useEffect(() => {
    const profiles = localStorage.getItem("jarada-student-profiles-v20");
    const savedRecords = localStorage.getItem("jarada-briefing-records-v20");

    if (profiles) setStudentProfiles(JSON.parse(profiles));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  useEffect(() => {
    localStorage.setItem("jarada-student-profiles-v20", JSON.stringify(studentProfiles));
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem("jarada-briefing-records-v20", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    const list = stageKeywords[form.months] || [];
    if (!list.includes(form.stage)) setForm((prev) => ({ ...prev, stage: list[0] || "" }));
  }, [form.months, form.stage]);

  useEffect(() => {
    const domains = Object.keys(ageDomains[form.ageBand] || {});
    if (!domains.includes(form.ageDomain)) {
      const next = domains[0] || "";
      setForm((prev) => ({ ...prev, ageDomain: next, ageSubKeywords: [] }));
    }
  }, [form.ageBand, form.ageDomain]);

  const prompt = useMemo(() => generatePrompt(form, visionResult), [form, visionResult]);
  const preview = useMemo(() => generatePreview(form, visionResult), [form, visionResult]);
  const savedStudentNames = useMemo(() => Object.keys(studentProfiles).sort(), [studentProfiles]);
  const filteredRecords = useMemo(() => {
    const q = recordSearch.trim();
    if (!q) return records;
    return records.filter((record) => (record.student || "").includes(q));
  }, [records, recordSearch]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

   const getTemporaryGoogleFormCandidates = (studentName, age) => [
  {
    id: "temp-google-form-1",
    studentName,
    age: age || "",
    phoneLast4: "1234",
    submittedAt: "2026-04-12",
    parentNeeds: {
      homeDirection: "자기표현",
      classFlow: "감정조절",
      peerBehavior: "관계조율",
      longTermGoal:
        "자신의 생각과 감정을 안정적으로 표현하고, 또래 관계 안에서 차이를 조율하는 힘을 기르는 것",
      evidence: [
        "구글폼 API 연계 전 임시 후보값입니다.",
        "실제 연계 후에는 학생명과 나이 기준으로 후보가 자동 조회됩니다.",
      ],
    },
  },
  {
    id: "temp-google-form-2",
    studentName,
    age: age || "",
    phoneLast4: "5678",
    submittedAt: "2026-04-15",
    parentNeeds: {
      homeDirection: "자기주도성",
      classFlow: "몰입경험",
      peerBehavior: "관계유지",
      longTermGoal:
        "수업 안에서 스스로 선택하고 몰입하는 힘을 키우며, 또래와 안정적으로 관계를 이어가는 것",
      evidence: [
        "동명이인 상황을 가정한 임시 후보값입니다.",
        "실제 연계 후에는 교사가 후보 중 맞는 응답을 선택하게 됩니다.",
      ],
    },
  },
];
const normalizeGoogleFormCandidate = (candidate) => ({
  id: candidate.id || `google-form-${candidate.submittedAt || Date.now()}`,
  studentName: candidate.studentName || "",
  age: candidate.age || "",
  phoneLast4: candidate.phoneLast4 || "",
  submittedAt: candidate.submittedAt || "",
  parentNeeds: {
    homeDirection: candidate.parentNeeds?.homeDirection || "",
    classFlow: candidate.parentNeeds?.classFlow || "",
    peerBehavior: candidate.parentNeeds?.peerBehavior || "",
    longTermGoal: candidate.parentNeeds?.longTermGoal || "",
    evidence: Array.isArray(candidate.parentNeeds?.evidence)
      ? candidate.parentNeeds.evidence
      : [],
  },
});
const isValidGoogleFormCandidate = (candidate) => {
  if (!candidate) return false;
  if (!candidate.id) return false;
  if (!candidate.studentName) return false;
  if (!candidate.submittedAt) return false;
  if (!candidate.parentNeeds) return false;

  const hasAnyParentNeed =
    candidate.parentNeeds.homeDirection ||
    candidate.parentNeeds.classFlow ||
    candidate.parentNeeds.peerBehavior ||
    candidate.parentNeeds.longTermGoal;

  return Boolean(hasAnyParentNeed);
};
   const fetchGoogleFormCandidates = async (studentName, age) => {
 // TODO: 실제 Google Form API 연계 후에는 네트워크 요청 시간이 생기므로 이 임시 지연 코드는 제거합니다.
   await new Promise((resolve) => setTimeout(resolve, 1000));

// TODO: 실제 Google Form API 연계 후에는 API 호출 실패 시 catch 분기로 처리합니다.
   if (studentName.includes("오류")) {
    throw new Error("구글폼 임시 조회 실패 테스트");
  }

return getTemporaryGoogleFormCandidates(studentName, age).map(normalizeGoogleFormCandidate);
};
const fetchGoogleFormNeeds = async () => {
  const studentName = form.student.trim();

  if (!studentName) {
    setGoogleFormMessage("학생명을 먼저 입력하면 구글폼 응답을 불러올 수 있습니다.");
    setGoogleFormCandidates([]);
    return;
  }
// TODO: 실제 Google Form API 연계 후에는 응답 결과가 0건일 때 이 분기로 대체합니다.
   if (studentName.includes("후보없음")) {
  setGoogleFormCandidates([]);
  setGoogleFormMessage(
    `${studentName} 학생 이름으로 연결 가능한 구글폼 심화설문 응답이 없습니다.`
  );
  return;
}
setGoogleFormLoading(true);

try {
  const candidates = await fetchGoogleFormCandidates(
    studentName,
    form.studentMeta?.age
  );

  setGoogleFormCandidates(candidates);

  setGoogleFormMessage(
    `${studentName} 학생 이름으로 구글폼 심화설문 후보 ${candidates.length}건을 찾았습니다. 연결할 설문을 선택해 주세요.`
  );
} catch (error) {


  setGoogleFormCandidates([]);
  setGoogleFormMessage(
    "구글폼 응답을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
  );
} finally {
  setGoogleFormLoading(false);
}
};

const connectGoogleFormCandidate = (candidate) => {
  setForm((prev) => ({
    ...prev,
    parentNeeds: candidate.parentNeeds,
  }));

  setStudentProfiles((prev) => ({
    ...prev,
    [candidate.studentName]: {
      ...(prev[candidate.studentName] || {}),
      student: candidate.studentName,
      parentNeeds: candidate.parentNeeds,
      googleFormSource: {
        id: candidate.id,
        submittedAt: candidate.submittedAt,
        phoneLast4: candidate.phoneLast4,
      },
    },
  }));

  setGoogleFormMessage(
    `${candidate.studentName} 학생의 ${candidate.submittedAt} 구글폼 응답을 연결했습니다.`
  );

  setGoogleFormCandidates([]);
};
   const disconnectGoogleFormCandidate = () => {
  const studentName = form.student.trim();

  if (!studentName) {
    setGoogleFormMessage("학생명을 먼저 입력해야 연결을 해제할 수 있습니다.");
    return;
  }

  const emptyParentNeeds = getDefaultForm().parentNeeds;

  setForm((prev) => ({
    ...prev,
    parentNeeds: emptyParentNeeds,
  }));

  setStudentProfiles((prev) => ({
    ...prev,
    [studentName]: {
      ...(prev[studentName] || {}),
      student: studentName,
      parentNeeds: emptyParentNeeds,
      googleFormSource: null,
    },
  }));

  setGoogleFormMessage(`${studentName} 학생의 구글폼 응답 연결을 해제했습니다.`);
  setGoogleFormCandidates([]);
};

  const updateNeeds = (key, value) => setForm((prev) => ({ ...prev, parentNeeds: { ...prev.parentNeeds, [key]: value } }));
  const toggle = (list, value) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  const recomputeProfile = (observations, parentNeeds = form.parentNeeds, student = form.student) => {
    return generateGrowthProfile({ student, observations, parentNeeds });
  };

  const resetCurrentInput = () => {
    setForm((prev) => ({
      ...getDefaultForm(),
      date: new Date().toISOString().slice(0, 10),
      briefingMonth: new Date().toISOString().slice(0, 7),
    }));
    setVisionResult(null);
    setVisionError("");
    setCrawlerError("");
  };

  const clearCsvResults = () => setCsvStudents([]);

  const clearStudentProfiles = () => {
    const ok = window.confirm("저장된 학생 기본값과 누적 성장 프로필을 모두 삭제할까요?");
    if (!ok) return;
    setStudentProfiles({});
    localStorage.removeItem("jarada-student-profiles-v20");
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const text = String(readerEvent.target?.result || "");
      const rows = parseCSV(text);
      const groupedLatest = {};

      rows.forEach((row) => {
        const name = findStudentName(row);
        if (!name || name === "이름없음") return;

        const submittedAt = findSubmittedAt(row);
        const submittedTime = parseSubmittedTime(submittedAt);
        const raw = Object.values(row).join(" ");
        const candidate = { name, submittedAt, submittedTime, rowIndex: row.__rowIndex, raw, parentNeeds: analyzeSurvey(raw) };
        const existing = groupedLatest[name];

        if (!existing) {
          groupedLatest[name] = candidate;
          return;
        }

        const candidateScore = submittedTime || row.__rowIndex;
        const existingScore = existing.submittedTime || existing.rowIndex;
        if (candidateScore >= existingScore) groupedLatest[name] = candidate;
      });

      setCsvStudents(Object.values(groupedLatest).sort((a, b) => a.name.localeCompare(b.name)));
    };
    reader.readAsText(file, "utf-8");
  };

  const applyCSVStudent = (student) => {
    const existingProfile = studentProfiles[student.name];
    const observations = existingProfile?.jarvisObservations || [];
    const growthProfile = observations.length
      ? recomputeProfile(observations, student.parentNeeds, student.name)
      : existingProfile?.growthProfile || emptyGrowthProfile();

    setForm((prev) => ({
      ...prev,
      student: student.name,
      parentNeeds: { ...student.parentNeeds },
      jarvisObservations: observations,
      growthProfile,
    }));
  };

  const saveAllCSVProfiles = () => {
    if (csvStudents.length === 0) {
      alert("먼저 CSV 파일을 업로드해 주세요.");
      return;
    }

    const nextProfiles = { ...studentProfiles };
    csvStudents.forEach((student) => {
      if (!student.name || student.name === "이름없음") return;
      const existing = nextProfiles[student.name] || {};
      const observations = existing.jarvisObservations || [];
      const growthProfile = observations.length
        ? generateGrowthProfile({ student: student.name, observations, parentNeeds: student.parentNeeds })
        : existing.growthProfile || emptyGrowthProfile();

      nextProfiles[student.name] = {
        ...existing,
        parentNeeds: { ...student.parentNeeds },
        jarvisObservations: observations,
        growthProfile,
        submittedAt: student.submittedAt,
        updatedAt: new Date().toISOString(),
      };
    });

    setStudentProfiles(nextProfiles);
    alert("최신 설문 기준으로 학생 기본값을 저장했습니다.");
  };

  const saveStudentProfile = () => {
    const name = form.student.trim();
    if (!name) {
      alert("학생명을 먼저 입력해 주세요.");
      return;
    }

    setStudentProfiles((prev) => ({
      ...prev,
      [name]: {
        parentNeeds: { ...form.parentNeeds },
        jarvisObservations: [...form.jarvisObservations],
        growthProfile: { ...form.growthProfile },
        updatedAt: new Date().toISOString(),
      },
    }));

    alert(`${name} 학생의 기본값과 누적 성장 프로필을 저장했습니다.`);
  };

const loadStudentProfile = (name) => {
  if (!name) return;

  const profile = studentProfiles[name];
  const hasParentNeeds = Boolean(profile?.parentNeeds);
  const hasJarvisBase = Boolean(
    profile?.studentMeta || profile?.growthProfile?.sourceCount
  );

  setForm((prev) => ({
    ...prev,
    student: name,
    parentNeeds: hasParentNeeds ? { ...profile.parentNeeds } : emptyNeeds(),
    jarvisObservations: profile?.jarvisObservations || [],
    growthProfile: profile?.growthProfile || emptyGrowthProfile(),
    growthBase: profile?.growthBase || null,
    studentMeta: profile?.studentMeta || null,
    ageBand: profile?.studentMeta?.ageBand || prev.ageBand,
  }));
if (profile?.googleFormSource === null) {
  return;
}
  if (hasParentNeeds && hasJarvisBase) {
    setGoogleFormMessage(
      `${name} 학생의 저장된 학부모 니즈와 JARVIS 성장 기본값을 불러왔습니다.`
    );
  } else if (hasParentNeeds && !hasJarvisBase) {
    setGoogleFormMessage(
      `${name} 학생의 학부모 니즈는 불러왔지만, JARVIS 성장 기본값은 아직 없습니다. JARVIS 누적 성장 불러오기를 눌러 생성할 수 있습니다.`
    );
  } else if (!hasParentNeeds && hasJarvisBase) {
    setGoogleFormMessage(
      `${name} 학생의 JARVIS 성장 기본값은 불러왔지만, 학부모 니즈는 아직 없습니다. 구글폼 응답 불러오기를 눌러 기본값을 생성할 수 있습니다.`
    );
  } else {
    setGoogleFormMessage(
      `${name} 학생의 저장된 기본값이 아직 없습니다. 구글폼 응답 불러오기와 JARVIS 누적 성장 불러오기를 순서대로 진행해 주세요.`
    );
  }

  if (hasJarvisBase) {
    setCrawlerError("");
  }
};
   useEffect(() => {
  const name = form.student.trim();

  if (!name) return;
  if (!studentProfiles[name]) return;

  loadStudentProfile(name);
}, [form.student, studentProfiles]);
  const copyText = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const saveRecord = () => {
    const item = {
      id: crypto.randomUUID(),
      ...form,
      prompt,
      preview,
      visionResult,
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => [item, ...prev]);
  };

  const deliverMonthlyBriefing = () => {
    const name = form.student.trim();
    if (!name) {
      alert("학생명을 먼저 입력해 주세요.");
      return;
    }

    const monthlyRecord = {
      id: crypto.randomUUID(),
      ...form,
      prompt,
      preview,
      visionResult,
      deliveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updatedProfile = updateProfileWithMonthlyBriefing({ profile: form.growthProfile, monthlyRecord, parentNeeds: form.parentNeeds });

    setRecords((prev) => [monthlyRecord, ...prev]);
    setForm((prev) => ({ ...prev, growthProfile: updatedProfile }));
    setStudentProfiles((prev) => ({
      ...prev,
      [name]: {
        ...(prev[name] || {}),
        parentNeeds: { ...form.parentNeeds },
        jarvisObservations: [...form.jarvisObservations],
        growthProfile: updatedProfile,
        lastDeliveredMonth: form.briefingMonth,
        updatedAt: new Date().toISOString(),
      },
    }));

    alert("이번달 브리핑을 저장했고, 다음달 기본값으로 성장 프로필을 업데이트했습니다.");
  };

  const onImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ preview: String(reader.result), dataUrl: String(reader.result) });
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setForm((prev) => ({ ...prev, images }));
      setVisionResult(null);
      setVisionError("");
    });
  };

  const runVisionAnalysis = async () => {
    if (!form.images.length) {
      alert("작품 사진을 먼저 업로드해 주세요.");
      return;
    }

    try {
      setVisionLoading(true);
      setVisionError("");
      const response = await fetch("/api/vision-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: form.images.map((image) => image.dataUrl),
          project: form.project,
          months: form.months,
          stage: form.stage,
          ageBand: form.ageBand,
          ageDomain: form.ageDomain,
          ageSubKeywords: form.ageSubKeywords,
          projectKeywordsSelected: form.projectKeywordsSelected,
          socialDomain: form.socialDomain,
          socialKeywordsSelected: form.socialKeywordsSelected,
          memo: form.memo,
          parentNeeds: form.parentNeeds,
          growthProfile: form.growthProfile,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || data?.error || "작품 분석에 실패했습니다.");
      setVisionResult(data);
      if (data?.artwork_flow_memo) update("artworkFlow", data.artwork_flow_memo);
    } catch (error) {
      setVisionError(error.message || "작품 분석 중 오류가 발생했습니다.");
    } finally {
      setVisionLoading(false);
    }
  };

  const importManualJarvis = () => {
    if (!form.student.trim()) {
      alert("학생명을 먼저 입력해 주세요.");
      return;
    }

    const imported = parseManualJarvisText(manualJarvisText, form.student.trim(), form.ageBand);
    if (!imported.length) {
      alert("붙여넣은 JARVIS 관찰일지가 없습니다.");
      return;
    }

    const merged = mergeObservations(form.jarvisObservations, imported);
    const growthProfile = recomputeProfile(merged);

    setForm((prev) => ({ ...prev, jarvisObservations: merged, growthProfile }));
    setManualJarvisText("");
    alert(`${imported.length}개의 관찰일지를 추가했고, 기본값을 업데이트했습니다.`);
  };

  const fetchJarvisByCrawler = async () => {
    if (!form.student.trim()) {
      alert("학생명을 먼저 입력해 주세요.");
      return;
    }

    try {
      setCrawlerLoading(true);
      setCrawlerError("");

      const url = `http://localhost:4141/api/jarvis/observations?student=${encodeURIComponent(form.student.trim())}&limit=${crawlerLimit}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "로컬 JARVIS 크롤러 연결에 실패했습니다.");
const studentMeta = data.studentMeta || null;

if (studentMeta) {
  console.log("학생 메타:", studentMeta);
}
     const incoming = (data.observations || []).map((item) => {
  const observation = buildObservationFromCrawler(
    item,
    form.student.trim(),
    form.ageBand
  );

  const analyzedKeywords = analyzeObservationText(observation.rawText);

  observation.analyzedKeywords = analyzedKeywords;

  observation.mainKeywords = [
    ...new Set(analyzedKeywords.map((k) => k.main)),
  ];

  observation.subKeywords = [
    ...new Set(analyzedKeywords.map((k) => k.sub)),
  ];

  observation.evidence = analyzedKeywords
    .filter((k) => k.evidence)
    .map((k) => ({
      keyword: k.sub,
      sentence: k.evidence,
    }));

  return observation;
});

const merged = mergeObservations(form.jarvisObservations, incoming);

const growthProfile = recomputeProfile(merged);

const growthBase = buildStudentGrowthBase(merged);

console.log("성장 기본값:", growthBase);
console.log("학생 메타 최종 저장:", studentMeta);

setForm((prev) => ({
  ...prev,
  ageBand: studentMeta?.ageBand || prev.ageBand,
  studentMeta,
  jarvisObservations: merged,
  growthProfile,
  growthBase,
}));
const studentNameForProfile = form.student.trim();
     

if (studentNameForProfile) {
  setStudentProfiles((prev) => ({
    ...prev,
    [studentNameForProfile]: {
      ...(prev[studentNameForProfile] || {}),
      student: studentNameForProfile,
      parentNeeds: form.parentNeeds,
      jarvisObservations: merged,
      growthProfile,
      growthBase,
      studentMeta,
      jarvisUpdatedAt: new Date().toISOString(),
    },
  }));
}
alert(`${incoming.length}개의 JARVIS 관찰일지를 불러왔고, 기본값을 업데이트했습니다.`);
    } catch (error) {
      setCrawlerError(error.message || "JARVIS 크롤러 연결 중 오류가 발생했습니다. 로컬 크롤러 서버가 켜져 있는지 확인해 주세요.");
    } finally {
      setCrawlerLoading(false);
    }
  };

  const removeObservation = (id) => {
    const next = form.jarvisObservations.filter((item) => item.id !== id);
    const growthProfile = recomputeProfile(next);
    setForm((prev) => ({ ...prev, jarvisObservations: next, growthProfile }));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topGrid}>
          <div style={{ ...styles.card, textAlign: "center", minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1 style={styles.title}>JARADA 성장기반 심화브리핑</h1>
            <p style={{ ...styles.subtitle, maxWidth: 780 }}>
              초기 심화설문지의 학부모 니즈, JARVIS 누적 관찰일지, 이번달 수업 키워드와 작품 흐름을 연결해 아이의 성장 서사가 이어지는 월간 심화브리핑을 만듭니다.
            </p>
          </div>

          <div style={styles.darkCard}>
            <div style={{ fontWeight: 800, marginBottom: 14 }}>운영 원칙</div>
            <div style={{ display: "grid", gap: 10, lineHeight: 1.7 }}>
              <div>1. 기본값 = 지난달까지 누적 성장 프로필</div>
              <div>2. 학부모 설문 = 소비자 니즈</div>
              <div>3. JARVIS 관찰일지 = 실제 성장 근거</div>
              <div>4. 이번달 버튼 선택 = 교사 해석</div>
              <div>5. 전달 저장 시 다음달 기본값으로 업데이트</div>
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>1. 학생 / 초기 심화설문지</h2>
              <div style={styles.sectionHint}>CSV 설문 결과는 학부모님이 아이에게 바라는 초기 니즈로 저장됩니다.</div>

              <div style={styles.row}>
                <Field label="학생명 직접 입력">
                  <input
                    style={styles.input}
                    value={form.student}
                    onChange={(event) => update("student", event.target.value)}
                    onBlur={(event) => {
                      const name = event.target.value.trim();
                      if (studentProfiles[name]) loadStudentProfile(name);
                    }}
                    placeholder="예: 최민준"
                  />
                </Field>

                <Field label="저장된 학생 불러오기">
                  <select style={styles.input} value="" onChange={(event) => loadStudentProfile(event.target.value)}>
                    <option value="">저장된 학생 선택</option>
                    {savedStudentNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </Field>
              </div>

           <div style={{ marginTop: 18, maxWidth: 360 }}>
  <Field label="작성일">
    <input
      type="date"
      style={styles.input}
      value={form.date}
      onChange={(event) => {
        const nextDate = event.target.value;
        setForm((prev) => ({
          ...prev,
          date: nextDate,
          briefingMonth: nextDate ? nextDate.slice(0, 7) : prev.briefingMonth,
        }));
      }}
    />
  </Field>
</div>
            
          <div style={styles.softBox}>
  <h3>학부모 심화설문 기반 성장 니즈</h3>
 <div style={styles.sectionHint}>
  구글폼 심화설문 응답과 연계되어 학생명 기준 가장 최근 학부모 니즈가 자동 반영될 영역입니다.
  현재는 API 연계 전 단계이므로 필요한 경우 임시로 확인하거나 수정할 수 있습니다.
</div>
            <div style={{ ...styles.miniStat, marginTop: 12 }}>
  구글폼 연계 상태
  <br />
  <strong>API 연계 준비 중 · 현재는 임시 확인값 사용</strong>

{form.student.trim() &&
  studentProfiles[form.student.trim()]?.googleFormSource && (
    <>
      <div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>
        연결된 구글폼 응답:{" "}
        {studentProfiles[form.student.trim()].googleFormSource.submittedAt} / 연락처 뒷자리{" "}
        {studentProfiles[form.student.trim()].googleFormSource.phoneLast4}
      </div>
       

      <button
        type="button"
        style={{ ...styles.secondaryBtn, marginTop: 8 }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          disconnectGoogleFormCandidate();
        }}
      >
        연결 해제하기
      </button>
       <button
  type="button"
  style={{ ...styles.secondaryBtn, marginTop: 8, marginLeft: 8 }}
  onClick={(event) => {
    event.preventDefault();
    event.stopPropagation();
    fetchGoogleFormNeeds();
  }}
>
  다른 설문 선택하기
</button>
    </>
  )}
               {googleFormMessage && (
  <div style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>
    {googleFormMessage}
  </div>
)}
</div>
<div style={{ marginTop: 12 }}>
<button
  type="button"
  style={{
    ...styles.secondaryBtn,
    opacity: googleFormLoading ? 0.6 : 1,
    cursor: googleFormLoading ? "not-allowed" : "pointer",
  }}
  disabled={googleFormLoading}
  onClick={fetchGoogleFormNeeds}
>
  {googleFormLoading ? "불러오는 중..." : "구글폼 응답 불러오기"}
</button>

  {googleFormCandidates.length > 0 && (
    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
      {googleFormCandidates.map((candidate) => (
        <div key={candidate.id} style={styles.recordCard}>
          <strong>
            {candidate.studentName} / {candidate.age || "나이 미확인"}세
          </strong>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            연락처 뒷자리 {candidate.phoneLast4} · {candidate.submittedAt} 응답
          </div>
           {form.student.trim() &&
  studentProfiles[form.student.trim()]?.googleFormSource?.id === candidate.id && (
    <div style={{ fontSize: 12, color: "#0f766e", marginTop: 6, fontWeight: 700 }}>
      현재 연결된 설문
    </div>
  )}
          <div style={{ fontSize: 13, color: "#334155", marginTop: 8, lineHeight: 1.7 }}>
            가정: {candidate.parentNeeds.homeDirection} / 수업:{" "}
            {candidate.parentNeeds.classFlow} / 또래:{" "}
            {candidate.parentNeeds.peerBehavior}
          </div>
     <button
  type="button"
  disabled={Boolean(
    form.student.trim() &&
      studentProfiles[form.student.trim()]?.googleFormSource?.id === candidate.id
  )}
  style={{
    ...styles.secondaryBtn,
    marginTop: 8,
    opacity:
      form.student.trim() &&
      studentProfiles[form.student.trim()]?.googleFormSource?.id === candidate.id
        ? 0.5
        : 1,
    cursor:
      form.student.trim() &&
      studentProfiles[form.student.trim()]?.googleFormSource?.id === candidate.id
        ? "not-allowed"
        : "pointer",
  }}
  onClick={(event) => {
    event.preventDefault();
    event.stopPropagation();

    const isCurrentCandidate =
      form.student.trim() &&
      studentProfiles[form.student.trim()]?.googleFormSource?.id === candidate.id;

    if (isCurrentCandidate) return;

    connectGoogleFormCandidate(candidate);
  }}
>
  {form.student.trim() &&
  studentProfiles[form.student.trim()]?.googleFormSource?.id === candidate.id
    ? "이미 연결됨"
    : "이 설문 연결하기"}
</button>
        </div>
      ))}
    </div>
  )}
</div>

  <div style={styles.row3}>
                  <Field label="가정에서 함께 세워가는 성장 방향">
                    <input list="home-options" style={styles.input} value={form.parentNeeds.homeDirection} onChange={(event) => updateNeeds("homeDirection", event.target.value)} />
                  </Field>
                  <Field label="수업 안에서 이어가는 성장 흐름">
                    <input list="class-options" style={styles.input} value={form.parentNeeds.classFlow} onChange={(event) => updateNeeds("classFlow", event.target.value)} />
                  </Field>
                  <Field label="또래 관계 속에서 보완해가는 행동 변화">
                    <input list="peer-options" style={styles.input} value={form.parentNeeds.peerBehavior} onChange={(event) => updateNeeds("peerBehavior", event.target.value)} />
                  </Field>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Field label="장기 목표">
                    <input style={styles.input} value={form.parentNeeds.longTermGoal} onChange={(event) => updateNeeds("longTermGoal", event.target.value)} />
                  </Field>
                </div>
{(form.parentNeeds.homeDirection ||
  form.parentNeeds.classFlow ||
  form.parentNeeds.peerBehavior) && (
  <div style={styles.previewBox}>
    <strong>학부모 니즈 해석</strong>
    {"\n\n"}
    {buildParentNeedsInsight(form)}
  </div>
)}
                <datalist id="home-options">{needOptions.homeDirection.map((value) => <option key={value} value={value} />)}</datalist>
                <datalist id="class-options">{needOptions.classFlow.map((value) => <option key={value} value={value} />)}</datalist>
                <datalist id="peer-options">{needOptions.peerBehavior.map((value) => <option key={value} value={value} />)}</datalist>

                {form.parentNeeds.evidence?.length > 0 && (
                  <div style={styles.previewBox}>
                    <strong>설문 기반 근거</strong>{"\n"}
                    {form.parentNeeds.evidence.map((item) => `- ${item}`).join("\n")}
                  </div>
                )}
              </div>
            </section>

            <section style={{ ...styles.card, marginTop: 24 }}>
              <h2 style={styles.sectionTitle}>2. JARVIS 누적 관찰일지 / 성장 기본값</h2>
              <div style={styles.sectionHint}>크롤러 연결 전에는 수동 붙여넣기로도 누적 성장 프로필을 만들 수 있습니다.</div>

             <div style={{ marginTop: 18 }}>
  <Field
    label="JARVIS 누적 성장 불러오기"
    hint="학생의 집중브리핑, 수업주차, 나이를 불러와 아이 성장 기본값을 자동 생성합니다."
  >
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button style={styles.primaryBtn} onClick={fetchJarvisByCrawler}>
        {crawlerLoading ? "불러오는 중..." : "JARVIS 누적 성장 불러오기"}
      </button>
    </div>
    {crawlerError && <div style={{ color: "#b91c1c", marginTop: 10 }}>{crawlerError}</div>}
  </Field>
</div>
         
               {form.growthProfile.sourceCount > 0 && (
  <div style={styles.previewBox}>
    <strong>아이 성장 기본값</strong>
    {"\n\n"}
<strong>성장 흐름 해석</strong>
{"\n"}
{buildGrowthBaseInsight(form)}

{"\n\n"}
   <strong>1. 전체 재원 흐름</strong>
{"\n"}
- 총 수업주차: {form.studentMeta?.classWeek ? `${form.studentMeta.classWeek}주차` : "JARVIS 연결 후 자동 계산"}
{"\n"}
- 재원기간: {form.studentMeta?.enrolledMonths ? `약 ${form.studentMeta.enrolledMonths}개월차` : "JARVIS 연결 후 자동 계산"}
{"\n"}
- 현재 연차: {form.studentMeta?.enrolledYear ? `${form.studentMeta.enrolledYear}년차` : "JARVIS 연결 후 자동 계산"}
{"\n"}
- 현재 연령 흐름:{" "}
{form.studentMeta?.age
  ? `${form.studentMeta.age}세 / ${form.studentMeta.ageBand || form.ageBand}`
  : form.ageBand || "연령대 미확인"}
{"\n"}
- 집중브리핑 누적 수: {form.growthProfile.sourceCount}개
     
    {"\n\n"}
   <strong>2. 연차별 성장 흐름</strong>
{"\n"}
{buildYearlyGrowthText(form)}
    {"\n\n"}
   <strong>3. 올해 분기별 성장 흐름</strong>
{"\n"}
{buildQuarterlyGrowthText(form)}
    {"\n\n"}
   <strong>4. 지난달까지의 기본값</strong>
{"\n"}
{buildMonthlyBaseText(form)}
  </div>
)}
         
            </section>
<section style={{ ...styles.card, marginTop: 24 }}>
  <h2 style={styles.sectionTitle}>3. 이번달 수업 키워드 / 교사 해석</h2>

  <div style={styles.sectionHint}>
    재원기간과 연령대는 JARVIS 기준으로 자동 계산됩니다. 교사는 이번달 프로젝트, 사회성 방향, 성장 키워드, 관찰 메모만 선택하면 됩니다.
  </div>

  <div style={{ marginTop: 18 }}>
    <Field label="자동 기본 정보">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div style={styles.miniStat}>
          수업주차
          <br />
          <strong>
            {form.studentMeta?.classWeek ? `${form.studentMeta.classWeek}주차` : "JARVIS 연결 전"}
          </strong>
        </div>

        <div style={styles.miniStat}>
          재원기간
          <br />
          <strong>
            {form.studentMeta?.enrolledMonths
              ? `약 ${form.studentMeta.enrolledMonths}개월차`
              : "자동 계산 전"}
          </strong>
        </div>

        <div style={styles.miniStat}>
          연령대
          <br />
          <strong>
            {form.studentMeta?.age
              ? `${form.studentMeta.age}세 / ${form.studentMeta.ageBand || form.ageBand}`
              : form.ageBand || "자동 계산 전"}
          </strong>
        </div>
      </div>
    </Field>
  </div>

  <div style={styles.softBox}>
    <h3>이번달 성장 키워드</h3>
    <div style={styles.sectionHint}>
      이번달 브리핑에서 강조할 성장 키워드를 선택합니다.
    </div>

    <div style={styles.row}>
      <Field label="메인키워드">
        <div style={styles.chips}>
          {Object.keys(ageDomains[form.ageBand] || {}).map((domain) => (
            <Chip
              key={domain}
              active={form.ageDomain === domain}
              onClick={() => update("ageDomain", domain)}
            >
              {domain}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="파생키워드">
        <div style={styles.chips}>
          {((ageDomains[form.ageBand] || {})[form.ageDomain] || []).map((keyword) => (
            <Chip
              key={keyword}
              active={form.ageSubKeywords.includes(keyword)}
              onClick={() => toggleArray("ageSubKeywords", keyword)}
            >
              {keyword}
            </Chip>
          ))}
        </div>
      </Field>
    </div>
  </div>

  <div style={styles.row}>
    <Field label="이번달 프로젝트">
      <div style={styles.chips}>
        {projects.map((project) => (
          <Chip
            key={project}
            active={form.project === project}
            onClick={() => update("project", project)}
          >
            {project}
          </Chip>
        ))}
      </div>
    </Field>

    <Field label="프로젝트 키워드">
      <div style={styles.chips}>
        {(projectKeywords[form.project] || []).map((keyword) => (
          <Chip
            key={keyword}
            active={form.projectKeywordsSelected.includes(keyword)}
            onClick={() => toggleArray("projectKeywordsSelected", keyword)}
          >
            {keyword}
          </Chip>
        ))}
      </div>
    </Field>
  </div>

  <div style={styles.softBox}>
    <h3>사회성코칭</h3>
    <div style={styles.sectionHint}>
      이번달 수업에서 중심으로 볼 사회성 방향과 구체 행동 키워드를 선택합니다.
    </div>

    <div style={styles.row}>
      <Field label="사회성 메인영역">
        <div style={styles.chips}>
          {Object.keys(socialMainKeywords).map((domain) => (
            <Chip
              key={domain}
              active={form.socialDomain === domain}
              onClick={() => update("socialDomain", domain)}
            >
              {domain}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="사회성 파생키워드">
        <div style={styles.chips}>
          {(socialMainKeywords[form.socialDomain] || []).map((keyword) => (
            <Chip
              key={keyword}
              active={form.socialKeywordsSelected.includes(keyword)}
              onClick={() => toggleArray("socialKeywordsSelected", keyword)}
            >
              {keyword}
            </Chip>
          ))}
        </div>
      </Field>
    </div>
  </div>

  <div style={styles.row}>
    <Field label="작품 흐름 메모">
      <textarea
        style={styles.textarea}
        value={form.artworkFlow}
        onChange={(event) => update("artworkFlow", event.target.value)}
        placeholder="예시) 처음에는 형태를 잡는 데 집중했고, 이후 반복하며 디테일을 보완하는 흐름으로 이어졌습니다."
      />
    </Field>

    <Field label="이번달 관찰 메모">
      <textarea
        style={styles.textarea}
        value={form.memo}
        onChange={(event) => update("memo", event.target.value)}
        placeholder="예시) 친구의 작업을 보며 따라 해보려는 시도를 보였고, 어려운 부분에서는 도움을 받아 다시 이어가려는 모습이 나타났습니다."
      />
    </Field>
  </div>


</section>
         
        <section style={{ ...styles.card, marginTop: 24 }}>
  <h2 style={styles.sectionTitle}>브리핑 초안 미리보기</h2>
  <div style={styles.previewBox}>{preview}</div>

  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
    <button style={styles.primaryBtn} onClick={deliverMonthlyBriefing}>
      이번달 브리핑 저장
    </button>

    <button style={styles.secondaryBtn} onClick={() => copyText(preview, "preview")}>
      {copied === "preview" ? "초안 복사됨" : "브리핑 초안 복사"}
    </button>
  </div>
</section>
          </div>

          <div>
          <div>
<section style={styles.card}>
  <h2 style={styles.sectionTitle}>GPT 프롬프트</h2>

  <div style={styles.sectionHint}>
    브리핑이 어떤 기준과 구조로 작성되는지 확인할 때만 펼쳐서 봅니다.
  </div>

  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
    <button
      style={styles.secondaryBtn}
      onClick={() => setShowPrompt((prev) => !prev)}
    >
      {showPrompt ? "프롬프트 숨기기" : "프롬프트 보기"}
    </button>
  </div>

  {showPrompt && (
    <div style={{ ...styles.promptBox, marginTop: 12 }}>
      {prompt}
    </div>
  )}
</section>

  <section style={{ ...styles.card, marginTop: 24 }}>
    <h2 style={styles.sectionTitle}>저장된 기록</h2>
              <input style={styles.input} value={recordSearch} onChange={(event) => setRecordSearch(event.target.value)} placeholder="아이 이름 검색" />

                         {filteredRecords.length === 0 ? (
                <div style={styles.recordCard}>저장된 기록이 없습니다.</div>
              ) : (
                filteredRecords.map((record) => (
                  <div key={record.id} style={styles.recordCard}>
                    <strong>{record.student || "이름 미입력"}</strong>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
  {record.briefingMonth || record.date} · 프로젝트: {record.project || "미선택"}
</div>
                    <div style={styles.previewBox}>{record.preview}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
               
                      <button style={styles.secondaryBtn} onClick={() => copyText(record.preview, `v-${record.id}`)}>초안 복사</button>
                      <button style={styles.dangerBtn} onClick={() => setRecords((prev) => prev.filter((item) => item.id !== record.id))}>삭제</button>
                    </div>
                  </div>
                ))
              )}
            </section>

           
          </div>
        </div>
      </div>
       </div>   
        </div>   
  );
}
