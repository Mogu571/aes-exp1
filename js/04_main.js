// -------------------------- 实验启动核心逻辑 --------------------------
// 等待所有外部文件加载完成后，初始化jsPsych
document.addEventListener("DOMContentLoaded", () => {
    // 初始化jsPsych配置
    const jsPsych = initJsPsych({
        // 实验完成后的回调
        on_finish: () => {
            console.log("实验完全结束！");
            console.log("被试姓名：", GLOBAL_DATA.subjectName);
            console.log("实验数据预览：", GLOBAL_DATA.experimentLog.slice(0, 5)); // 打印前5行数据
        },
        // 可选：开启数据列配置
        show_progress_bar: false, // 是否显示进度条
        message_progress_bar: '完成进度', // 进度条文字
    });

    // 运行实验时间线
    jsPsych.run(EXPERIMENT_TIMELINE);
});
