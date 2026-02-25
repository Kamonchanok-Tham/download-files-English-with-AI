 const MAX_FILE_SIZE = 2.5 * 1024 * 1024;
 //show fileName of 1 file
    function showFileNameOneFile() {
        const fileInput = document.getElementById("file");
        const fileName = document.getElementById("fileName");

        if (fileInput.files.length > 0) {
            fileName.textContent = fileInput.files[0].name;
        } else {
            fileName.textContent = "undefined";
        }
    }
    function showFileNameTwoFiles(inputId, nameId) {
        const fileInput = document.getElementById(inputId);
        const fileName = document.getElementById(nameId);

        if (fileInput.files.length > 0) {
            fileName.textContent = fileInput.files[0].name;
        } else {
            fileName.textContent = "Select your file (1 file)";
        }
    }
    //phase 1
    async function uploadPhase1() {
        const fileInput = document.getElementById("file");
        if (!fileInput.files.length) {
            alert("select your file");
            return;
        }
        const file = fileInput.files[0];
        if (file.size > MAX_FILE_SIZE) {
            alert("The file size must not exceed 10 MB.");
            fileInput.value = "";
            fileName.textContent = "Select your file(1 file)"
            return;
        }
        const originalFile = fileInput.files[0];
        const name = originalFile.name.substring(0, originalFile.name.lastIndexOf("."));
        const ext = originalFile.name.substring(originalFile.name.lastIndexOf("."));
        const newFileName = `${name}_Baseline${ext}`;

        const renamedFile = new File([originalFile], newFileName, {
            type: originalFile.type,
        });
        const formData = new FormData();
        formData.append("file", renamedFile);

        const res = await fetch("https://tiny-darkness-94e3.kamonchanok-10292.workers.dev/", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Uploaded as:", newFileName);

        // รีเซ็ตหลังอัปโหลด
        fileInput.value = "";
        fileName.textContent = "Select your file (1 file)";

    }
    //Phase2
    async function uploadPhase2() {
        const fileScript = document.getElementById("fileScript");
        const fileChat = document.getElementById("fileChat");

        if (!fileScript.files.length || !fileChat.files.length) {
            alert("Please select both files.");
            return;
        }
        const files = [
            { input: fileScript, suffix: "_ScriptPhase2" },
            { input: fileChat, suffix: "_ChatPhase2" }
        ];
        for (let item of files) {
            const originalFile = item.input.files[0];

            if (originalFile.size > MAX_FILE_SIZE) {
                alert("The file size must not exceed 2.5 MB.");
                return;
            }

            const name = originalFile.name.substring(0, originalFile.name.lastIndexOf("."));
            const ext = originalFile.name.substring(originalFile.name.lastIndexOf("."));
            const newFileName = `${name}${item.suffix}${ext}`;

            const renamedFile = new File([originalFile], newFileName, {
                type: originalFile.type,
            });

            const formData = new FormData();
            formData.append("file", renamedFile);

            await fetch("https://tiny-darkness-94e3.kamonchanok-10292.workers.dev/", {
                method: "POST",
                body: formData,
            });

            console.log("Uploaded:", newFileName);
        }

        alert("Both files uploaded successfully!");
        // รีเซ็ตหลังอัปโหลด
        fileScript.value = "";
        fileChat.value = "";
        document.getElementById("fileNameScript").textContent = "Select your file (1 file)";
        document.getElementById("fileNameChat").textContent = "Select your file (1 file)";

    }