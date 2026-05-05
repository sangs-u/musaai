#!/bin/bash
if echo "$TOOL_INPUT" | grep -qE "rm -rf|del /f|format"; then
  echo "위험한 명령어 차단" >&2
  exit 2
fi
if echo "$TOOL_INPUT" | grep -q "core.js" && echo "$TOOL_INPUT" | grep -qv "read\|cat\|view"; then
  echo "[경고] core.js 수정 감지 — 계산 로직 변경 여부 확인 필요" >&2
fi
