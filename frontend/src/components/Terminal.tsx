import React from 'react';

interface TerminalProps {
    output: string;
}

const Terminal: React.FC<TerminalProps> = ({ output }) => {
    return (
        <div className="h-full bg-vscode-sidebar text-vscode-text font-mono text-sm p-2 overflow-auto whitespace-pre-wrap border-t border-vscode-activity">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Terminal Output</div>
            {output ? (
                <div className="leading-relaxed">{output}</div>
            ) : (
                <div className="text-gray-500 italic">Ready to execute...</div>
            )}
        </div>
    );
};

export default Terminal;
