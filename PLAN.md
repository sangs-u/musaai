# 무사이(Musai) 플랫폼 개발 계획서 v1.2

> 오늘도 무사히, 현장을 지킵니다
> 최종 수정: 2026-04-23

---

## 1. 프로젝트 기본 원칙 (변경 불가)

| # | 규칙 | 세부 내용 |
|---|------|----------|
| 1 | 수익화 배제 | 결제 시스템, 사업자 등록 필요 기능 없음 |
| 2 | 무료 호스팅 | GitHub Pages — 비용 0원 |
| 3 | 비전공자 친화 UX | 현장 초보자도 한눈에 이해 가능 |
| 4 | 브랜드 고정 | 무사이(Musai) / 네이비 #2C5282 + 스틸블루 #7B9EE0 |
| 5 | 문서 전문성 | 출력 문서는 법적 요구사항을 완전히 반영한 전문 수준 |

---

## 2. AI 협업 공식

- claude.ai — 계획, 설계, 법령 검토, 논의
- Claude Code (VS Code 터미널) — 실제 파일 수정
- task.txt — Claude Code 작업 지시 파일로 전달

### Claude Code 실행
VS Code에서 Musaai 폴더 열기 → Ctrl+` → claude → task.txt 읽고 실행해줘

---

## 3. Phase 로드맵

### Phase 0 완료
- 파일 3개 분리, CSS 변수 체계, core.js 연결

### 계산 로직 수정 완료
- M값: 수직=1.0 / 바스켓=2.0 / 초크=0.8 (KOSHA M-94-2011 표1)
- 조임각 계수: >120°=100% / 90~120°=86% / 60~89°=74% / 30~59°=62% / 0~29°=49%
- 4줄 이상 유효 줄 수: 3줄 산정

### Phase 1 UX 개선 (진행 중)
- [x] q-hint 핵심 설명, 용어 괄호 풀이
- [x] Lucide 아이콘 CDN 연결
- [ ] 달기기구 SVG 아이콘 교체 (task.txt 대기)
- [ ] 상태 판정 SVG 아이콘 교체

### Phase 2 작업계획서 모듈
- plan-template.js, plan.html, core-plan.js, PDF 출력

### Phase 3 고도화
- GitHub Pages 배포, PWA, IndexedDB

---

## 4. 현재 즉시 실행 순서

1. 달기기구 SVG 아이콘 교체 (Claude Code)
2. 상태 판정 SVG 아이콘 교체 (Claude Code)
3. plan-template.js 법적 항목 DB (클로드)
4. plan.html 기본 구조 (클로드)
5. core-plan.js 로직 (클로드)
6. PDF 출력 연결 (클로드)