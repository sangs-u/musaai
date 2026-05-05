# Skill: 양중 안전검토 (lifting.html)
언제: lifting.html 수정 요청 시 자동 적용
규칙:
- calc(), calcKM() 로직 절대 수정 금지
- S 객체 → render() 패턴 유지
- core.js import 구조 유지
- style.css는 lifting.html 전용, 다른 파일에서 건드리지 않음
계산 기준 (KOSHA M-94-2011):
- M: 수직=1.0 / 바스켓=2.0 / 초크=0.8
- K: 1/cos(β), β=α/2
- 3줄 이상 → 유효 줄 수 3줄로 산정
