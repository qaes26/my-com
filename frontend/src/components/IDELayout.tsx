import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import Footer from './Footer';
import axios from 'axios';
import { Play, Code2, Terminal as TerminalIcon } from 'lucide-react';

const LANGUAGE_DEFAULTS: Record<string, string> = {
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
    python: `import numpy as np\n\nprint("Hello from Python!")\nprint("NumPy Version:", np.__version__)`
};

const IDELayout: React.FC = () => {
    const [language, setLanguage] = useState<'cpp' | 'python'>('cpp');
    const [code, setCode] = useState<string>(LANGUAGE_DEFAULTS.cpp);
    const [output, setOutput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLanguageChange = (lang: 'cpp' | 'python') => {
        setLanguage(lang);
        setCode(LANGUAGE_DEFAULTS[lang]);
        setOutput('');
    };

    const handleRunCode = async () => {
        setLoading(true);
        setOutput("Running...");
        try {
            // Use environment variable for backend URL or default to localhost
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await axios.post(`${backendUrl}/execute`, {
                language,
                code
            });
            setOutput(response.data.output);
        } catch (error: any) {
            if (error.response && error.response.data) {
                setOutput(error.response.data.output || "Error executing code.");
            } else {
                setOutput("Error: Could not connect to backend server.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-vscode-bg text-vscode-text">
            {/* Header */}
            <header className="h-12 bg-vscode-header flex items-center justify-between px-4 border-b border-black">
                <div className="flex items-center gap-2">
                    <Code2 className="text-vscode-blue" size={20} />
                    <span className="font-semibold text-white tracking-wide">Online IDE</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-vscode-activity rounded-md p-1">
                        <button
                            onClick={() => handleLanguageChange('cpp')}
                            className={`px-3 py-1 text-xs rounded-sm transition-colors ${language === 'cpp' ? 'bg-vscode-blue text-white' : 'hover:text-white'}`}
                        >
                            C++
                        </button>
                        <button
                            onClick={() => handleLanguageChange('python')}
                            className={`px-3 py-1 text-xs rounded-sm transition-colors ${language === 'python' ? 'bg-notebook-orange bg-yellow-600 text-white' : 'hover:text-white'}`}
                        >
                            Python
                        </button>
                    </div>

                    <button
                        onClick={handleRunCode}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-sm transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={14} fill="currentColor" />
                        {loading ? 'Running...' : 'Run Code'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Editor Section */}
                <section className="flex-1 flex flex-col min-h-[50%] md:min-h-0 border-r border-black relative">
                    <CodeEditor
                        language={language}
                        code={code}
                        onChange={(val) => setCode(val || '')}
                    />
                </section>

                {/* Terminal Section */}
                <section className="h-[30%] md:h-full md:w-[40%] bg-vscode-sidebar flex flex-col">
                    <div className="bg-vscode-header px-4 py-2 text-xs font-medium text-gray-400 flex items-center gap-2 border-b border-black">
                        <TerminalIcon size={12} />
                        CONSOLE
                    </div>
                    <Terminal output={output} />
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default IDELayout;
