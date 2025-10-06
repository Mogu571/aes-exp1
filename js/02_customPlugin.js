// -------------------------- 自定义评分插件：custom-rating --------------------------
// 功能：提供"左标签-控制杆-右标签"的评分界面,支持鼠标拖动标记
class CustomRatingPlugin {
    // 插件参数定义（外部调用时需传入的参数）
    static info = {
        name: "custom-rating",
        parameters: {
            labelLeft: { 
                type: jsPsych.ParameterType.STRING, 
                default: "非常差" // 评分左标签（如"非常丑"）
            },
            labelRight: { 
                type: jsPsych.ParameterType.STRING, 
                default: "非常好" // 评分右标签（如"非常美"）
            },
            prompt: { 
                type: jsPsych.ParameterType.STRING, 
                default: "请评价" // 提示文本（如"请评价美观度"）
            }
        }
    };

    // 插件核心逻辑（实验试次执行时的代码）
    trial(display_element, trial) {
        // 1. 构建评分界面HTML（插入到jsPsych容器中）
        const ratingHtml = `
            <div style="text-align: center; margin-top: 50px; color: ${EXPERIMENT_CONFIG.textColor};">
                <!-- 提示文本 -->
                <h2 style="margin-bottom: 30px;">${trial.prompt}</h2>
                <!-- 控制杆 -->
                <div class="rating-slider" id="js-rating-slider">
                    <div class="slider-marker" id="js-slider-marker" style="left: 50%;"></div>
                </div>
                <!-- 评分标签 -->
                <div class="rating-labels">
                    <span>${trial.labelLeft}</span>
                    <span>${trial.labelRight}</span>
                </div>
                <!-- 确定按钮 -->
                <div class="confirm-button" id="js-confirm-btn">确定</div>
            </div>
        `;
        display_element.innerHTML = ratingHtml;

        // 2. 初始化变量
        const slider = document.getElementById("js-rating-slider");
        const marker = document.getElementById("js-slider-marker");
        const confirmBtn = document.getElementById("js-confirm-btn");
        let isDragging = false; // 是否正在拖动标记
        let ratingValue = 0.5;  // 初始评分（0-1，对应控制杆中间）

        // 3. 鼠标事件监听：开始拖动（按下标记）
        const handleMouseDown = (e) => {
            isDragging = true;
            e.preventDefault(); // 阻止默认行为（如文本选中）
        };

        // 4. 鼠标事件监听：拖动标记（移动鼠标）
        const handleMouseMove = (e) => {
            if (isDragging) {
                // 获取控制杆的位置和尺寸
                const sliderRect = slider.getBoundingClientRect();
                // 计算标记在控制杆内的相对位置（限制在0~控制杆宽度）
                let markerX = e.clientX - sliderRect.left;
                markerX = Math.max(0, Math.min(markerX, sliderRect.width));
                // 计算评分（0~1）
                ratingValue = markerX / sliderRect.width;
                // 更新标记位置
                marker.style.left = `${markerX}px`;
            }
        };

        // 5. 鼠标事件监听：停止拖动（松开鼠标）
        const handleMouseUp = () => {
            if (isDragging) isDragging = false;
        };

        // 添加事件监听
        marker.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        // 6. 点击确定按钮：结束评分，返回数据
        confirmBtn.addEventListener("click", () => {
            // 清理事件监听（避免内存泄漏）
            marker.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            
            // 清空当前界面
            display_element.innerHTML = "";
            
            // 返回评分结果（保留4位小数，供后续存储）
            this.jsPsych.finishTrial({
                rating: parseFloat(ratingValue.toFixed(4))
            });
        });
    }
}
