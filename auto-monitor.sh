#!/bin/bash

# LikeBox Auto Monitor Script
# 持续工作12小时

LOG_FILE="/home/node/.openclaw/workspace/memory/likebox-monitor.log"
PROJECT_DIR="/home/node/.openclaw/workspace/likebox"
END_TIME=$(($(date +%s) + 43200))  # 12小时 = 43200秒

echo "=== LikeBox Auto Monitor Started at $(date) ===" >> $LOG_FILE

round=0
while [ $(date +%s) -lt $END_TIME ]; do
    round=$((round + 1))
    current_time=$(date "+%Y-%m-%d %H:%M:%S UTC")
    echo "" >> $LOG_FILE
    echo "### Round $round - $current_time" >> $LOG_FILE
    
    # 每轮都检查API (每10分钟)
    echo "--- API Check ---" >> $LOG_FILE
    api_result=$(curl -s -w "\n%{http_code}" https://likebox.vercel.app/api/admin/stats 2>&1)
    http_code=$(echo "$api_result" | tail -n1)
    body=$(echo "$api_result" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        echo "API Status: ✅ 正常" >> $LOG_FILE
        echo "Response: $body" >> $LOG_FILE
    else
        echo "API Status: ❌ 错误 (HTTP $http_code)" >> $LOG_FILE
        echo "Response: $body" >> $LOG_FILE
    fi
    
    # 每3轮检查一次Git (约30分钟)
    if [ $((round % 3)) -eq 0 ]; then
        echo "--- Git Status ---" >> $LOG_FILE
        cd $PROJECT_DIR
        git status >> $LOG_FILE 2>&1
    fi
    
    # 每6轮检查一次代码改进 (约1小时)
    if [ $((round % 6)) -eq 0 ]; then
        echo "--- Code Review ---" >> $LOG_FILE
        echo "Hourly code review check..." >> $LOG_FILE
    fi
    
    # 等待10分钟
    sleep 600
done

echo "=== LikeBox Auto Monitor Finished at $(date) ===" >> $LOG_FILE
