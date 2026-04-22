import React, { useEffect, useMemo, useState } from "react";

const monthBands = [
  { label: "1~6개월", value: "1~6개월" },
  { label: "7~12개월", value: "7~12개월" },
  { label: "13~18개월", value: "13~18개월" },
  { label: "19~24개월", value: "19~24개월" },
];

const stageKeywords = {
  "1~6개월": ["흥미 탐색", "공간 적응", "표현 시작", "강점 발견", "도구 경험", "짧은 연작 시작"],
  "7~12개월": ["연작 적응", "반복 경험", "디테일 강화", "재료 확장", "문제 해결", "1차 완성 경험"],
  "13~18개월": ["난이도 상승", "실패 경험", "재도전", "자기주도 강화", "대형 작업 준비", "대형 결과물 도전"],
  "19~24개월": ["관계 인식", "상호작용", "역할 수행", "협동 경험", "갈등 조율", "공동 성취"],
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
    완수: ["마무리하기", "완성경험", "결과만들기"],
    조율: ["의견조율", "양보하기", "차이조정"],
    갈등: ["갈등조절", "갈등해결", "사과하기"],
    역할: ["역할수행", "역할분담", "책임맡기"],
    인정: ["인정받기", "피드백수용", "칭찬경험"],
  },
  "12–13세": {
    자기이해: ["강점이해", "약점이해", "상태파악"],
    자기조정: ["방향설정", "방법선택", "자기조절"],
    한계돌파: ["어려움버티기", "기준넘기", "재도전"],
    내적동기: ["의미찾기", "스스로시작", "주도유지"],
    역할정체성: ["역할찾기", "역할수행", "팀기여"],
  },
};

const ageCoreSummaries = {
  "6–7세": "정서적 자기조절 · 규칙 · 안정감",
  "8–11세": "인지적 자기조절 · 사회성 · 과제완수",
  "12–13세": "메타인지 · 자기이해 · 정체성",
};

const projects = ["연작", "100호캔버스", "협동작업"];

const projectKeywords = {
  연작: ["주제지속", "반복탐구", "관찰심화", "표현확장", "몰입", "발전경험"],
  협동작업: ["협력", "역할분담", "의사소통", "조율", "갈등해결", "공동책임"],
  "100호캔버스": ["스케일확장", "공간이해", "계획력", "몰입지속", "도전극복", "자기효능감"],
};

const coreKeywords = {
  자기조절: ["기다리기", "충동 멈추기", "감정 표현하기", "좌절 버티기", "도전 유지하기"],
  활동조절: ["도구 사용 조절", "힘/속도 조절", "반복 연습", "단계 수행", "끝까지 마무리"],
  관계인식: ["차례 지키기", "거리 조절", "방해 인식", "상황 살피기", "기본 배려"],
  상호작용: ["기다렸다 말하기", "요청하기", "도움 요청", "도움 주기", "긍정 피드백"],
  관계조율: ["허락 구하기", "양해 구하기", "의견 표현", "의견 수용", "사과하기", "갈등 해결"],
  협동: ["역할 수행", "역할 분담", "의견 조율", "협력 수행", "도움 주고받기"],
  자아실현: ["자발적 시작", "자발적 지속", "선택하기", "책임지기", "끝까지 완성"],
};

const easyWords = {
  자기조절: "스스로 행동을 조절해보는 힘",
  감정조절: "감정을 다뤄보는 힘",
  충동조절: "하고 싶은 마음을 잠시 멈춰보는 힘",
  지연만족: "기다려보는 경험",
  주의집중: "집중해서 이어가는 힘",
  전환능력: "상황에 맞게 바꿔보는 힘",
  회복탄력성: "어려운 뒤에도 다시 해보는 힘",
  생활자립: "스스로 해보는 생활 습관",
  기본사회성: "친구와 함께 지내는 기본 태도",
  자립: "스스로 결정하고 책임지는 모습",
  정체성: "자신을 알아가는 과정",
  심화경험: "한 가지를 깊이 있게 해보는 경험",
  자기효능감: "할 수 있다고 느끼는 자신감",
};

const defaultForm = {
  student: "",
  date: new Date().toISOString().slice(0, 10),
  months: "1~6개월",
  stage: "흥미 탐색",
  ageBand: "6–7세",
  ageDomain: "감정이해",
  ageSubKeyword: "감정인식",
  project: "연작",
  projectKeyword: "주제지속",
  core: "자기조절",
  action: "기다리기",
  memo: "",
  images: [],
};

