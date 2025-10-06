// -------------------------- 实验启动核心逻辑 --------------------------
// ✅ 声明全局变量
let jsPsych;

document.addEventListener("DOMContentLoaded", () => {
    // 初始化jsPsych配置并保存到全局变量
    jsPsych = initJsPsych({
        on_finish: () => {
            console.log("实验完全结束！");
            console.log("被试姓名：", GLOBAL_DATA.subjectName);
            console.log("实验数据预览：", GLOBAL_DATA.experimentLog.slice(0, 5));
        }
    });

    // 随机打乱图片呈现顺序
    IMAGE_LIST = jsPsych.randomization.shuffle(IMAGE_LIST);

    // 构建实验时间线
    const timeline = buildTimeline();

    // 运行实验
    jsPsych.run(timeline);
});
