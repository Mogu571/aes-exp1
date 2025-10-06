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
        // 可选：显示进度条
        show_progress_bar: false,
        message_progress_bar: '完成进度'
    });

    // 随机打乱图片呈现顺序（复现MATLAB的randperm(100)）
    IMAGE_LIST = jsPsych.randomization.shuffle(IMAGE_LIST);

    // 运行实验时间线
    jsPsych.run(EXPERIMENT_TIMELINE);
});
