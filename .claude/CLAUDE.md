# 무사이(Musai) — 현장 안전 플랫폼

> 오늘도 무사히, 현장을 지킵니다
> v0.6.0 / 최종 수정: 2026-05-06

---

## 0. 최우선 행동 원칙 ★

> **질문 금지 — 무조건 바로 실행**
>
> - 모호한 요구사항은 스스로 최선의 방법으로 판단하고 즉시 실행
> - "어떻게 할까요?", "이렇게 해도 될까요?", "A와 B 중 어떤 걸 원하시나요?" 등 일체 금지
> - 작업 방향이 한 번 정해지면 완성될 때까지 멈추지 않고 끝까지 진행
> - 중간 보고는 짧은 사실 진술만 (예: "X 완료, Y 진행 중")
> - 예외: 파일 삭제·force push 등 비가역적·파괴적 액션만 확인

---

## 1. 프로젝트 불변 원칙

- 수익화 배제: 결제·사업자 등록 기능 없음
- 무료 호스팅: GitHub Pages 전용
- 비전공자 친화 UX: 현장 초보자도 한눈에 이해 가능
- 브랜드 고정: 무사이(Musai) / 네이비 #2C5282 + 스틸블루 #7B9EE0
- 문서 전문성: 출력 문서는 법적 요구사항 완전 반영

---

## 2. 파일 구조 및 역할

### 공통 로직
- core.js — 순수 계산 엔진 (UI 의존 없음, side-effect 없음)
  - SF_SLING, EFF_MAP, WIRE/BELT/CHAIN DB
  - chokeCapFactor(), calcKM(S), calc(S), getSO(S), createFmt(S)
- core-plan.js — 작업계획서 로직 (MUSAI_CORE 네임스페이스, var 전용)
  - acc_db: 장비별 재해유형 DB
  - machine_acc_map, machine_heavy, machine_labels
  - getAccidentItems(), isHeavyMachine(), getMachineLabel()
- plan-template.js — 작업계획서 필드 스키마 (MUSAI_PLAN 네임스페이스, var 전용)
  - shared_fields: 공통 필드
  - schemas: heavy_equipment / cargo_handling / heavy_object
  - machine_map: 19종 건설기계

### 페이지별
- index.html — 메인 허브 (도구 카드 그리드, 애플 라이트 테마)
- lifting.html — 양중 안전검토 (도담이, Phase 1)
- plan.html — 작업계획서 작성 (Phase 2)
- confined.html — 밀폐공간 환기검토 (E-G-18-2026)
- elec-plan.html — 전기작업계획서 (제319~321조)
- tbm.html — TBM 체크리스트
- scaffold.html — 고소작업 안전검토
- risk.html — 위험성 평가
- sign.html — 안전표지 제작 (KS S ISO 7010)
- sign-pdf-import.html — 안전표지 PDF 임포트
- style.css — lifting.html 전용 스타일 (다른 파일에서 건드리지 않음)
- sign-library.js — 안전표지 심볼 DB

---

## 3. 코딩 컨벤션

### 전역 규칙
- core-plan.js, plan-template.js: var 전용, const/let 금지
- 나머지: const/let 자유 사용
- 파일명: kebab-case
- 함수명: camelCase
- CSS: 각 HTML 파일에 인라인 <style> 태그 (style.css는 lifting.html 전용)

### 상태 관리
- lifting.html: S 객체 기반 상태 → render() 호출 방식
- plan.html: 각 섹션별 전역 객체

### 네임스페이스
- MUSAI_CORE — core-plan.js
- MUSAI_PLAN — plan-template.js

---

## 4. 계산 로직 기준 (수정 금지)

### 줄걸이 안전성 (KOSHA M-94-2011)
- 모드계수 M: 수직=1.0 / 바스켓=2.0 / 초크=0.8
- 각도계수 K: 1/cos(β), β=α/2
- 유효 줄 수: 3줄 이상은 3줄로 산정
- 조임각 정격용량계수:
  >120°→100% / 90~120°→86% / 60~89°→74% / 30~59°→62% / 0~29°→49%
- 안전율(SF_SLING): 5

### 밀폐공간 환기 (KOSHA E-G-18-2026)
- 작업 전: 체적의 10배 급기 (30분)
- 작업 중: 시간당 공기교환 20회 (ACH 20)
- 환기팬 용량: Q(m³/min) = 체적 × 0.4
- 적정공기 기준: O₂ 18~23.5% / CO₂ 1.5% 미만 / H₂S 10ppm 미만 / CO 30ppm 미만

---

## 5. 브랜드 & 디자인 토큰

- 메인 네이비: #2C5282
- 다크 네이비: #1E3A5F
- 스틸블루 (로고 "이"): #7B9EE0
- 배경: #F5F5F7
- 카드 배경: #FFFFFF
- 텍스트 주: #1D1D1F
- 폰트: Pretendard → -apple-system → Apple SD Gothic Neo
- 경고색: #F59E0B / 위험색: #EF4444 / 안전색: #22C55E

---

## 6. 법령 참조 기준

- 줄걸이: KOSHA GUIDE B-M-12-2025, M-94-2011, G-133-2020, G-134-2023
- 작업계획서: 산업안전보건기준에 관한 규칙 제38조 별표3·4, KOSHA D-C-10-2026
- 밀폐공간: 산업안전보건기준 제3편 제10장, KOSHA E-G-18-2026
- 전기작업: 산업안전보건기준 제319~321조
- 안전표지: KS S ISO 7010
- 달기기구 안전계수: 산업안전보건기준 제163조·제164조

---

## 7. 작업 규칙

1. task.txt에 지시사항이 있으면 확인 없이 바로 적용
2. **절대 질문하지 말 것.** 모호한 부분은 스스로 판단하고 진행
3. **파일 삭제 절대 금지.** 수정만 허용
4. **작업 시작 전 자동 백업:** `git add . && git commit -m "pre-work backup"` 실행
5. **core.js / style.css / index.html** — 계산 로직 외 수정 금지; 수정 시 다른 파일 영향 반드시 확인
6. plan-template.js 수정 시 스모크 테스트(console.assert) 통과 확인
7. PDF 출력 관련 작업 시 기존 레이아웃 깨지지 않도록 주의
8. 완료 후 변경된 파일명과 라인 수 보고
9. 외국인 근로자 다국어 지원 고려 (2025-외국인안전답팀 파일 존재)

---

## 8. 현재 Phase 상태

- Phase 0: ✅ 완료 (파일 분리, CSS 변수, core.js)
- Phase 1: ✅ 완료 (lifting.html 890줄, 양중 시뮬레이터 완성)
- Phase 2: 🔄 진행중 (plan-template.js v0.2.0 완료, plan.html accident_table UI 대기)
- Phase 3: ⏳ 예정 (GitHub Pages, PWA, IndexedDB)
