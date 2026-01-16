import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    language: string;
    code: string;
    onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, onChange }) => {
    return (
        <div className="h-full w-full overflow-hidden">
            <Editor
                height="100%"
                language={language === 'c++' ? 'cpp' : language}
                value={code}
                theme="vs-dark"
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
