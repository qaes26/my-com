const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Temp directory for storing source code
const TEMP_DIR = path.join(__dirname, 'temp_code');
fs.ensureDirSync(TEMP_DIR);

// Check if Docker is available at startup
exec('docker --version', (err) => {
    if (err) {
        console.warn("⚠️  WARNING: Docker is not detected! Code execution will fail until Docker is installed and in your PATH.");
    } else {
        console.log("✅ Docker is detected and ready.");
    }
});

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
        let runCmd = '';
        const timeout = '5s';

        if (language === 'cpp') {
            fileName = 'main.cpp';
            runCmd = `g++ main.cpp -o main && ./main`;
        } else if (language === 'python') {
            fileName = 'main.py';
            runCmd = `python3 main.py`;
        } else {
            return res.status(400).json({ output: "Unsupported language." });
        }

        const filePath = path.join(jobDir, fileName);
        await fs.writeFile(filePath, code);

        let execCmd = '';

        // Check execution mode: 'docker' (default) or 'direct' (for Render/Cloud)
        const isDirectMode = process.env.EXECUTION_MODE === 'direct';

        if (isDirectMode) {
            // Run directly on the server (DANGEROUS if not in a container, but safe-ish inside Render container)
            // Using 'timeout' to prevent infinite loops
            execCmd = `cd "${jobDir}" && timeout ${timeout} ${runCmd}`;
        } else {
            // Run inside a separate Docker container (Sandboxed)
            execCmd = `docker run --rm -v "${jobDir}:/usr/src/app" ide-runner bash -c "timeout ${timeout} ${runCmd}"`;
        }

        exec(execCmd, (error, stdout, stderr) => {
            // Cleanup job directory
            fs.remove(jobDir).catch(err => console.error("Cleanup error:", err));

            if (error) {
                // Check if the error is due to Docker being missing (common on Windows)
                if (error.message.includes("'docker' is not recognized") || error.code === 127) {
                    return res.json({
                        output: "❌ SYSTEM ERROR: Docker is not installed or running.\n\nPlease install Docker Desktop to execute code safely.\nDownload: https://www.docker.com/products/docker-desktop"
                    });
                }

                // If it was a timeout (exit code 124 on linux usually)
                if (error.code === 124) {
                    return res.json({ output: "⏱️ Error: Execution Timed Out (Limit: 5s)" });
                }

                const combinedOutput = stdout + (stderr ? `\nError:\n${stderr}` : '');
                return res.json({ output: combinedOutput || error.message });
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
    console.log(`Backend running on http://localhost:${PORT}`);
});
