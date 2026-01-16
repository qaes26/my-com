import React from 'react';
import { Code2, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="h-screen w-full bg-vscode-bg flex flex-col items-center justify-center text-white relative overflow-hidden animate-fade-in">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"></div>
            </div>

            <div className="z-10 flex flex-col items-center text-center px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/50 mb-8 border border-blue-400/20 transform hover:scale-105 transition-transform duration-300">
                    <Code2 size={40} className="text-white" />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Qais Jazi
                    </span>
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-400 mb-2 font-light">
                    قيس الجازي
                </h2>

                <p className="text-gray-500 max-w-md mb-10 text-sm md:text-base leading-relaxed">
                    Professional Online IDE & Compiler for C++ and Python.
                    <br />
                    محرر أكواد احترافي يدعم لغتي C++ وبايثون
                </p>

                <button
                    onClick={onStart}
                    className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-medium text-lg transition-all shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95"
                >
                    <span>Start Coding</span>
                    <span>ابدأ البرمجة</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <footer className="absolute bottom-6 text-gray-600 text-sm">
                © 2026 Developed by Qais Jazi
            </footer>
        </div>
    );
};

export default WelcomeScreen;
