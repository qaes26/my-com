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
            // Direct connection to live Render backend
            const backendUrl = 'https://my-com-1.onrender.com';
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
        <div className="flex flex-col h-[100dvh] bg-vscode-bg text-vscode-text">
            {/* Header */}
            <header className="h-14 md:h-12 bg-vscode-header flex flex-wrap md:flex-nowrap items-center justify-between px-3 md:px-4 border-b border-black shrink-0">
                <div className="flex items-center gap-2.5">
                    {/* UPDATED LOGO: Q++ */}
                    <div className="flex items-center justify-center bg-blue-600 w-8 h-8 rounded-md shadow-lg shadow-blue-500/30">
                        <span className="font-bold text-white text-xs font-mono">Q++</span>
                    </div>
                    <span className="font-semibold text-white tracking-wide text-sm md:text-base hidden xs:block">Online Compiler</span>
                </div>

                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    <div className="flex bg-vscode-activity rounded-md p-1 scale-90 md:scale-100 origin-right">
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
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-1.5 rounded-sm transition-colors text-xs md:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-900/20"
                    >
                        <Play size={14} fill="currentColor" />
                        {loading ? 'Running...' : 'Run'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Editor Section */}
                <section className="flex-1 flex flex-col order-1 md:order-1 h-[60%] md:h-auto border-b md:border-b-0 md:border-r border-black relative">
                    <CodeEditor
                        language={language}
                        code={code}
                        onChange={(val) => setCode(val || '')}
                    />
                </section>

                {/* Terminal Section */}
                <section className="order-2 md:order-2 h-[40%] md:h-full md:w-[40%] bg-vscode-sidebar flex flex-col shadow-inner">
                    <div className="bg-vscode-header px-4 py-2 text-xs font-medium text-gray-400 flex items-center gap-2 border-b border-black shrink-0">
                        <TerminalIcon size={12} />
                        CONSOLE OUTPUT
                    </div>
                    <Terminal output={output} />
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default IDELayout;
