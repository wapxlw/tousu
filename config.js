// 可信企业展示页面配置文件
// 请修改 API_BASE_URL 为你的后端API地址

const CONFIG = {
    // 后端API基础地址（必须修改为你的实际域名）
    API_BASE_URL: 'https://qyts.wosb.cn',
    
    // UI配置
    UI: {
        // 主题色
        PRIMARY_COLOR: '#1a73e8',
        
        // 成功色
        SUCCESS_COLOR: '#4CAF50'
    }
};

// 导出配置（trusted.html会使用）
window.APP_CONFIG = CONFIG;
