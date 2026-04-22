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

const defaultForm = {
  student: "",
  date: new Date().toISOString().slice(0, 10),
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
  images: [],
};

const subKeywordMeta = {
  감정인식: { upper: "정서적 자기조절", main: "감정이해", meaning: "자신의 감정을 알아차려보는 경험" },
  감정표현: { upper: "정서적 자기조절", main: "감정이해", meaning: "감정을 바르게 표현해보는 경험" },
  감정말하기: { upper: "정서적 자기조절", main: "감정이해", meaning: "감정을 말로 꺼내보는 경험" },
  멈추기: { upper: "정서적 자기조절", main: "충동조절", meaning: "하고 싶은 행동을 잠시 멈춰보는 힘" },
  기다리기: { upper: "정서적 자기조절", main: "충동조절", meaning: "기다리고 순서를 받아들이는 경험" },
  차례지키기: { upper: "정서적 자기조절", main: "관계인식", meaning: "관계 안에서 자신의 차례를 지켜보는 경험" },
  규칙이해: { upper: "정서적 자기조절", main: "규칙", meaning: "교실 안의 약속을 이해해보는 과정" },
  순서지키기: { upper: "정서적 자기조절", main: "규칙", meaning: "순서와 흐름을 따라가보는 경험" },
  교실규칙: { upper: "정서적 자기조절", main: "규칙", meaning: "교실 안의 규칙을 지켜보는 경험" },
  분리안정: { upper: "정서적 자기조절", main: "안정감", meaning: "부모와 떨어진 상황에서도 안정감을 유지하는 경험" },
  교사신뢰: { upper: "정서적 자기조절", main: "안정감", meaning: "교사와의 관계 안에서 신뢰를 쌓아가는 경험" },
  환경안정: { upper: "정서적 자기조절", main: "안정감", meaning: "낯선 환경 안에서도 편안함을 느껴보는 경험" },

  목표정하기: { upper: "인지적 자기조절", main: "과제설정", meaning: "스스로 과제의 목표를 잡아보는 경험" },
  시작하기: { upper: "자아효능감", main: "과제설정", meaning: "망설임보다 먼저 시작해보는 경험" },
  선택하기: { upper: "자아효능감", main: "선택", meaning: "자신의 과제를 스스로 선택해보는 경험" },
  단계나누기: { upper: "인지적 자기조절", main: "계획", meaning: "과정을 단계로 나눠 생각해보는 힘" },
  순서생각: { upper: "인지적 자기조절", main: "계획", meaning: "작업 순서를 먼저 떠올려보는 힘" },
  방법정리: { upper: "인지적 자기조절", main: "계획", meaning: "어떻게 할지 방법을 정리해보는 힘" },
  단계수행: { upper: "인지적 자기조절", main: "수행", meaning: "단계에 맞춰 과제를 이어가는 힘" },
  반복연습: { upper: "자아효능감", main: "발전", meaning: "반복 속에서 작은 성공을 쌓는 경험" },
  도구사용: { upper: "인지적 자기조절", main: "수행", meaning: "도구를 조절하며 과제를 다뤄보는 경험" },
  과제지속: { upper: "인지적 자기조절", main: "지속", meaning: "쉽지 않은 과제를 포기하지 않고 이어가는 힘" },
  몰입유지: { upper: "자아효능감", main: "지속", meaning: "한 가지 흐름을 오래 붙잡아보는 경험" },
  끝까지하기: { upper: "자아효능감", main: "완수", meaning: "끝까지 해보며 완수 감각을 쌓는 경험" },
  마무리하기: { upper: "자아효능감", main: "완수", meaning: "마무리까지 책임져보는 경험" },
  완성경험: { upper: "자아효능감", main: "완수", meaning: "결과를 완성해보며 성취를 느끼는 경험" },
  결과만들기: { upper: "자아효능감", main: "완수", meaning: "결과물로 이어지게 만들어보는 경험" },

  의견조율: { upper: "사회적효능감", main: "조율", meaning: "서로의 생각을 맞춰가는 경험" },
  양보하기: { upper: "사회적효능감", main: "조율", meaning: "자신의 입장만 고집하지 않고 물러나보는 경험" },
  차이조정: { upper: "사회적효능감", main: "조율", meaning: "차이를 관계 안에서 조정해보는 경험" },
  갈등조절: { upper: "사회적효능감", main: "갈등", meaning: "부딪히는 상황에서 감정을 다뤄보는 경험" },
  갈등해결: { upper: "사회적효능감", main: "갈등", meaning: "갈등 상황을 관계 안에서 풀어보는 경험" },
  사과하기: { upper: "사회적효능감", main: "갈등", meaning: "사과를 통해 관계를 다시 이어보는 경험" },
  역할수행: { upper: "사회적효능감", main: "역할", meaning: "관계 안에서 자신의 역할을 맡아보는 경험" },
  역할분담: { upper: "사회적효능감", main: "역할", meaning: "역할을 나누며 공동 목표를 경험하는 과정" },
  책임맡기: { upper: "사회적효능감", main: "역할", meaning: "맡은 책임을 감당해보는 경험" },
  인정받기: { upper: "사회적효능감", main: "인정", meaning: "타인에게 인정받는 경험" },
  피드백수용: { upper: "사회적효능감", main: "인정", meaning: "피드백을 받아들이며 발전하는 경험" },
  칭찬경험: { upper: "사회적효능감", main: "인정", meaning: "칭찬을 통해 자신감을 쌓는 경험" },

  거리조절: { upper: "사회적효능감", main: "관계인식", meaning: "관계 안에서 거리를 조절해보는 경험" },
  방해인식: { upper: "사회적효능감", main: "관계인식", meaning: "다른 사람에게 미치는 영향을 알아차리는 경험" },
  상황살피기: { upper: "사회적효능감", main: "관계인식", meaning: "주변 흐름을 살펴보며 자신을 맞춰보는 힘" },
  기본배려: { upper: "사회적효능감", main: "관계인식", meaning: "기본적인 배려를 실천해보는 경험" },

  요청하기: { upper: "사회적효능감", main: "상호작용", meaning: "필요한 것을 관계 안에서 요청해보는 경험" },
  도움요청: { upper: "사회적효능감", main: "상호작용", meaning: "도움이 필요할 때 관계를 활용해보는 경험" },
  도움주기: { upper: "사회적효능감", main: "상호작용", meaning: "다른 친구를 도우며 함께 해보는 경험" },
  의견표현: { upper: "사회적효능감", main: "상호작용", meaning: "자기 생각을 관계 안에서 표현해보는 경험" },
  기다렸다말하기: { upper: "사회적효능감", main: "상호작용", meaning: "기다렸다가 말하며 흐름을 지켜보는 경험" },

  양해구하기: { upper: "사회적효능감", main: "관계조율", meaning: "상황에 맞게 양해를 구하며 관계를 이어가는 경험" },
  의견수용: { upper: "사회적효능감", main: "관계조율", meaning: "다른 의견을 받아들이며 관계를 조절하는 경험" },

  협력수행: { upper: "사회적효능감", main: "협동", meaning: "함께 결과를 만들어가는 경험" },
  도움주고받기: { upper: "사회적효능감", main: "협동", meaning: "서로 도움을 주고받으며 관계 속 효능감을 쌓는 경험" },
  공동성취: { upper: "사회적효능감", main: "협동", meaning: "함께 해내며 공동 성취를 느끼는 경험" },

  자발적시작: { upper: "자아효능감", main: "자기주도", meaning: "스스로 시작해보는 경험" },
  자발적지속: { upper: "자아효능감", main: "자기주도", meaning: "스스로 이어가보는 힘" },
  책임지기: { upper: "자아효능감", main: "완수", meaning: "선택한 것을 책임지고 이어가는 경험" },
  끝까지완성: { upper: "자아효능감", main: "완수", meaning: "완성까지 이어가며 성취를 느끼는 경험" },

  강점이해: { upper: "메타인지적 조절", main: "자기이해", meaning: "자신의 강점을 이해해보는 경험" },
  약점이해: { upper: "메타인지적 조절", main: "자기이해", meaning: "자신의 약점을 객관적으로 바라보는 경험" },
  상태파악: { upper: "메타인지적 조절", main: "자기이해", meaning: "자신의 상태를 스스로 알아차리는 경험" },
  방향설정: { upper: "메타인지적 조절", main: "자기조정", meaning: "자신에게 맞는 방향을 잡아보는 경험" },
  방법선택: { upper: "메타인지적 조절", main: "자기조정", meaning: "자신에게 맞는 방법을 골라보는 경험" },
  자기조절: { upper: "메타인지적 조절", main: "자기조정", meaning: "자신의 상태에 맞게 스스로 조절해보는 경험" },
  어려움버티기: { upper: "메타인지적 조절", main: "한계돌파", meaning: "불편함과 어려움을 견디며 가보는 경험" },
  기준넘기: { upper: "메타인지적 조절", main: "한계돌파", meaning: "이전 기준을 넘어보는 경험" },
  재도전: { upper: "자아효능감", main: "도전", meaning: "실패 뒤에도 다시 시도해보는 경험" },
  의미찾기: { upper: "메타인지적 조절", main: "내적동기", meaning: "스스로 의미를 찾아보는 경험" },
  스스로시작: { upper: "메타인지적 조절", main: "내적동기", meaning: "시켜서가 아니라 스스로 시작해보는 경험" },
  주도유지: { upper: "메타인지적 조절", main: "내적동기", meaning: "자기 흐름을 계속 유지해보는 경험" },
  역할찾기: { upper: "메타인지적 조절", main: "역할정체성", meaning: "팀 안에서 자신의 역할을 찾아가는 경험" },
  팀기여: { upper: "메타인지적 조절", main: "역할정체성", meaning: "자신의 역할로 팀에 기여해보는 경험" },

  주제지속: { upper: "자아효능감", main: "지속", meaning: "한 가지 주제를 이어가며 깊이를 쌓는 경험" },
  반복탐구: { upper: "자아효능감", main: "발전", meaning: "반복하며 스스로 탐구 범위를 넓혀가는 경험" },
  관찰심화: { upper: "자아효능감", main: "몰입", meaning: "관찰을 깊게 이어가며 작업에 몰입하는 경험" },
  표현확장: { upper: "자아효능감", main: "발전", meaning: "표현 방식을 넓혀보는 경험" },
  몰입경험: { upper: "자아효능감", main: "몰입", meaning: "작업 흐름에 깊게 빠져보는 경험" },
  발전흐름: { upper: "자아효능감", main: "발전", meaning: "반복 속에서 발전을 확인하는 경험" },

  스케일확장: { upper: "자아효능감", main: "도전", meaning: "큰 규모의 작업에 도전해보는 경험" },
  공간이해: { upper: "인지적 자기조절", main: "계획", meaning: "작업 공간을 넓게 이해하며 구성해보는 경험" },
  계획구성: { upper: "인지적 자기조절", main: "계획", meaning: "큰 작업을 계획적으로 구성하는 경험" },
  몰입지속: { upper: "자아효능감", main: "지속", meaning: "큰 작업 안에서도 몰입을 이어가는 경험" },
  도전극복: { upper: "자아효능감", main: "도전", meaning: "어려운 과정을 버티며 넘어서는 경험" },
  완수경험: { upper: "자아효능감", main: "완수", meaning: "완수까지 이어가며 해냈다는 감각을 쌓는 경험" },

  협력경험: { upper: "사회적효능감", main: "협력", meaning: "또래와 함께 맞춰가며 작업하는 경험" },
  의사소통: { upper: "사회적효능감", main: "상호작용", meaning: "작업 과정에서 말과 반응을 주고받는 경험" },
  관계조율: { upper: "사회적효능감", main: "조율", meaning: "관계 안에서 흐름을 맞춰가는 경험" },
};

