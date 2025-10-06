// -------------------------- 全局配置（所有文件可共用） --------------------------
const EXPERIMENT_CONFIG = {
    imageFolder: "artpic/", // 图片文件夹相对路径（根目录下的artpic）
    totalTrials: 100,       // 总试次数（100张图）
    fixationDuration: 1000, // 注视点时长（ms）
    blankDuration: 500,     // 空屏时长（ms）
    bgColor: "#626262",     // 背景色
    textColor: "#000000"    // 文本色
};

// -------------------------- 生成"图片序号-类型"映射（复现MATLAB逻辑） --------------------------
// 规则：序号1-50=先验（type:1），51-100=随机（type:2）
let IMAGE_LIST = [];
for (let i = 1; i <= EXPERIMENT_CONFIG.totalTrials; i++) {
    IMAGE_LIST.push({
        imageId: i,                          // 图片序号（对应1.png~100.png）
        imageType: i <= 50 ? 1 : 2,          // 1=先验，2=随机
        imageUrl: EXPERIMENT_CONFIG.imageFolder + i + ".png", // 图片完整相对路径
        imageViewTime: 0,                    // 图片观看时长（后续记录）
        beautyScore: 0,                      // 美观度评分（后续记录）
    });
}

// 注意：图片顺序将在 04_main.js 中初始化 jsPsych 后打乱

// -------------------------- 全局数据存储（所有文件可修改） --------------------------
const GLOBAL_DATA = {
    subjectName: "",        // 被试姓名（录入后赋值）
    experimentLog: [        // 实验数据日志（最终导出为TXT）
        "被试姓名：待录入",
        "图片序号\t图片类型\t美观度(0-1)\t观看时长(ms)"
    ]
};
