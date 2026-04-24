const API = "https://tiny-darkness-94e3.kamonchanok-10292.workers.dev";

async function loadData() {
    const res = await fetch(`${API}/list`);
    const files = await res.json();

    // 🔥 เอาเฉพาะ evaluation
    const evalFiles = files.filter(f => f.name.startsWith("evaluation/"));

    const tbody = document.querySelector("#table tbody");

    for (let file of evalFiles) {
        try {
            const res = await fetch(file.url);
            const data = await res.json();

            const row = document.createElement("tr");
            const total =
                Number(data.scores.fluency) +
                Number(data.scores.language) +
                Number(data.scores.pronunciation) +
                Number(data.scores.content) +
                Number(data.scores.com);

            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.topic}</td>
                <td>${data.scores.fluency}</td>
                <td>${data.scores.language}</td>
                <td>${data.scores.pronunciation}</td>
                <td>${data.scores.content}</td>
                <td>${data.scores.com}</td>
                <td>${total}</td>
            `;

            tbody.appendChild(row);

        } catch (err) {
            console.error("Error loading:", file.name);
        }
    }
}

loadData();