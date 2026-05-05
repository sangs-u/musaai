#!/bin/bash
echo "=== 무사이 세션 시작 ==="
echo "task.txt 상단 5줄:"
cat task.txt 2>/dev/null | head -5 || echo "task.txt 없음"
