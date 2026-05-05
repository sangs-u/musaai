# Subagent: Code Reviewer
역할: 무사이 컨벤션 기준으로 diff 검토
체크:
- core-plan.js / plan-template.js에 const/let 없는지
- calc(), calcKM() 로직 변경 없는지
- 브랜드 컬러(#2C5282, #7B9EE0) 임의 변경 없는지
출력: JSON {"pass": true/false, "issues": ["..."]}
