import React, { useState, useCallback, useRef } from 'react';
import { InputMode } from '../types';
import { Spinner } from './Spinner';

interface InputAreaProps {
  onAssess: (mode: InputMode, value: string) => void;
  isLoading: boolean;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          active
            ? 'bg-indigo-600 text-white shadow'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {children}
      </button>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onAssess, isLoading }) => {
    const [activeTab, setActiveTab] = useState<InputMode>('url');
    const [url, setUrl] = useState('');
    const [pastedText, setPastedText] = useState('');
    const [fileText, setFileText] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFileError(null);
        setFileText(null);
        setIsParsing(true);

        try {
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension === 'pdf') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
                    const pdf = await (window as any).pdfjsLib.getDocument(typedArray).promise;
                    let textContent = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        textContent += content.items.map((item: any) => item.str).join(' ');
                    }
                    setFileText(textContent);
                };
                reader.readAsArrayBuffer(file);
            } else if (extension === 'docx') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
                    setFileText(result.value);
                };
                reader.readAsArrayBuffer(file);
            } else {
                setFileError('Unsupported file type. Please upload a PDF or DOCX file.');
                setFileName(null);
            }
        } catch (err) {
            console.error("File parsing error:", err);
            setFileError("Could not read text from the file.");
            setFileName(null);
        } finally {
            setIsParsing(false);
        }
    }, []);

    const handleSubmit = () => {
        if (activeTab === 'url') {
            onAssess('url', url);
        } else if (activeTab === 'file') {
            onAssess('file', fileText || '');
        } else {
            onAssess('text', pastedText);
        }
    };

    const isSubmitDisabled = isLoading || isParsing || (activeTab === 'url' && !url) || (activeTab === 'file' && !fileText) || (activeTab === 'text' && !pastedText);

    return (
        <div className="space-y-6">
            <div className="flex justify-center space-x-2 p-1 bg-gray-100 rounded-lg">
                <TabButton active={activeTab === 'url'} onClick={() => setActiveTab('url')}>URL</TabButton>
                <TabButton active={activeTab === 'file'} onClick={() => setActiveTab('file')}>File Upload</TabButton>
                <TabButton active={activeTab === 'text'} onClick={() => setActiveTab('text')}>Paste Text</TabButton>
            </div>
            
            <div className="transition-all duration-300">
                {activeTab === 'url' && (
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                )}
                {activeTab === 'file' && (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" className="hidden"/>
                        <button onClick={() => fileInputRef.current?.click()} disabled={isParsing} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-wait">
                            Select PDF or DOCX file
                        </button>
                        {isParsing && <div className="mt-4 flex items-center justify-center"><Spinner className="text-indigo-600" /> <p className="text-sm text-gray-500 ml-2">Parsing file...</p></div>}
                        {fileName && !isParsing && <p className="mt-4 text-sm text-gray-600">Selected: <strong>{fileName}</strong></p>}
                        {fileText && !isParsing && <p className="mt-2 text-sm text-green-600">✓ File processed successfully.</p>}
                        {fileError && <p className="mt-4 text-sm text-red-600">{fileError}</p>}
                    </div>
                )}
                {activeTab === 'text' && (
                    <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        placeholder="Paste the text you want to analyze here..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                )}
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
                {isLoading ? <><Spinner className="-ml-1 mr-3 text-white" /> Analyzing...</> : 'Assess for P-Value Misuse'}
            </button>
        </div>
    );
};