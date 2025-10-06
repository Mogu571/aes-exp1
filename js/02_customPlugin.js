// -------------------------- 自定义评分插件：custom-rating --------------------------
// 功能：提供"左标签-控制杆-右标签"的评分界面,支持鼠标拖动标记
class CustomRatingPlugin {
    // 插件参数定义（外部调用时需传入的参数）
    static info = {
        name: "custom-rating",
        parameters: {
            labelLeft: { 
                type: 'string',
                default: "非常差"
            },
            labelRight: { 
                type: 'string',
                default: "非常好"
            },
            prompt: { 
                type: 'string',
                default: "请评价"
            }
        }
    };

    // ✅ 添加构造函数，接收 jsPsych 实例
    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }

    // 插件核心逻辑（实验试次执行时的代码）
    trial(display_element, trial) {
        // 1. 构建评分界面HTML
        const ratingHtml = `
            <div style="text-align: center; margin-top: 50px; color: ${EXPERIMENT_CONFIG.textColor};">
                <h2 style="margin-bottom: 30px;">${trial.prompt}</h2>
                <div class="rating-slider" id="js-rating-slider">
                    <div class="slider-marker" id="js-slider-marker" style="left: 50%;"></div>
                </div>
                <div class="rating-labels">
                    <span>${trial.labelLeft}</span>
                    <span>${trial.labelRight}</span>
                </div>
                <div class="confirm-button" id="js-confirm-btn">确定</div>
            </div>
        `;
        display_element.innerHTML = ratingHtml;

        // 2. 初始化变量
        const slider = document.getElementById("js-rating-slider");
        const marker = document.getElementById("js-slider-marker");
        const confirmBtn = document.getElementById("js-confirm-btn");
        let isDragging = false;
        let ratingValue = 0.5;

        // 3. 鼠标事件监听：开始拖动
        const handleMouseDown = (e) => {
            isDragging = true;
            e.preventDefault();
        };

        // 4. 鼠标事件监听：拖动标记
        const handleMouseMove = (e) => {
            if (isDragging) {
                const sliderRect = slider.getBoundingClientRect();
                let markerX = e.clientX - sliderRect.left;
                markerX = Math.max(0, Math.min(markerX, sliderRect.width));
                ratingValue = markerX / sliderRect.width;
                marker.style.left = `${markerX}px`;
            }
        };

        // 5. 鼠标事件监听：停止拖动
        const handleMouseUp = () => {
            if (isDragging) isDragging = false;
        };

        // 添加事件监听
        marker.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        // 6. 点击确定按钮：结束评分，返回数据
        confirmBtn.addEventListener("click", () => {
            // 清理事件监听
            marker.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            
            // 清空当前界面
            display_element.innerHTML = "";
            
            // ✅ 现在 this.jsPsych 已经正确初始化了
            this.jsPsych.finishTrial({
                rating: parseFloat(ratingValue.toFixed(4))
            });
        });
    }
}
