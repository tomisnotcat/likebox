#!/bin/bash
# LikeBox 持续监控进程
# 每15分钟检查一次API状态

LOG_FILE="/home/node/.openclaw/workspace/memory/likebox-monitor.log"
API_URL="https://likebox.vercel.app/api/admin/stats"
CHECK_INTERVAL=900  # 15分钟 = 900秒

log_status() {
    timestamp=$(date -u +"%Y-%m-%d %H:%M UTC")
    echo "$timestamp | $1" >> "$LOG_FILE"
}

check_api() {
    timestamp=$(date -u +"%Y-%m-%d %H:%M UTC")
    response=$(curl -s -w "\n%{http_code}" "$API_URL" 2>&1)
    
    if [ $? -ne 0 ]; then
        echo "[$(date)] ❌ 连接失败"
        log_status "ERROR | Connection failed"
        return 1
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        users=$(echo "$body" | grep -o '"total_users":[0-9]*' | cut -d: -f2)
        products=$(echo "$body" | grep -o '"total_products":[0-9]*' | cut -d: -f2)
        likes=$(echo "$body" | grep -o '"total_likes":[0-9]*' | cut -d: -f2)
        comments=$(echo "$body" | grep -o '"total_comments":[0-9]*' | cut -d: -f2)
        
        echo "[$(date)] ✅ API正常 - users:$users products:$products likes:$likes comments:$comments"
        log_status "OK | users:$users products:$products likes:$likes comments:$comments"
        
        # 检查异常
        if [ "$users" -lt 1000 ]; then
            echo "[$(date)] ⚠️ 警告: 用户数异常低: $users"
            log_status "WARN | Users low: $users"
        fi
    else
        echo "[$(date)] ❌ API错误 HTTP $http_code"
        log_status "ERROR | HTTP $http_code"
        return 1
    fi
}

echo "🚀 LikeBox 监控已启动，每${CHECK_INTERVAL}秒检查一次"
log_status "MONITOR_STARTED"

while true; do
    check_api
    echo "[$(date)] 💤 等待下一轮检查..."
    sleep $CHECK_INTERVAL
done