const subKeywordMeta = {
  기다리기: { upper: "정서적 자기조절", main: "기다림", meaning: "기다리고 멈춰보는 경험" },
  "충동 멈추기": { upper: "정서적 자기조절", main: "조절", meaning: "하고 싶은 행동을 잠시 멈춰보는 힘" },
  "감정 표현하기": { upper: "정서적 자기조절", main: "표현", meaning: "감정을 바르게 표현해보는 경험" },
  "좌절 버티기": { upper: "정서적 자기조절", main: "회복", meaning: "쉽지 않은 순간을 버텨보는 경험" },
  "도전 유지하기": { upper: "자아효능감", main: "도전", meaning: "어려워도 다시 이어가보는 경험" },
  "도구 사용 조절": { upper: "인지적 자기조절", main: "수행", meaning: "도구를 상황에 맞게 조절하는 힘" },
  "힘/속도 조절": { upper: "인지적 자기조절", main: "조절", meaning: "힘과 속도를 조절하며 과제를 다루는 힘" },
  "반복 연습": { upper: "자아효능감", main: "발전", meaning: "반복 속에서 작은 성공을 쌓는 경험" },
  "단계 수행": { upper: "인지적 자기조절", main: "계획", meaning: "순서에 맞게 과제를 이어가는 힘" },
  "끝까지 마무리": { upper: "자아효능감", main: "완수", meaning: "끝까지 마무리하며 완수 경험을 쌓는 것" },
  "차례 지키기": { upper: "정서적 자기조절", main: "기다림", meaning: "관계 안에서 차례를 받아들이는 경험" },
  "거리 조절": { upper: "사회적효능감", main: "관계", meaning: "관계 안에서 적절한 거리를 맞춰보는 경험" },
  "방해 인식": { upper: "사회적효능감", main: "관계", meaning: "다른 사람에게 미치는 영향을 알아차리는 경험" },
  "상황 살피기": { upper: "사회적효능감", main: "조율", meaning: "주변 상황을 살피며 자신을 맞춰보는 힘" },
  "기본 배려": { upper: "사회적효능감", main: "배려", meaning: "다른 사람을 배려해보는 경험" },
  "기다렸다 말하기": { upper: "사회적효능감", main: "조율", meaning: "자기 차례를 기다렸다가 표현하는 경험" },
  요청하기: { upper: "사회적효능감", main: "표현", meaning: "필요한 것을 관계 안에서 요청해보는 경험" },
  "도움 요청": { upper: "사회적효능감", main: "인정", meaning: "도움이 필요할 때 요청하며 관계를 활용해보는 경험" },
  "도움 주기": { upper: "사회적효능감", main: "협력", meaning: "다른 친구를 도와주며 함께 해보는 경험" },
  "긍정 피드백": { upper: "사회적효능감", main: "인정", meaning: "긍정적으로 반응하며 관계를 따뜻하게 이어가는 경험" },
  "허락 구하기": { upper: "사회적효능감", main: "조율", meaning: "행동 전에 허락을 구하며 관계를 조율하는 경험" },
  "양해 구하기": { upper: "사회적효능감", main: "조율", meaning: "상황에 맞게 양해를 구하며 관계를 이어가는 경험" },
  "의견 표현": { upper: "사회적효능감", main: "표현", meaning: "자기 의견을 관계 안에서 표현해보는 경험" },
  "의견 수용": { upper: "사회적효능감", main: "조율", meaning: "다른 의견을 받아들이며 관계를 조절하는 경험" },
  사과하기: { upper: "사회적효능감", main: "갈등", meaning: "관계 안에서 사과를 통해 갈등을 풀어보는 경험" },
  "갈등 해결": { upper: "사회적효능감", main: "갈등", meaning: "부딪힌 상황을 관계 안에서 풀어보는 경험" },
  "역할 수행": { upper: "사회적효능감", main: "역할", meaning: "팀 안에서 자신의 역할을 해보는 경험" },
  "역할 분담": { upper: "사회적효능감", main: "역할", meaning: "역할을 나누며 공동 목표를 경험하는 과정" },
  "의견 조율": { upper: "사회적효능감", main: "조율", meaning: "서로의 생각을 맞춰가는 경험" },
  "협력 수행": { upper: "사회적효능감", main: "협력", meaning: "함께 결과를 만들어가는 경험" },
  "도움 주고받기": { upper: "사회적효능감", main: "협력", meaning: "도움을 주고받으며 관계 속 효능감을 쌓는 경험" },
  "자발적 시작": { upper: "자아효능감", main: "선택", meaning: "스스로 시작해보는 경험" },
  "자발적 지속": { upper: "자아효능감", main: "지속", meaning: "스스로 이어가보는 힘" },
  선택하기: { upper: "자아효능감", main: "선택", meaning: "자신의 과제를 스스로 선택해보는 경험" },
  책임지기: { upper: "자아효능감", main: "완수", meaning: "선택한 것을 책임지고 이어가는 경험" },
  "끝까지 완성": { upper: "자아효능감", main: "완수", meaning: "완성까지 이어가며 성취를 느끼는 경험" },
};

