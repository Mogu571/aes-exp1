// -------------------------- 实验启动核心逻辑 --------------------------
// 等待所有外部文件加载完成后，初始化jsPsych
document.addEventListener("DOMContentLoaded", () => {
    // 初始化jsPsych配置
    jsPsych.init({
        timeline: EXPERIMENT_TIMELINE, // 传入完整实验流程
        display_element: ".jspsych-display-element", // 实验内容容器
        background_color: EXPERIMENT_CONFIG.bgColor, // 全局背景色
        // 可选：添加实验完成后的回调（如控制台打印信息）
        on_finish: () => {
            console.log("实验完全结束！");
            console.log("被试姓名：", GLOBAL_DATA.subjectName);
            console.log("实验数据预览：", GLOBAL_DATA.experimentLog.slice(0, 5)); // 打印前5行数据
        },
        // 可选：开启调试模式（开发阶段用，上线后可删除）
        debug_mode: false,
        // 可选：设置默认文本样式（覆盖jsPsych默认样式）
        default_text_options: {
            color: EXPERIMENT_CONFIG.textColor,
            font_size: "20px",
            font_family: "SimSun, Microsoft YaHei, serif"
        }
    });
});
