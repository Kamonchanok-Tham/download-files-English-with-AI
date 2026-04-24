const rubric = [
    {
        key: "fluency",
        label: "Fluency",
        labelTH: "ความลื่นไหล",
        weight: 20,
        levels: [
            { score:1, textEN: "Frequent pauses or difficulty continuing speech", textTH: "มีการหยุดบ่อยหรือพูดได้ยากต่อเนื่อง"},
            { score:2, textEN: "Some hesitation but speech generally continues", textTH: "มีความลังเลบ้าง แต่พูดได้ต่อเนื่อง"},
            { score:3, textEN: "Speaks smoothly with natural pacing and minimal hesitation", textTH: "พูดไหลลื่น มีจังหวะธรรมชาติ ลังแลน้อยมาก"}
        ]
    },
    {
        key: "language",
        label: "Language Use (Grammar & Vocabulary)",
        labelTH: "ความถูกต้อง",
        weight: 20,
        levels: [
            { score:1, textEN: "Frequent grammatical errors and very limited vocabulary that reduce clarity", textTH: "ผิดไวยากรณ์บ่อย และมีคำศัพท์จำกัดมากจนทำให้ความหมายไม่ชัดเจน"},
            { score:2, textEN: "Some grammatical errors and limited vocabulary, but meaning is generally clear", textTH: "มีข้อผิดพลาดบ้าง และคำศัพท์ค่อนข้างจำกัด แต่ความหมายชัดเจน"},
            { score:3, textEN: "Uses mostly correct sentence structures and appropriate vocabulary with some variety", textTH: "ใช้โครงสร้างประโยคถูกต้องและคำศัพท์ที่เหมาะสม มีความหลากหลายพอสมควร"}
        ]
    },
        {
        key: "pronunciation",
        label: "Pronunciation",
        labelTH: "การออกเสียง",
        weight: 20,
        levels: [
            { score:1, textEN: "Pronumciation frequently interferes with understanding", textTH: "การออกเสียงผิดบ่อยจนทำให้ยากต่อการเข้าใจ"},
            { score:2, textEN: "Mostly understandable with som mispronunciations", textTH: "เข้าใจได้ส่วนใหญ่ แต่ออกเสียงผิดบ้าง"},
            { score:3, textEN: "Addresses the topic clearly and includes key ideas", textTH: "ตอบตรงกับหัวข้ออย่างชัดเจนรวมไอเดียสำคัญต่างๆ"}
        ]
    },
        {
        key: "content",
        label: "Content",
        labelTH: "เนื้อหา",
        weight: 20,
        levels: [
            { score:1, textEN: "Response is very brief or not clearly related to the topic", textTH: "ตอบโต้สั้นมาก หรือไม่ตรงกับหัวข้อ"},
            { score:2, textEN: "Addresses the topic but some ideas are unclear or incomplete", textTH: "ตอบตรงกับหัวข้อแต่บางไอเดียไม่ชัดเจนหรือไม่สมบูรณ์"},
            { score:3, textEN: "Addresses the topic clearly and includes key ideas", textTH: "ตอบตรงกับหัวข้ออย่างชัดเจนรวมไอเดียสำคัญต่างๆ"}
        ]
    },
        {
        key: "com",
        label: "Non-Verbal Communication",
        labelTH: "การสื่อสารด้วยท่าทาง",
        weight: 20,
        levels: [
            { score:1, textEN: "Little eye contact and minimal expression", textTH: "สบตาน้อย ท่าทางไม่มีชีวิตชีวา"},
            { score:2, textEN: "Some eye contact and limited expression", textTH: "สบตาบ้าง ท่าทางค่อนข้างจำกัด"},
            { score:3, textEN: "Maintains eye contact with the camera and shows confidence", textTH: "สบตากล้องคงที่ ท่าทางแสดงความมั่นใจ"}
        ]
    }
]


function createEvalForm(conId, topic, onSubmit){
    const container = document.getElementById(conId);

    let html = `
    <div class="container-eval">
    <div class="evaluation">
            <h1>Self-Assessment Speaking Rubric</h1>
        <div class="student-card">
        <div class="student-header">
            <div class="icon">👤</div>
            <h2>ข้อมูลนักศึกษา / Student Information</h2>
        </div>

        <div class="input-group">
            <p>ชื่อ-นามสกุล / Name</p>
            <input type="text" placeholder="กรุณากรอกชื่อ-นามสกุล / Name" class="student-name">
        </div>
    </div>
    `;

    rubric.forEach(item => {
        html += `<div class="criteria">
            <div class="top">
                <div class="labelThai">
                <h4>${item.label}</h4>
                <span>${item.labelTH}</span>
                </div>
                <h4 class="w">${item.weight}%</h4>
            </div>

            <div class="levels">
        `;

        item.levels.forEach(level => {
            html += `
            <label class="ev level-${level.score}">
                <input type="radio" name="${item.key}_${topic}" value="${level.score}" class="hidden-radio">
                ${level.textEN}<br/><span>${level.textTH}</span>
            </label>
            `;
        });
        html += `</div>`;
    });
    html +=`
        <button class="submitEval">Submit</button>
        </div>
        </div>
    `;
    container.innerHTML = html;

    container.querySelector(".submitEval").onclick =  async () => {
        const name = container.querySelector(".student-name").value;
        if (!name) {
             showToast("กรุณากรอกชื่อ");
             return; 
        }
        const data = {
            topic: topic,
            name: name,
            scores: {}
        };
        let isComplete = true;
        rubric.forEach(item => {
            const selected = container.querySelector(`input[name="${item.key}_${topic}"]:checked`);
            if (!selected) isComplete = false;
            data.scores[item.key] = selected ? selected.value : null;
        })
        if (!isComplete) { 
            showToast("กรุณาให้คะแนนทุกหัวข้อ");
            return; 
        }
        try {
        // 🔥 ส่งขึ้น server
        await fetch("https://tiny-darkness-94e3.kamonchanok-10292.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        showToast("ส่งสำเร็จแล้ว");

        // reset form
        container.querySelector(".student-name").value = "";
        container.querySelectorAll("input[type='radio']")
            .forEach(r => r.checked = false);

    } catch (err) {
        console.error(err);
        showToast("ส่งข้อมูลไม่สำเร็จ");
    }
    
}
}


createEvalForm("eval1", "Topic 1", (data) => {
    console.log("Topic1:", data);
});

createEvalForm("eval2", "Topic 2", (data) => {
    console.log("Topic2:", data);
});

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000); // หายเอง 2 วิ
}