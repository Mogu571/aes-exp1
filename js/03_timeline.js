// -------------------------- 实验流程（Timeline） --------------------------
// 使用函数构建timeline，确保所有插件已加载
function buildTimeline() {
    const timeline = [];

    // -------------------------- 环节1：被试姓名录入 --------------------------
    const nameTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="text-align: center; margin-top: 180px; color: ${EXPERIMENT_CONFIG.textColor};">
                <h2>欢迎参与实验！</h2>
                <p style="margin-top: 50px; font-size: 22px;">请输入您的姓名：</p>
                <input type="text" id="subject-name" placeholder="例如：张三">
                <p style="margin-top: 30px; font-size: 20px;">输入完成后按空格键继续</p>
            </div>
        `,
        choices: [" "],
        on_load: () => {
            const nameInput = document.getElementById("subject-name");
            nameInput.addEventListener("input", (e) => {
                GLOBAL_DATA.subjectName = e.target.value.trim();
            });
        },
        on_finish: () => {
            if (!GLOBAL_DATA.subjectName) {
                GLOBAL_DATA.subjectName = `匿名被试_${new Date().getTime()}`;
            }
            GLOBAL_DATA.experimentLog[0] = `被试姓名：${GLOBAL_DATA.subjectName}`;
        }
    };
    timeline.push(nameTrial);

    // -------------------------- 环节2：实验指导语 --------------------------
    const instructionTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="text-align: center; margin-top: 80px; color: ${EXPERIMENT_CONFIG.textColor};">
                <h2>实验指导语</h2>
                <div class="instruction-text">
                    <p>接下来您将看到一系列图片，请根据自身主观体验对每张图片进行3项评价。</p>
                    <p>评价没有对错之分，无需考虑"是否合适"，直接按真实感受选择即可。</p>
                    <p><br>每张图片的呈现流程如下：</p>
                    <p>1. 首先会显示一个"+"字（注视点），请您注视它；</p>
                    <p>2. 随后显示空屏，短暂过渡后呈现图片；</p>
                    <p>3. 看到图片后，按空格键开始评价；</p>
                    <p>4. 评价时，拖动控制杆到对应位置，点击"确定"完成当前项评价。</p>
                    <p><br>评价维度包括：</p>
                    <p>① 美观度：从"非常丑"到"非常美"；</p>
                    <p>② 愉悦度：从"很不愉悦"到"非常愉悦"；</p>
                    <p>③ 喜好度：从"很不喜欢"到"非常喜欢"。</p>
                    <p><br>按空格键开始实验</p>
                </div>
            </div>
        `,
        choices: [" "],
        post_trial_gap: 500
    };
    timeline.push(instructionTrial);

    // -------------------------- 环节3：100个实验试次（循环生成） --------------------------
    for (let i = 0; i < IMAGE_LIST.length; i++) {
        const currentImage = IMAGE_LIST[i];

        const fixationTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div class="fixation-point">+</div>`,
            choices: "NO_KEYS",
            trial_duration: EXPERIMENT_CONFIG.fixationDuration,
            post_trial_gap: 0
        };

        const blankTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="width: 100%; height: 400px; background-color: ${EXPERIMENT_CONFIG.bgColor};"></div>`,
            choices: "NO_KEYS",
            trial_duration: EXPERIMENT_CONFIG.blankDuration,
            post_trial_gap: 0
        };

        const imageTrial = {
            type: jsPsychImageKeyboardResponse,
            stimulus: currentImage.imageUrl,
            choices: [" "],
            prompt: `<div style="text-align: center; margin-bottom: 20px; color: ${EXPERIMENT_CONFIG.textColor};">按空格键开始评价</div>`,
            stimulus_height: 500,
            stimulus_width: 800,
            post_trial_gap: 0,
            on_finish: (data) => {
                currentImage.imageViewTime = data.rt;
            }
        };

        const beautyRatingTrial = {
            type: CustomRatingPlugin,
            labelLeft: "非常丑",
            labelRight: "非常美",
            prompt: "请评价图片的美观度",
            post_trial_gap: 300,
            on_finish: (data) => {
                currentImage.beautyScore = data.rating;
            }
        };

        const pleasureRatingTrial = {
            type: CustomRatingPlugin,
            labelLeft: "很不愉悦",
            labelRight: "非常愉悦",
            prompt: "请评价观看图片的愉悦度",
            post_trial_gap: 300,
            on_finish: (data) => {
                currentImage.pleasureScore = data.rating;
            }
        };

        const likeRatingTrial = {
            type: CustomRatingPlugin,
            labelLeft: "很不喜欢",
            labelRight: "非常喜欢",
            prompt: "请评价对图片的喜好度",
            post_trial_gap: 500,
            on_finish: (data) => {
                currentImage.likeScore = data.rating;
                GLOBAL_DATA.experimentLog.push(
                    `${currentImage.imageId}\t${currentImage.imageType}\t${currentImage.beautyScore}\t${currentImage.pleasureScore}\t${currentImage.likeScore}\t${currentImage.imageViewTime}`
                );
            }
        };

        timeline.push(fixationTrial, blankTrial, imageTrial, beautyRatingTrial, pleasureRatingTrial, likeRatingTrial);
    }

    // -------------------------- 环节4：实验结束页（数据下载） --------------------------
    const endTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="text-align: center; margin-top: 150px; color: ${EXPERIMENT_CONFIG.textColor};">
                <h2 style="font-size: 32px; margin-bottom: 50px;">实验已完成！感谢您的参与！</h2>
                <p style="font-size: 22px; margin-bottom: 30px;">请点击下方按钮下载您的实验数据</p>
                <button id="js-download-btn" style="font-size: 24px; padding: 15px 40px; border: 3px solid #000; background-color: #fff; cursor: pointer; transition: background-color 0.3s;">
                    下载实验数据
                </button>
                <p style="font-size: 18px; margin-top: 20px; color: #333;">数据将以TXT格式保存到本地</p>
            </div>
        `,
        choices: "NO_KEYS",
        on_load: () => {
            setTimeout(() => {
                document.getElementById("js-download-btn").addEventListener("click", () => {
                    const dataText = GLOBAL_DATA.experimentLog.join("\n");
                    const blob = new Blob([dataText], { type: "text/plain; charset=utf-8" });
                    const timestamp = new Date().toLocaleString().replace(/[:/ ]/g, "-");
                    const fileName = `${GLOBAL_DATA.subjectName}_实验数据_${timestamp}.txt`;
                    saveAs(blob, fileName);
                });
            }, 100);
        }
    };
    timeline.push(endTrial);

    return timeline;
}
