// -------------------------- 实验流程（Timeline） --------------------------
// 使用函数构建timeline，确保所有插件已加载
function buildTimeline() {
    const timeline = [];

    // -------------------------- 环节1：被试姓名录入 --------------------------
    const nameTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div class="welcome-container">
                <h2>欢迎参与实验！</h2>
                <p style="margin-top: 50px; font-size: 18px;">请输入您的姓名（拼音）：</p>
                <input type="text" id="subject-name" placeholder="例如：zhangsan">
                <p style="margin-top: 30px; font-size: 16px; color: #6c757d;">输入完成后按 <kbd>空格键</kbd> 继续</p>
            </div>
        `,
        choices: [" "],
        on_load: () => {
            document.body.style.backgroundColor = "#f8f9fa"; // 白色背景
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
            <div class="instruction-container">
                <h2 style="font-size: 28px;">实验指导语</h2>
                <div class="instruction-text">
                    <p>接下来您将看到一系列图片，请根据自身主观体验对每张图片进行 <strong>评价</strong>。</p>
                    <p>评价没有对错之分，无需考虑"是否合适"，直接按真实感受选择即可。</p>
                    <p style="margin-top: 24px; font-weight: 600; color: #1f2937;">每张图片的呈现流程如下：</p>
                    <p>1. 首先会显示一个 <strong>"+"</strong> 字（注视点），请您注视它；</p>
                    <p>2. 随后显示空屏，短暂过渡后呈现图片；</p>
                    <p>3. 看到图片后，按 <kbd>空格键</kbd> 开始评价；</p>
                    <p>4. 评价时，拖动控制杆到对应位置，点击 <strong>"确定"</strong> 完成当前项评价。</p>
                    <p style="margin-top: 24px; font-weight: 600; color: #1f2937;">评价维度为：</p>
                    <p><strong>美观度</strong>：从"非常丑"到"非常美"；</p>
                    <p style="margin-top: 32px; font-size: 18px; color: #007cba; text-align: center;">按 <kbd>空格键</kbd> 开始实验</p>
                </div>
            </div>
        `,
        choices: [" "],
        post_trial_gap: 500,
        on_load: () => {
            document.body.style.backgroundColor = "#f8f9fa"; // 白色背景
        }
    };
    timeline.push(instructionTrial);

    // ✅ 添加过渡试次，切换到实验背景色
    const startExperimentTransition = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="text-align: center; margin-top: 200px; color: #ffffff;">
                <h2 style="font-size: 24px; color: #ffffff;">实验即将开始</h2>
                <p style="margin-top: 20px; font-size: 18px; color: #e5e7eb;">请保持注意力集中</p>
            </div>
        `,
        choices: "NO_KEYS",
        trial_duration: 1500,
        on_load: () => {
            document.body.style.backgroundColor = "#626262"; // ✅ 切换到灰色背景
        }
    };
    timeline.push(startExperimentTransition);

    // -------------------------- 环节3：100个实验试次（循环生成） --------------------------
    for (let i = 0; i < IMAGE_LIST.length; i++) {
        const currentImage = IMAGE_LIST[i];

        // 子环节1：注视点（1s）
        const fixationTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div class="fixation-point">+</div>`,
            choices: "NO_KEYS",
            trial_duration: EXPERIMENT_CONFIG.fixationDuration,
            post_trial_gap: 0
        };

        // 子环节2：空屏（0.5s）
        const blankTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="width: 100%; height: 500px;"></div>`,
            choices: "NO_KEYS",
            trial_duration: EXPERIMENT_CONFIG.blankDuration,
            post_trial_gap: 0
        };

        // 子环节3：呈现图片（按空格键终止）
        const imageTrial = {
            type: jsPsychImageKeyboardResponse,
            stimulus: currentImage.imageUrl,
            choices: [" "],
            prompt: `<div style="text-align: center; margin-top: 20px; color: #ffffff; font-size: 16px;">按 <kbd style="background: #ffffff; color: #333;">空格键</kbd> 开始评价</div>`,
            stimulus_height: 500,
            stimulus_width: 800,
            post_trial_gap: 0,
            on_finish: (data) => {
                currentImage.imageViewTime = data.rt;
            }
        };

        // 子环节4：维度1 - 美观度评分
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

        // 子环节5：维度2 - 愉悦度评分
       /* const pleasureRatingTrial = {
            type: CustomRatingPlugin,
            labelLeft: "很不愉悦",
            labelRight: "非常愉悦",
            prompt: "请评价观看图片的愉悦度",
            post_trial_gap: 300,
            on_finish: (data) => {
                currentImage.pleasureScore = data.rating;
            }
        }; */

        // 子环节6：维度3 - 喜好度评分
       /* const likeRatingTrial = {
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
        }; */

        // 将当前试次的4个子环节加入时间线
        timeline.push(fixationTrial, blankTrial, imageTrial, beautyRatingTrial);
    }

    // -------------------------- 环节4：实验结束页（数据下载） --------------------------
    const endTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="text-align: center; padding: 50px; background-color: #ffffff; border-radius: 15px; margin: 100px auto; max-width: 600px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid #e9ecef;">
                <h2 style="font-size: 28px; color: #28a745; margin-bottom: 30px;">✓ 实验已完成！</h2>
                <p style="font-size: 18px; margin-bottom: 40px; color: #495057;">感谢您的参与！</p>
                <p style="font-size: 16px; margin-bottom: 30px; color: #6c757d;">请点击下方按钮下载您的实验数据</p>
                <button id="js-download-btn">
                    下载实验数据
                </button>
                <p style="font-size: 14px; margin-top: 20px; color: #9ca3af;">数据将以 TXT 格式保存到本地</p>
            </div>
        `,
        choices: "NO_KEYS",
        on_load: () => {
            document.body.style.backgroundColor = "#f8f9fa"; // ✅ 恢复白色背景
            setTimeout(() => {
                document.getElementById("js-download-btn").addEventListener("click", () => {
                    const dataText = GLOBAL_DATA.experimentLog.join("\n");
                    const blob = new Blob([dataText], { type: "text/plain; charset=utf-8" });
                    const timestamp = new Date().toLocaleString().replace(/[:/ ]/g, "-");
                    const fileName = `${GLOBAL_DATA.subjectName}_实验数据_2_${timestamp}.txt`;
                    saveAs(blob, fileName);
                });
            }, 100);
        }
    };
    timeline.push(endTrial);

    return timeline;
}
