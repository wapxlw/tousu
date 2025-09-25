// API配置
const API_CONFIG = {
    // 后端API基础地址，需要根据实际部署情况修改
    BASE_URL: 'https://your-api-domain.com',
    
    // API端点
    endpoints: {
        complaint: '/api/complain.php',
        complaintDetail: '/api/get_complaint_detail.php',
        complaintTypes: '/api/get_complaint_types.php',
        config: '/api/get_config.php',
        upload: '/api/upload.php',
        uploadImg: '/api/upload_img.php'
    }
};

// 获取URL查询参数
function getUrlQuery(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}

// 验证手机号
function isValidMobileNumber(phoneNumber) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phoneNumber);
}

// 跳转到投诉须知
function go_know(){
    // 跳转到投诉须知页面
    var currentUrl = window.location.pathname;
    var noticeUrl = currentUrl + '/notice';
    window.location.href = noticeUrl;
}

// 自定义alert
(function(){
    window.alert = function(name){
        var iframe = document.createElement("IFRAME");
        iframe.style.display="none";
        iframe.setAttribute("src", 'data:text/plain');
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert(name);
        iframe.parentNode.removeChild(iframe);
    }
})();

// 微信JS-SDK配置
if (typeof wx !== 'undefined') {
    wx.config({
        debug: false,
        appId: "",
        timestamp: "",
        nonceStr: "",
        signature: "",
        jsApiList: []
    });
    wx.ready(function(){
        
    });
    wx.error(function(res){
        
    });
}

// Vue应用
var app = new Vue({
    el: "#app",
    data: {
        currentTid: 0,
        submitSuccess: false,
        upload_files: [],
        phone: "",
        content: "",
        type: "",
        sn: "",
        enterpriseId: "",
        time: "",
        valid: true,
        allList: [],
        // 从后端获取企业配置：是否需要上传图片
        requireImageUpload: true
    },
    mounted() {
        this.time = new Date().getTime();
        this.parseUrlParams();
        this.loadComplaintTypes();
        this.check();
    },
    computed: {
        list: function() {
            return this.allList.filter((item) => {
                return item.pid === this.currentTid
            })
        },
        // 检查当前选中的投诉类型是否有子分类
        hasChildTypes: function() {
            return this.allList.some((item) => {
                return item.pid === this.currentTid
            })
        }
    },
    methods: {
        // 解析URL参数
        parseUrlParams() {
            const pathParts = window.location.pathname.split('/').filter(part => part);
            if (pathParts.length >= 2) {
                this.enterpriseId = pathParts[0];
                this.sn = pathParts[1];
            }
        },
        
        // 加载投诉类型
        loadComplaintTypes() {
            var that = this;
            if (typeof $ !== 'undefined') {
                $.ajax({
                    type: "GET",
                    url: API_CONFIG.BASE_URL + API_CONFIG.endpoints.complaintTypes,
                    data: {
                        sn: this.sn
                    },
                    success: function(data) {
                        var res = typeof data === 'string' ? JSON.parse(data) : data;
                        if (res.code === 1) {
                            that.allList = res.data.types;
                            that.requireImageUpload = res.data.require_image_upload;
                        } else {
                            console.error('加载投诉类型失败:', res.msg);
                            // 使用默认类型
                            that.setDefaultTypes();
                        }
                    },
                    error: function() {
                        console.error('加载投诉类型失败: 网络错误');
                        // 使用默认类型
                        that.setDefaultTypes();
                    }
                });
            } else {
                this.setDefaultTypes();
            }
        },
        
        // 设置默认投诉类型
        setDefaultTypes() {
            this.allList = [
                {tid: 1, pid: 0, text: '服务问题'},
                {tid: 2, pid: 0, text: '产品问题'},
                {tid: 3, pid: 0, text: '其他问题'}
            ];
        },
        
        // 检查通道有效性
        check() {
            var that = this;
            if (typeof $ !== 'undefined') {
                $.ajax({
                    type: "POST",
                    url: API_CONFIG.BASE_URL + API_CONFIG.endpoints.complaint,
                    data: {
                        type: "check",
                        sn: this.sn,
                        time: this.time
                    },
                    success(data) {
                        var data = JSON.parse(data);
                        if (data.code != 1) {
                            if (data.data != "") {
                                window.location = data.data;
                            } else {
                                // window.location = "../404.html";
                            }
                        }
                    }
                });
            }
        },
        
        // 上传图片
        toUpload(e) {
            var that = this;
            var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
            for (var i = 0, len = files.length; i < len; ++i) {
                if (this.upload_files.length < 9) {
                    var file = files[i];
                    var formData = new FormData();
                    formData.append('img', file);
                    if (typeof $ !== 'undefined') {
                        $.ajax({
                            type: "POST",
                            url: API_CONFIG.BASE_URL + API_CONFIG.endpoints.uploadImg,
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function(data) {
                                var res = typeof data === 'string' ? JSON.parse(data) : data;
                                if (res.code === 1 && res.data.url) {
                                    that.upload_files.push(res.data.url);
                                }
                            },
                            error: function() {
                                alert('图片上传失败');
                            }
                        });
                    }
                }
            }
        },
        
        // 提交投诉
        submit() {
            if (!this.phone) {
                alert("请填写手机号码")
                return
            }
            if (!this.content) {
                alert("请填写投诉内容")
                return
            }
            // 根据企业配置验证是否需要上传图片
            if (this.requireImageUpload && this.upload_files.length === 0) {
                alert("请上传相关图片")
                return
            }
            if (!isValidMobileNumber(this.phone)) {
                this.valid = false;
                alert("请填写有效的手机号码")
                return
            } else {
                this.valid = true;
            }
            var that = this;
            if (typeof $ !== 'undefined') {
                $.ajax({
                    type: "POST",
                    url: API_CONFIG.BASE_URL + API_CONFIG.endpoints.upload,
                    data: {
                        type: "upload",
                        phone: that.phone,
                        content: that.content,
                        pic: that.upload_files,
                        complain: that.type,
                        sn: that.sn,
                        enterprise_id: that.enterpriseId
                    },
                    success: function(data) {
                        var res = typeof data === 'string' ? JSON.parse(data) : data;
                        if (res.code === 1) {
                            that.submitSuccess = true;
                        } else {
                            alert(res.msg || '提交失败，请重试');
                        }
                    },
                    error: function() {
                        alert('网络错误，请重试');
                    }
                });
            }
        },
        
        // 选择投诉类型
        change(item) {
            // 检查这个投诉类型是否有子分类
            const hasChildren = this.allList.some(child => child.pid === item.tid);
            
            if (hasChildren) {
                // 如果有子分类，进入下一级选择
                this.currentTid = item.tid;
            } else {
                // 如果没有子分类，直接设置类型并进入提交页面
                this.currentTid = item.tid;
                this.type = item.text;
            }
        },

    }
});