const projectMeta = {
  연작: { upper: "자아효능감", main: "지속", meaning: "한 가지를 깊이 있게 이어가며 몰입과 발전을 경험하는 프로젝트" },
  협동작업: { upper: "사회적효능감", main: "협력", meaning: "또래와 함께 맞춰가며 관계 속 성취를 경험하는 프로젝트" },
  "100호캔버스": { upper: "자아효능감", main: "도전", meaning: "큰 과제를 다루며 도전과 완수 경험을 쌓는 프로젝트" },
};

const agePriorityMeta = {
  "6–7세": { upper: "정서적 자기조절", focus: "감정과 규칙의 기초", meaning: "감정을 이해하고 바르게 표현하며, 규칙과 기다림, 교사와의 신뢰를 쌓아가는 시기" },
  "8–11세": { upper: "인지적 자기조절", focus: "과제 완수와 사회적 조율", meaning: "과제를 설정하고 계획해 끝까지 해보는 경험과 또래와 조율하는 경험이 중요한 시기" },
  "12–13세": { upper: "메타인지적 조절", focus: "자기이해와 역할 정체성", meaning: "자신의 상태를 이해하고 한계를 넘어보며, 팀 안에서 자신의 역할을 찾아가는 시기" },
};

function deriveInterpretation(form) {
  const pieces = [];
  const actionMeta = subKeywordMeta[form.action];
  if (actionMeta) pieces.push(actionMeta);

  const ageMeta = agePriorityMeta[form.ageBand];
  const projectInfo = projectMeta[form.project];

  if (projectInfo) pieces.push(projectInfo);
  if (ageMeta) pieces.push(ageMeta);

  const upperCount = {};
  const mainCount = {};

  pieces.forEach((piece) => {
    if (piece.upper) upperCount[piece.upper] = (upperCount[piece.upper] || 0) + 1;
    if (piece.main) mainCount[piece.main] = (mainCount[piece.main] || 0) + 1;
  });

  const primaryUpper = Object.entries(upperCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "자아효능감";
  const primaryMain = Object.entries(mainCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "성장";

  return {
    primaryUpper,
    primaryMain,
    ageMeaning: ageMeta?.meaning || "",
    projectMeaning: projectInfo?.meaning || "",
    actionMeaning: actionMeta?.meaning || "",
    summary: `${primaryUpper} 안에서 ${primaryMain}과 연결되는 경험을 중심으로 해석`,
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 45%, #ffffff 100%)",
    color: "#0f172a",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "28px 20px 40px",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: "#ffffff",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },
  darkCard: {
    background: "#0f172a",
    color: "white",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 8px 24px rgba(15,23,42,0.14)",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "#e2e8f0",
    color: "#475569",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 12,
  },
  title: { fontSize: 42, fontWeight: 800, lineHeight: 1.2, margin: 0 },
  subtitle: { marginTop: 14, fontSize: 16, lineHeight: 1.8, color: "#475569" },
  darkItem: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: "14px 16px",
    fontSize: 14,
    lineHeight: 1.7,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    gap: 24,
    alignItems: "start",
  },
  sectionTitle: { fontSize: 30, fontWeight: 800, margin: 0, color: "#0f172a" },
  sectionHint: { marginTop: 6, fontSize: 14, color: "#64748b" },
  cardTopRow: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end", flexWrap: "wrap" },
  miniTag: {
    borderRadius: 999,
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 12px",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 8 },
  block: { marginTop: 20 },
  softBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: 700, color: "#1e293b" },
  hint: { fontSize: 12, color: "#94a3b8" },
  input: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    padding: "14px 16px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    background: "white",
  },
  textarea: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    padding: "14px 16px",
    fontSize: 14,
    minHeight: 130,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    background: "white",
    lineHeight: 1.6,
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  upload: {
    width: "100%",
    borderRadius: 18,
    border: "1.5px dashed #cbd5e1",
    padding: "16px",
    background: "white",
    boxSizing: "border-box",
  },
  imageGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 12 },
  image: { width: "100%", height: 120, objectFit: "cover", borderRadius: 16, border: "1px solid #e2e8f0" },
  buttonRow: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22, paddingTop: 18, borderTop: "1px solid #e2e8f0" },
  primaryBtn: {
    background: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: 18,
    padding: "14px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "white",
    color: "#334155",
    border: "1px solid #cbd5e1",
    borderRadius: 18,
    padding: "14px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  promptBox: {
    marginTop: 16,
    borderRadius: 24,
    background: "#020617",
    color: "#e2e8f0",
    padding: 20,
    fontSize: 13,
    lineHeight: 1.75,
    whiteSpace: "pre-wrap",
    maxHeight: 460,
    overflow: "auto",
  },
  previewBox: {
    marginTop: 16,
    borderRadius: 24,
    background: "#f8fafc",
    color: "#334155",
    padding: 20,
    fontSize: 14,
    lineHeight: 1.95,
    whiteSpace: "pre-wrap",
    border: "1px solid #e2e8f0",
  },
  recordList: { marginTop: 18, display: "flex", flexDirection: "column", gap: 14 },
  recordCard: {
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    padding: 16,
    background: "white",
    boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
  },
  recordMemo: {
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    background: "#f8fafc",
    fontSize: 14,
    color: "#475569",
    lineHeight: 1.7,
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function refineMemo(text) {
  if (!text) return "";
  return text
    .replace(/만드는 중/g, "만들어가는 모습")
    .replace(/작업 중/g, "작업을 이어가는 모습")
    .replace(/구상/g, "구상하는 모습")
    .replace(/스케치/g, "스케치해보는 모습")
    .replace(/이어서/g, "이어")
    .trim();
}

function splitMemo(memo) {
  return memo
    .replace(/\n/g, ",")
    .split(/[,.]/)
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map(refineMemo);
}

function actionSentence(action) {
  const map = {
    기다리기: "기다려보는 모습",
    "충동 멈추기": "하고 싶은 행동을 잠시 멈춰보는 모습",
    "감정 표현하기": "감정을 말이나 행동으로 표현해보는 모습",
    "좌절 버티기": "쉽지 않은 순간에도 버텨보는 모습",
    "도전 유지하기": "어려워도 계속 시도해보는 모습",
    "도구 사용 조절": "도구를 상황에 맞게 조절하는 모습",
    "힘/속도 조절": "힘과 속도를 조절해보는 모습",
    "반복 연습": "같은 과정을 반복해보는 모습",
    "단계 수행": "순서에 맞춰 따라가는 모습",
    "끝까지 마무리": "끝까지 마무리해보는 모습",
    "차례 지키기": "차례를 지켜보는 모습",
    "거리 조절": "친구와의 거리를 조절하는 모습",
    "방해 인식": "다른 사람에게 방해가 될 수 있는 상황을 알아차리는 모습",
    "상황 살피기": "주변 상황을 살펴보는 모습",
    "기본 배려": "기본적인 배려를 보여주는 모습",
    "기다렸다 말하기": "기다렸다가 말해보는 모습",
    요청하기: "필요한 것을 요청해보는 모습",
    "도움 요청": "도움이 필요할 때 요청해보는 모습",
    "도움 주기": "다른 친구를 도와주는 모습",
    "긍정 피드백": "긍정적으로 반응해주는 모습",
    "허락 구하기": "먼저 허락을 구해보는 모습",
    "양해 구하기": "상황에 맞게 양해를 구해보는 모습",
    "의견 표현": "자기 생각을 말해보는 모습",
    "의견 수용": "다른 의견을 받아들이는 모습",
    사과하기: "사과가 필요한 상황에서 표현해보는 모습",
    "갈등 해결": "부딪힌 상황을 풀어보는 경험",
    "역할 수행": "맡은 역할을 해보는 모습",
    "역할 분담": "역할을 나누어 맡아보는 경험",
    "의견 조율": "의견을 맞춰보는 모습",
    "협력 수행": "함께 결과를 만들어가는 모습",
    "도움 주고받기": "서로 도움을 주고받는 모습",
    "자발적 시작": "스스로 시작해보는 모습",
    "자발적 지속": "스스로 이어가려는 모습",
    선택하기: "스스로 선택해보는 모습",
    책임지기: "선택한 것을 책임지려는 모습",
    "끝까지 완성": "끝까지 완성해보는 모습",
  };
  return map[action] || action;
}

function titleFor(form) {
  const byProject = {
    연작: [
      "끝까지 이어가는 힘이 보인 연작",
      "한 가지를 깊이 있게 이어간 연작",
      "스스로 발전시켜가는 흐름이 보인 연작",
    ],
    협동작업: [
      "함께 맞춰가며 완성한 협동작업",
      "친구와 함께 해보는 경험이 보인 협동작업",
      "관계 속에서 배워간 협동작업",
    ],
    "100호캔버스": [
      "도전하며 완성해가는 100호캔버스",
      "크게 시도해보는 경험이 보인 100호캔버스",
      "몰입과 도전이 함께한 100호캔버스",
    ],
  };
  return pick(byProject[form.project] || ["오늘의 성장 브리핑"]);
}

function meaningFor(form) {
  const stageEasy = easyWords[form.ageSubKeyword] || form.ageSubKeyword;
  const ageLine = {
    "6–7세": "이 시기에는 규칙과 기다림을 자연스럽게 연습해가는 과정이 중요합니다.",
    "8–10세": "이 시기에는 스스로 해보는 과정에서 시행착오를 겪으며 배우는 경험이 중요합니다.",
    "11–13세": "이 시기에는 자기 생각이 분명해지는 만큼 선택과 관계를 함께 배워가는 경험이 중요합니다.",
  }[form.ageBand];

  const projectLine = {
    연작: "연작은 한 가지를 이어가며 몰입과 발전 경험을 쌓는 데 의미가 있습니다.",
    협동작업: "협동작업은 또래와 함께 맞춰가며 관계 속 경험을 배우는 데 의미가 있습니다.",
    "100호캔버스": "100호캔버스는 크게 시도하고 끝까지 이어가며 도전 경험을 쌓는 데 의미가 있습니다.",
  }[form.project];

  return `${form.stage} 단계 안에서 ${stageEasy}과 연결되는 모습이 조금씩 쌓이고 있다는 점이 의미 있었습니다. ${projectLine} ${ageLine}`;
}

function nextPlanFor(form) {
  const projectPlan = {
    연작: "다음 시간에는 오늘 이어간 흐름을 바탕으로 주제를 더 깊이 발전시켜볼 수 있도록 도울 예정입니다.",
    협동작업: "다음 시간에는 함께 맞춰가는 경험이 자연스럽게 이어질 수 있도록 역할과 관계 흐름을 더 살펴볼 예정입니다.",
    "100호캔버스": "다음 시간에는 크게 시도하는 과정 안에서 스스로 계획하고 이어가는 힘이 더 드러날 수 있도록 도울 예정입니다.",
  };
  return projectPlan[form.project] || "다음 시간에도 오늘의 흐름을 이어가며 성장의 경험을 쌓을 수 있도록 도울 예정입니다.";
}

function imagePlanLine(imageCount) {
  if (imageCount >= 4) {
    return "첨부된 작품 흐름을 함께 보면, 아이가 시도하고 수정하며 조금씩 발전시켜가는 과정까지 더 분명하게 살펴볼 수 있었습니다.";
  }
  if (imageCount > 0) {
    return "첨부된 작품 사진을 바탕으로 오늘의 시도와 결과를 함께 살펴볼 수 있었습니다.";
  }
  return "";
}

function generatePrompt(form) {
  const interpreted = deriveInterpretation(form);

  return `너는 자라다교육의 남아 전문 상담 교사다.
입력된 정보를 바탕으로 학부모에게 전달할 상담 브리핑을 작성하라.

[브리핑의 최상위 목표]
- 브리핑은 아이의 성장에 초점을 맞춘다.
- 성장의 방향은 자립이며, 건강한 자립의 기반은 자존감이다.
- 자존감은 아이가 스스로 해낼 수 있다는 자아효능감과, 관계 속에서 인정받고 소속될 수 있다는 사회적효능감의 경험을 통해 자란다.
- 오늘 수업의 장면을 단순히 설명하지 말고, 그 경험이 아이의 자립과 자존감 형성에 어떤 의미가 있는지 해석해 전달하라.

[핵심 해석 원칙]
1. 선택된 키워드를 그대로 나열하지 말고, 그 의미를 학부모가 이해하기 쉬운 말로 자연스럽게 풀어 써라.
2. 키워드는 반드시 브리핑 안에 반영하되, 키워드가 보이게 쓰기보다 해석이 살아있게 써라.
3. 같은 키워드 조합이어도 문장 구조와 표현을 매번 다르게 구성해 여러 교사가 사용해도 브리핑이 겹치지 않게 하라.
4. 브리핑의 중심 해석은 1~2개만 선명하게 잡고, 나머지는 배경 흐름으로 자연스럽게 녹여라.
5. 메모가 짧더라도 그대로 옮기지 말고, 수업 장면 → 교육적 의미 → 성장 해석 → 다음 시간 계획의 흐름으로 재구성하라.
6. 평가가 아니라 관찰 중심으로 쓰고, 과장하지 말고 신뢰감 있게 작성하라.
7. 어려운 교육 용어는 학부모가 이해하기 쉬운 일상 언어로 바꿔라.
8. 문장은 짧고 선명하게 쓰되, 내용은 얕지 않게 하라.
9. 같은 표현, 같은 문장 구조, 같은 어휘를 반복하지 말고 다양한 표현군을 사용하라.
10. 첨부된 작품 사진이 있는 경우, 결과만이 아니라 과정의 흐름과 변화도 함께 해석하라.

[해석 우선순위]
- 모든 브리핑은 반드시 다음 순서로 해석한다.
1. 연령대
2. 재원기간
3. 프로젝트
4. 행동 키워드 및 관찰 메모

[출력 형식]
- 제목 1줄
- 본문 5~7문장
- 학부모가 바로 읽어도 이해되는 자연스러운 문단
- 마지막 문장은 다음 시간 계획으로 마무리
- '어머님, 안녕하세요.'로 시작

[입력값]
- 학생명: ${form.student}
- 재원기간: ${form.months}
- 재원기간별 키워드: ${form.stage}
- 연령대: ${form.ageBand}
- 발달 영역: ${form.ageDomain}
- 세부 발달 키워드: ${form.ageSubKeyword}
- 프로젝트: ${form.project}
- 프로젝트 키워드: ${form.projectKeyword}
- 사회성훈련: ${form.core}
- 행동 키워드: ${form.action}
- 관찰 메모: ${form.memo}
- 첨부 이미지 수: ${form.images.length}장

[자동 해석 결과]
- 중심 상위개념: ${interpreted.primaryUpper}
- 중심 메인키워드: ${interpreted.primaryMain}
- 연령 해석: ${interpreted.ageMeaning}
- 프로젝트 해석: ${interpreted.projectMeaning}
- 행동 해석: ${interpreted.actionMeaning}
- 브리핑 중심 요약: ${interpreted.summary}

위 기준을 모두 반영하여, 학부모에게 바로 전달 가능한 자라다식 전문 브리핑을 작성하라.`;
}

function generatePreview(form) {
  if (!form.memo.trim()) return "관찰 메모를 입력하면 브리핑 초안이 여기에 표시됩니다.";

  const interpreted = deriveInterpretation(form);
  const memoParts = splitMemo(form.memo);
  const title = titleFor(form);
  const greeting = "어머님, 안녕하세요. 오늘 수업 내용을 공유드립니다.";

  const projectLine = `${form.project} 활동 안에서 ${form.projectKeyword}와 관련된 흐름이 이어졌고, ${actionSentence(form.action)} 장면이 자연스럽게 드러났습니다.`;

  let observationLine = "";
  if (memoParts.length >= 2) {
    observationLine = `${memoParts[0]}이 보였고, 이어 ${memoParts[1]} 흐름으로 자연스럽게 연결되었습니다. 짧은 장면 안에서도 아이가 다음 과정으로 스스로 이어가려는 의도가 드러났습니다.`;
  } else if (memoParts.length === 1) {
    observationLine = `${memoParts[0]}이 특히 인상적이었고, 그 안에서 아이가 자신의 방식으로 계속 시도해보는 모습이 보였습니다. 메모는 짧지만 오늘 수업의 중심 장면이 분명하게 드러난 순간이었습니다.`;
  }

  const meaningLine = `${interpreted.projectMeaning} ${interpreted.ageMeaning} 오늘 수업에서는 특히 ${interpreted.actionMeaning}과 연결된 흐름이 중심적으로 드러났습니다.`;
  const interpretationLine = `이번 경험은 ${interpreted.primaryUpper} 안에서 ${interpreted.primaryMain}과 연결되는 장면으로 해석할 수 있으며, 아이가 지금 시기에 필요한 성장 과제를 실제 수업 안에서 경험해본 시간이었다는 점에서 의미가 있었습니다.`;
  const imageLine = imagePlanLine(form.images.length);
  const nextLine = nextPlanFor(form);

  return `"${title}"

${greeting}

${projectLine}
${observationLine}
${meaningLine}
${interpretationLine}
${imageLine}
${nextLine}`;
}

function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={styles.labelRow}>
        <div style={styles.label}>{label}</div>
        {hint ? <div style={styles.hint}>{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 999,
        border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
        background: active ? "#0f172a" : "#ffffff",
        color: active ? "#ffffff" : "#334155",
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

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [records, setRecords] = useState([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("jarada-briefing-records-inline-v1");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("jarada-briefing-records-inline-v1", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    const list = stageKeywords[form.months] || [];
    if (!list.includes(form.stage)) {
      setForm((prev) => ({ ...prev, stage: list[0] || "" }));
    }
  }, [form.months]);

  useEffect(() => {
    const domains = Object.keys(ageDomains[form.ageBand] || {});
    if (!domains.includes(form.ageDomain)) {
      const nextDomain = domains[0] || "";
      const nextSub = ageDomains[form.ageBand]?.[nextDomain]?.[0] || "";
      setForm((prev) => ({ ...prev, ageDomain: nextDomain, ageSubKeyword: nextSub }));
      return;
    }
    const subs = ageDomains[form.ageBand]?.[form.ageDomain] || [];
    if (!subs.includes(form.ageSubKeyword)) {
      setForm((prev) => ({ ...prev, ageSubKeyword: subs[0] || "" }));
    }
  }, [form.ageBand, form.ageDomain]);

  useEffect(() => {
    const list = projectKeywords[form.project] || [];
    if (!list.includes(form.projectKeyword)) {
      setForm((prev) => ({ ...prev, projectKeyword: list[0] || "" }));
    }
  }, [form.project]);

  useEffect(() => {
    const list = coreKeywords[form.core] || [];
    if (!list.includes(form.action)) {
      setForm((prev) => ({ ...prev, action: list[0] || "" }));
    }
  }, [form.core]);

  const prompt = useMemo(() => generatePrompt(form), [form]);
  const preview = useMemo(() => generatePreview(form), [form]);

  const copyText = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const saveRecord = () => {
    if (!form.memo.trim()) {
      alert("관찰 메모를 입력해 주세요.");
      return;
    }
    const item = {
      id: crypto.randomUUID(),
      ...form,
      prompt,
      preview,
    };
    setRecords((prev) => [item, ...prev]);
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const readers = files.slice(0, 8).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((results) => {
      setForm((prev) => ({ ...prev, images: results }));
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topGrid}>
          <div style={styles.card}>
            <div style={styles.badge}>자라다 브리핑 MVP</div>
            <h1 style={styles.title}>교사용 브리핑 입력 + 프롬프트 생성기</h1>
            <p style={styles.subtitle}>재원기간별, 연령별, 프로젝트별 키워드를 중심으로 교육적 의미와 다음 시간 계획까지 담긴 브리핑 초안을 만들 수 있습니다.</p>
          </div>
          <div style={styles.darkCard}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#cbd5e1", marginBottom: 14 }}>작성 기준</div>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={styles.darkItem}>어려운 용어는 학부모가 이해하기 쉬운 말로 바꿔 설명합니다.</div>
              <div style={styles.darkItem}>평가보다 관찰 중심으로, 짧은 메모도 자연스럽게 해석합니다.</div>
              <div style={styles.darkItem}>오늘의 장면과 교육적 의미, 다음 시간 계획까지 함께 담습니다.</div>
            </div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div>
            <section style={styles.card}>
              <div style={styles.cardTopRow}>
                <div>
                  <h2 style={styles.sectionTitle}>브리핑 입력</h2>
                  <div style={styles.sectionHint}>선택과 짧은 메모만 입력하면, 오른쪽에서 바로 결과를 확인할 수 있습니다.</div>
                </div>
                <div style={styles.miniTag}>빠른 입력</div>
              </div>

              <div style={styles.grid2}>
                <Field label="학생명">
                  <input
                    value={form.student}
                    onChange={(e) => setForm((prev) => ({ ...prev, student: e.target.value }))}
                    placeholder="예: 최민준"
                    style={styles.input}
                  />
                </Field>
                <Field label="날짜">
                  <input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} style={styles.input} />
                </Field>
              </div>

              <div style={styles.softBox}>
                <div style={{ ...styles.label, marginBottom: 10 }}>연령 / 발달 기준</div>
                <div style={styles.grid3}>
                  <Field label="연령대" hint="연령별 핵심 과제를 먼저 선택합니다">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                      {ageBands.map((band) => {
                        const active = form.ageBand === band;
                        return (
                          <button
                            key={band}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, ageBand: band }))}
                            style={{
                              textAlign: "left",
                              borderRadius: 18,
                              border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
                              background: active ? "#0f172a" : "#ffffff",
                              color: active ? "#ffffff" : "#0f172a",
                              padding: "14px 16px",
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ fontSize: 15, fontWeight: 800 }}>{band}</div>
                            <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.6, color: active ? "#cbd5e1" : "#64748b" }}>
                              {ageCoreSummaries[band]}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="발달 영역">
                    <div style={styles.chips}>
                      {Object.keys(ageDomains[form.ageBand] || {}).map((domain) => (
                        <Chip
                          key={domain}
                          active={form.ageDomain === domain}
                          onClick={() => setForm((prev) => ({ ...prev, ageDomain: domain, ageSubKeyword: ageDomains[form.ageBand][domain][0] }))}
                        >
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="세부 발달 키워드">
                    <div style={styles.chips}>
                      {(ageDomains[form.ageBand]?.[form.ageDomain] || []).map((sub) => (
                        <Chip key={sub} active={form.ageSubKeyword === sub} onClick={() => setForm((prev) => ({ ...prev, ageSubKeyword: sub }))}>
                          {sub}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.block}>
                  <Field label="프로젝트">
                    <div style={styles.chips}>
                      {projects.map((project) => (
                        <Chip key={project} active={form.project === project} onClick={() => setForm((prev) => ({ ...prev, project }))}>
                          {project}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
                <div style={styles.block}>
                  <Field label="프로젝트 키워드">
                    <div style={styles.chips}>
                      {(projectKeywords[form.project] || []).map((keyword) => (
                        <Chip key={keyword} active={form.projectKeyword === keyword} onClick={() => setForm((prev) => ({ ...prev, projectKeyword: keyword }))}>
                          {keyword}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.block}>
                  <Field label="재원기간">
                    <div style={styles.chips}>
                      {monthBands.map((band) => (
                        <Chip key={band.value} active={form.months === band.value} onClick={() => setForm((prev) => ({ ...prev, months: band.value }))}>
                          {band.label}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
                <div style={styles.block}>
                  <Field label="재원기간별 키워드">
                    <div style={styles.chips}>
                      {(stageKeywords[form.months] || []).map((stage) => (
                        <Chip key={stage} active={form.stage === stage} onClick={() => setForm((prev) => ({ ...prev, stage }))}>
                          {stage}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.block}>
                  <Field label="사회성훈련">
                    <div style={styles.chips}>
                      {Object.keys(coreKeywords).map((core) => (
                        <Chip key={core} active={form.core === core} onClick={() => setForm((prev) => ({ ...prev, core, action: coreKeywords[core][0] }))}>
                          {core}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
                <div style={styles.block}>
                  <Field label="행동 키워드">
                    <div style={styles.chips}>
                      {(coreKeywords[form.core] || []).map((action) => (
                        <Chip key={action} active={form.action === action} onClick={() => setForm((prev) => ({ ...prev, action }))}>
                          {action}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div style={styles.block}>
                <Field label="작품 사진 첨부" hint="최소 4장 권장">
                  <input type="file" accept="image/*" multiple onChange={onImageChange} style={styles.upload} />
                  {form.images.length > 0 && (
                    <div style={styles.imageGrid}>
                      {form.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`preview-${idx}`} style={styles.image} />
                      ))}
                    </div>
                  )}
                </Field>
              </div>

              <div style={styles.block}>
                <Field label="관찰 메모">
                  <textarea
                    value={form.memo}
                    onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
                    placeholder="예: 도라에몽 다리 만드는 중, 다음 시간 아이디어 스케치 구상"
                    style={styles.textarea}
                  />
                </Field>
              </div>

              <div style={styles.buttonRow}>
                <button onClick={saveRecord} style={styles.primaryBtn}>기록 저장</button>
                <button onClick={() => copyText(prompt, "prompt")} style={styles.secondaryBtn}>
                  {copied === "prompt" ? "프롬프트 복사됨" : "프롬프트 복사"}
                </button>
                <button onClick={() => copyText(preview, "preview")} style={styles.secondaryBtn}>
                  {copied === "preview" ? "초안 복사됨" : "브리핑 초안 복사"}
                </button>
              </div>
            </section>

            <section style={{ ...styles.card, marginTop: 24 }}>
              <div style={styles.cardTopRow}>
                <div>
                  <h2 style={styles.sectionTitle}>GPT 프롬프트</h2>
                  <div style={styles.sectionHint}>그대로 복사해 GPT에 붙여넣을 수 있는 버전입니다.</div>
                </div>
                <div style={styles.miniTag}>복사해서 사용</div>
              </div>
              <div style={styles.promptBox}>{prompt}</div>
            </section>

            <section style={{ ...styles.card, marginTop: 24 }}>
              <div style={styles.cardTopRow}>
                <div>
                  <h2 style={styles.sectionTitle}>브리핑 초안 미리보기</h2>
                  <div style={styles.sectionHint}>학부모에게 전달하기 전 문장 흐름을 바로 확인할 수 있습니다.</div>
                </div>
                <div style={styles.miniTag}>실시간</div>
              </div>
              <div style={styles.previewBox}>{preview}</div>
            </section>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTopRow}>
              <div>
                <h2 style={styles.sectionTitle}>저장된 기록</h2>
                <div style={styles.sectionHint}>최근 저장된 브리핑을 바로 다시 복사할 수 있습니다.</div>
              </div>
              <div style={styles.miniTag}>최근순</div>
            </div>

            <div style={styles.recordList}>
              {records.length === 0 ? (
                <div style={{ ...styles.recordCard, textAlign: "center", color: "#64748b" }}>저장된 기록이 없습니다.</div>
              ) : (
                records.map((item) => (
                  <div key={item.id} style={styles.recordCard}>
                    <div style={{ fontWeight: 700 }}>{item.student || "이름 미입력"}</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>{item.date} · {item.project} · {item.stage}</div>
                    <div style={styles.recordMemo}>{item.memo}</div>
                    <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>첨부 사진 {item.images?.length || 0}장</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                      <button onClick={() => copyText(item.prompt, `p-${item.id}`)} style={styles.secondaryBtn}>
                        {copied === `p-${item.id}` ? "복사됨" : "프롬프트 복사"}
                      </button>
                      <button onClick={() => copyText(item.preview, `v-${item.id}`)} style={styles.secondaryBtn}>
                        {copied === `v-${item.id}` ? "복사됨" : "초안 복사"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
