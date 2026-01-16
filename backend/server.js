const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Temp directory for storing source code
const TEMP_DIR = path.join(__dirname, 'temp_code');
fs.ensureDirSync(TEMP_DIR);

// Direct execution: No Docker startup check needed.
console.log("🚀 Server started. Using Direct Execution (g++/python). Ensure compilers are installed.");

app.post('/execute', async (req, res) => {
    const { language, code } = req.body;

    if (!code) {
        return res.status(400).json({ output: "No code provided." });
    }

    const jobId = uuidv4();
    const jobDir = path.join(TEMP_DIR, jobId);

    try {
        await fs.ensureDir(jobDir);

        let fileName = '';
        let command = '';
        const limit = 5000; // 5 seconds timeout

        if (language === 'cpp') {
            fileName = 'main.cpp';
            const excName = process.platform === 'win32' ? 'main.exe' : './main';
            // Compile then Run
            // Note: On Windows you need MinGW/g++ in PATH. On Render (Linux), g++ is installed via Dockerfile.
            command = `g++ "${fileName}" -o main && ${excName}`;
        } else if (language === 'python') {
            fileName = 'main.py';
            // Use 'python' on Windows, 'python3' on Linux usually.
            const pyCmd = process.platform === 'win32' ? 'python' : 'python3';
            command = `${pyCmd} "${fileName}"`;
        } else {
            return res.status(400).json({ output: "Unsupported language." });
        }

        const filePath = path.join(jobDir, fileName);
        await fs.writeFile(filePath, code);

        // Execute directly with Node.js timeout handling
        exec(command, { cwd: jobDir, timeout: limit }, (error, stdout, stderr) => {
            // Cleanup immediately
            fs.remove(jobDir).catch(() => { });

            if (error) {
                // Handle Timeout
                if (error.killed) {
                    return res.json({ output: "⏱️ Error: Execution Timed Out (Limit: 5s)" });
                }

                // Handle Compilation/Runtime Errors
                const combined = stdout + (stderr ? `\nError:\n${stderr}` : '');
                // Fallback to error message if output is empty
                return res.json({ output: combined || error.message });
            }

            // Success
            res.json({ output: stdout + (stderr ? `\nDebug:\n${stderr}` : '') });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ output: "Internal Server Error" });
        fs.remove(jobDir).catch(() => { });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