const agePriorityMeta = {
  "6–7세": {
    upper: "정서적 자기조절",
    focus: "감정과 규칙의 기초",
    meaning: "감정을 이해하고 바르게 표현하며, 규칙과 기다림, 교사와의 신뢰를 쌓아가는 시기",
  },
  "8–11세": {
    upper: "인지적 자기조절",
    focus: "과제 완수와 사회적 조율",
    meaning: "과제를 설정하고 계획해 끝까지 해보는 경험과 또래와 조율하는 경험이 중요한 시기",
  },
  "12–13세": {
    upper: "메타인지적 조절",
    focus: "자기이해와 역할 정체성",
    meaning: "자신의 상태를 이해하고 한계를 넘어보며, 팀 안에서 자신의 역할을 찾아가는 시기",
  },
};

const projectMeta = {
  연작: { upper: "자아효능감", main: "지속", meaning: "한 가지를 깊이 있게 이어가며 몰입과 발전을 경험하는 프로젝트" },
  협동작업: { upper: "사회적효능감", main: "협력", meaning: "또래와 함께 맞춰가며 관계 속 성취를 경험하는 프로젝트" },
  "100호캔버스": { upper: "자아효능감", main: "도전", meaning: "큰 과제를 다루며 도전과 완수 경험을 쌓는 프로젝트" },
};

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
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  miniTag: {
    borderRadius: 999,
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 12px",
  },
  miniButton: {
    borderRadius: 999,
    background: "#e2e8f0",
    color: "#334155",
    fontSize: 12,
    fontWeight: 700,
    padding: "9px 14px",
    border: "1px solid #cbd5e1",
    cursor: "pointer",
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
  dangerBtn: {
    background: "white",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 18,
    padding: "12px 16px",
    fontSize: 13,
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
  recordSearch: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    padding: "12px 14px",
    fontSize: 14,
    boxSizing: "border-box",
    marginTop: 14,
    marginBottom: 8,
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
    .replace(/\s+/g, " ")
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

function imagePlanLine(imageCount) {
  if (imageCount >= 4) {
    return "첨부된 작품 흐름을 함께 보면, 아이가 시도하고 수정하며 조금씩 발전시켜가는 과정까지 더 분명하게 살펴볼 수 있었습니다.";
  }
  if (imageCount > 0) {
    return "첨부된 작품 사진을 바탕으로 오늘의 시도와 결과를 함께 살펴볼 수 있었습니다.";
  }
  return "";
}

function nextPlanFor(form) {
  const map = {
    연작: "다음 시간에는 오늘 이어간 흐름을 바탕으로 주제를 더 깊이 발전시켜볼 수 있도록 도울 예정입니다.",
    협동작업: "다음 시간에는 함께 맞춰가는 경험이 자연스럽게 이어질 수 있도록 역할과 관계 흐름을 더 살펴볼 예정입니다.",
    "100호캔버스":
      "다음 시간에는 크게 시도하는 과정 안에서 스스로 계획하고 이어가는 힘이 더 드러날 수 있도록 도울 예정입니다.",
  };

  return map[form.project] || "다음 시간에도 오늘의 흐름을 이어가며 성장의 경험을 쌓을 수 있도록 도울 예정입니다.";
}

function deriveInterpretation(form) {
  const pieces = [];

  const ageMeta = agePriorityMeta[form.ageBand];
  const projectInfo = projectMeta[form.project];

  if (ageMeta) pieces.push(ageMeta);
  if (projectInfo) pieces.push(projectInfo);

  form.ageSubKeywords.forEach((k) => {
    if (subKeywordMeta[k]) pieces.push(subKeywordMeta[k]);
  });

  form.projectKeywordsSelected.forEach((k) => {
    if (subKeywordMeta[k]) pieces.push(subKeywordMeta[k]);
  });

  form.socialKeywordsSelected.forEach((k) => {
    if (subKeywordMeta[k]) pieces.push(subKeywordMeta[k]);
  });

  const upperCount = {};
  const mainCount = {};

  pieces.forEach((piece) => {
    if (piece.upper) upperCount[piece.upper] = (upperCount[piece.upper] || 0) + 1;
    if (piece.main) mainCount[piece.main] = (mainCount[piece.main] || 0) + 1;
  });

  const primaryUpper = Object.entries(upperCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "자아효능감";
  const primaryMain = Object.entries(mainCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "성장";

  const uniqueMeanings = Array.from(
    new Set(
      pieces
        .map((p) => p.meaning)
        .filter(Boolean)
        .slice(0, 5)
    )
  );

  return {
    primaryUpper,
    primaryMain,
    ageMeaning: ageMeta?.meaning || "",
    projectMeaning: projectInfo?.meaning || "",
    keyMeanings: uniqueMeanings,
    summary: `${primaryUpper} 안에서 ${primaryMain}과 연결되는 경험을 중심으로 해석`,
  };
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
2. 키워드는 반드시 브리핑 안에 반영하되, 키워드가 드러나기보다 해석이 자연스럽게 살아있게 써라.
3. 같은 키워드 조합이어도 문장 구조와 표현을 매번 다르게 구성해 여러 교사가 사용해도 브리핑이 겹치지 않게 하라.
4. 브리핑의 중심 해석은 1~2개만 선명하게 잡고, 나머지는 배경 흐름으로 자연스럽게 녹여라.
5. 짧은 관찰 메모라도 그대로 옮기지 말고, 수업 장면 → 교육적 의미 → 성장 해석 → 다음 시간 계획의 흐름으로 재구성하라.
6. 평가가 아니라 관찰 중심으로 쓰고, 과장하지 말고 신뢰감 있게 작성하라.
7. 어려운 교육 용어는 학부모가 이해하기 쉬운 일상 언어로 바꿔라.
8. 문장은 짧고 선명하게 쓰되, 내용은 얕지 않게 하라.
9. 같은 표현, 같은 문장 구조, 같은 어휘를 반복하지 말고 다양한 표현군을 사용하라.
10. 첨부된 작품 사진이 있는 경우, 결과만이 아니라 과정의 흐름과 변화도 함께 해석하라.
11. '메모는 짧지만', '간단히 보면', '요약하면' 같은 메타 표현은 사용하지 말고 바로 관찰과 해석으로 들어가라.

[좋은 관찰메모 예시]
- 도라에몽 만들다가 친구랑 색 의견 달라서 멈춤 → 다시 맞추면서 이어감
- 혼자 그리다가 친구랑 같이 하기로 하고 역할 나눠서 진행
- 만들다가 어려워서 멈춤 → 친구 도움 받아 다시 이어감
- 스케치 여러 번 수정하다가 친구 의견 듣고 방향 바꿔서 진행
- 작업 속도 차이로 기다렸다가 다시 같이 맞춰서 진행

[메모 해석 원칙]
- 메모는 실제 수업에서 벌어진 장면과 흐름이 드러나게 작성한다.
- 메모를 그대로 옮기지 말고, 그 안에 담긴 선택, 멈춤, 조율, 재시도, 완수의 흐름을 해석해 브리핑으로 확장한다.
- 짧은 메모 하나도 깊이 있는 성장 이야기로 풀어낼 수 있어야 한다.

[해석 우선순위]
- 모든 브리핑은 반드시 다음 순서로 해석한다.
1. 연령대
2. 재원기간
3. 프로젝트
4. 선택된 키워드와 관찰 메모

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
- 연령 메인키워드: ${form.ageDomain}
- 연령 파생키워드: ${form.ageSubKeywords.join(", ")}
- 프로젝트: ${form.project}
- 프로젝트 키워드: ${form.projectKeywordsSelected.join(", ")}
- 사회성훈련 메인키워드: ${form.socialDomain}
- 사회성훈련 파생키워드: ${form.socialKeywordsSelected.join(", ")}
- 관찰 메모: ${form.memo}
- 첨부 이미지 수: ${form.images.length}장

[자동 해석 결과]
- 중심 상위개념: ${interpreted.primaryUpper}
- 중심 메인키워드: ${interpreted.primaryMain}
- 연령 해석: ${interpreted.ageMeaning}
- 프로젝트 해석: ${interpreted.projectMeaning}
- 핵심 의미들: ${interpreted.keyMeanings.join(", ")}
- 브리핑 중심 요약: ${interpreted.summary}

위 기준을 모두 반영하여, 학부모에게 바로 전달 가능한 자라다식 전문 브리핑을 작성하라.`;
}

function buildObservationLine(memoParts) {
  if (memoParts.length >= 3) {
    return `${memoParts[0]}이 보였고, 이어 ${memoParts[1]} 흐름으로 연결되었으며, 마지막에는 ${memoParts[2]} 장면까지 자연스럽게 이어졌습니다. 이 과정에서 아이가 스스로 흐름을 이어가려는 힘이 분명하게 드러났습니다.`;
  }

  if (memoParts.length === 2) {
    return `${memoParts[0]}이 보였고, 이어 ${memoParts[1]} 흐름으로 자연스럽게 연결되었습니다. 이 과정에서 아이가 스스로 다음 단계로 이어가려는 모습이 드러났습니다.`;
  }

  if (memoParts.length === 1) {
    return `${memoParts[0]}이 특히 인상적이었습니다. 아이는 그 과정에서 자신의 방식으로 계속 시도해보는 모습을 보였고, 하나의 시도가 다음 흐름으로 이어질 수 있는 가능성도 함께 드러났습니다.`;
  }

  return "";
}

function buildKeyLine(keyMeanings) {
  if (!keyMeanings.length) return "";
  if (keyMeanings.length === 1) {
    return `오늘은 특히 ${keyMeanings[0]}과 연결된 흐름이 중심적으로 드러났습니다.`;
  }
  return `오늘은 특히 ${keyMeanings.slice(0, 2).join("과 ")}과 연결된 흐름이 중심적으로 드러났습니다.`;
}

function generatePreview(form) {
  if (!form.memo.trim()) {
    return "관찰 메모를 입력하면 브리핑 초안이 여기에 표시됩니다.";
  }

  const interpreted = deriveInterpretation(form);
  const memoParts = splitMemo(form.memo);
  const title = titleFor(form);
  const greeting = "어머님, 안녕하세요. 오늘 수업 내용을 공유드립니다.";

  const observationLine = buildObservationLine(memoParts);
  const projectLine = interpreted.projectMeaning;
  const ageLine = interpreted.ageMeaning;
  const keyLine = buildKeyLine(interpreted.keyMeanings);

  const interpretationLine = `이번 경험은 ${interpreted.primaryUpper} 안에서 ${interpreted.primaryMain}과 연결되는 장면으로 해석할 수 있으며, 아이가 지금 시기에 필요한 성장 과제를 실제 수업 안에서 경험해본 시간이었다는 점에서 의미가 있었습니다.`;

  const imageLine = imagePlanLine(form.images.length);
  const nextLine = nextPlanFor(form);

  const lines = [
    `"${title}"`,
    "",
    greeting,
    "",
    observationLine,
    projectLine,
    ageLine,
    keyLine,
    interpretationLine,
    imageLine,
    nextLine,
  ].filter(Boolean);

  return lines.join("\n");
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
  const [recordSearch, setRecordSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("jarada-briefing-records-v2");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("jarada-briefing-records-v2", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    const ageDomainList = Object.keys(ageDomains[form.ageBand] || {});
    if (!ageDomainList.includes(form.ageDomain)) {
      const nextDomain = ageDomainList[0] || "";
      const nextSubs = ageDomains[form.ageBand]?.[nextDomain] || [];
      setForm((prev) => ({
        ...prev,
        ageDomain: nextDomain,
        ageSubKeywords: nextSubs.length ? [nextSubs[0]] : [],
      }));
    }
  }, [form.ageBand, form.ageDomain]);

  useEffect(() => {
    const list = stageKeywords[form.months] || [];
    if (!list.includes(form.stage)) {
      setForm((prev) => ({ ...prev, stage: list[0] || "" }));
    }
  }, [form.months, form.stage]);

  useEffect(() => {
    const projectList = projectKeywords[form.project] || [];
    setForm((prev) => ({
      ...prev,
      projectKeywordsSelected: prev.projectKeywordsSelected.filter((k) => projectList.includes(k)),
    }));
  }, [form.project]);

  useEffect(() => {
    const socialList = socialMainKeywords[form.socialDomain] || [];
    setForm((prev) => ({
      ...prev,
      socialKeywordsSelected: prev.socialKeywordsSelected.filter((k) => socialList.includes(k)),
    }));
  }, [form.socialDomain]);

  const prompt = useMemo(() => generatePrompt(form), [form]);
  const preview = useMemo(() => generatePreview(form), [form]);

  const filteredRecords = useMemo(() => {
    const q = recordSearch.trim().toLowerCase();
    if (!q) return records;
    return records.filter((item) => (item.student || "").toLowerCase().includes(q));
  }, [records, recordSearch]);

  const toggleInList = (list, value) => {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  };

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
      createdAt: new Date().toISOString(),
    };

    setRecords((prev) => [item, ...prev]);
  };

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllRecords = () => {
    const ok = window.confirm("저장된 기록을 모두 삭제할까요?");
    if (!ok) return;
    setRecords([]);
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
            <p style={styles.subtitle}>
              재원기간, 연령, 프로젝트, 사회성훈련 키워드를 바탕으로 교육적 의미와 다음 시간 계획까지 담긴 브리핑 초안을 만들 수 있습니다.
            </p>
          </div>

          <div style={styles.darkCard}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#cbd5e1", marginBottom: 14 }}>작성 기준</div>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={styles.darkItem}>짧은 메모를 바탕으로 깊이 있는 성장 이야기를 풀어냅니다.</div>
              <div style={styles.darkItem}>평가보다 관찰 중심으로, 자라다 해석 기준이 자연스럽게 반영됩니다.</div>
              <div style={styles.darkItem}>연령 · 재원기간 · 프로젝트 · 사회성 키워드를 함께 해석합니다.</div>
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
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    style={styles.input}
                  />
                </Field>
              </div>

              <div style={styles.softBox}>
                <div style={{ ...styles.label, marginBottom: 10 }}>연령 / 발달 기준</div>
                <div style={styles.grid3}>
                  <Field label="연령대" hint="연령별 핵심 과제를 먼저 선택합니다">
                    <div style={{ display: "grid", gap: 10 }}>
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

                  <Field label="메인키워드">
                    <div style={styles.chips}>
                      {Object.keys(ageDomains[form.ageBand] || {}).map((domain) => (
                        <Chip key={domain} active={form.ageDomain === domain} onClick={() => setForm((prev) => ({ ...prev, ageDomain: domain }))}>
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="파생키워드" hint="복수 선택 가능">
                    <div style={styles.chips}>
                      {(ageDomains[form.ageBand]?.[form.ageDomain] || []).map((sub) => (
                        <Chip
                          key={sub}
                          active={form.ageSubKeywords.includes(sub)}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              ageSubKeywords: toggleInList(prev.ageSubKeywords, sub),
                            }))
                          }
                        >
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
                  <Field label="프로젝트 키워드" hint="복수 선택 가능">
                    <div style={styles.chips}>
                      {(projectKeywords[form.project] || []).map((keyword) => (
                        <Chip
                          key={keyword}
                          active={form.projectKeywordsSelected.includes(keyword)}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              projectKeywordsSelected: toggleInList(prev.projectKeywordsSelected, keyword),
                            }))
                          }
                        >
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

              <div style={styles.softBox}>
                <div style={{ ...styles.label, marginBottom: 10 }}>사회성훈련</div>
                <div style={styles.grid2}>
                  <Field label="메인키워드">
                    <div style={styles.chips}>
                      {Object.keys(socialMainKeywords).map((domain) => (
                        <Chip key={domain} active={form.socialDomain === domain} onClick={() => setForm((prev) => ({ ...prev, socialDomain: domain }))}>
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="파생키워드" hint="복수 선택 가능">
                    <div style={styles.chips}>
                      {(socialMainKeywords[form.socialDomain] || []).map((keyword) => (
                        <Chip
                          key={keyword}
                          active={form.socialKeywordsSelected.includes(keyword)}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              socialKeywordsSelected: toggleInList(prev.socialKeywordsSelected, keyword),
                            }))
                          }
                        >
                          {keyword}
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
                    placeholder={`수업 중 관찰된 장면을 짧게 적어주세요
(해석하지 말고, 실제 행동만 기록)

예:
- 친구와 색 의견이 달라 멈췄다가 다시 맞추며 진행함
- 혼자 하다가 친구와 역할을 나눠 작업으로 전환함
- 어려워서 멈췄다가 도움 받아 다시 이어감`}
                    style={styles.textarea}
                  />
                </Field>
              </div>

              <div style={styles.buttonRow}>
                <button onClick={saveRecord} style={styles.primaryBtn}>
                  기록 저장
                </button>
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
              </div>
              <div style={styles.promptBox}>{prompt}</div>
            </section>

            <section style={{ ...styles.card, marginTop: 24 }}>
              <div style={styles.cardTopRow}>
                <div>
                  <h2 style={styles.sectionTitle}>브리핑 초안 미리보기</h2>
                  <div style={styles.sectionHint}>학부모에게 전달하기 전 문장 흐름을 바로 확인할 수 있습니다.</div>
                </div>
                <button onClick={() => copyText(preview, "preview-top")} style={styles.miniButton}>
                  {copied === "preview-top" ? "복사됨" : "초안 복사"}
                </button>
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

            <input
              value={recordSearch}
              onChange={(e) => setRecordSearch(e.target.value)}
              placeholder="아이 이름으로 검색"
              style={styles.recordSearch}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <button onClick={clearAllRecords} style={styles.dangerBtn}>
                전체 삭제
              </button>
            </div>

            <div style={styles.recordList}>
              {filteredRecords.length === 0 ? (
                <div style={{ ...styles.recordCard, textAlign: "center", color: "#64748b" }}>저장된 기록이 없습니다.</div>
              ) : (
                filteredRecords.map((item) => (
                  <div key={item.id} style={styles.recordCard}>
                    <div style={{ fontWeight: 700 }}>{item.student || "이름 미입력"}</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>
                      {item.date} · {item.project} · {item.stage}
                    </div>
                    <div style={styles.recordMemo}>{item.memo}</div>
                    <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>첨부 사진 {item.images?.length || 0}장</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                      <button onClick={() => copyText(item.prompt, `p-${item.id}`)} style={styles.secondaryBtn}>
                        {copied === `p-${item.id}` ? "복사됨" : "프롬프트 복사"}
                      </button>
                      <button onClick={() => copyText(item.preview, `v-${item.id}`)} style={styles.secondaryBtn}>
                        {copied === `v-${item.id}` ? "복사됨" : "초안 복사"}
                      </button>
                      <button onClick={() => deleteRecord(item.id)} style={styles.dangerBtn}>
                        삭제
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
