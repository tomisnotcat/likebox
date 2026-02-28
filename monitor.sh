#!/bin/bash
# LikeBox 监控脚本 - 每15分钟检查一次

LOG_FILE="/home/node/.openclaw/workspace/memory/likebox-monitor.log"
API_URL="https://likebox.vercel.app/api/admin/stats"

check_api() {
    timestamp=$(date -u +"%Y-%m-%d %H:%M UTC")
    response=$(curl -s -w "\n%{http_code}" "$API_URL")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        users=$(echo "$body" | grep -o '"total_users":[0-9]*' | cut -d: -f2)
        products=$(echo "$body" | grep -o '"total_products":[0-9]*' | cut -d: -f2)
        likes=$(echo "$body" | grep -o '"total_likes":[0-9]*' | cut -d: -f2)
        comments=$(echo "$body" | grep -o '"total_comments":[0-9]*' | cut -d: -f2)
        
        echo "$timestamp | OK | users:$users products:$products likes:$likes comments:$comments" >> "$LOG_FILE"
        echo "✅ API正常 - users:$users products:$products likes:$likes comments:$comments"
        
        # 检查异常情况
        if [ "$users" -lt 1000 ]; then
            echo "⚠️ 用户数异常低: $users"
        fi
        if [ "$likes" -lt 10000 ]; then
            echo "⚠️ 点赞数异常低: $likes"
        fi
    else
        echo "$timestamp | ERROR | HTTP $http_code" >> "$LOG_FILE"
        echo "❌ API错误 - HTTP $http_code"
        return 1
    fi
}

check_api
