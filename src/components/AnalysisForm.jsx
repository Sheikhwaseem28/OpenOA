import React, { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const AnalysisForm = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setResult(null);
        }
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            setResult({ error: "Upload failed. Please check your connection." });
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 sm:p-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-900">Analysis Dashboard</h2>
                    <p className="mt-2 text-slate-600">Upload your wind plant data to generate a comprehensive report.</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div
                        className={clsx(
                            "relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer overflow-hidden group",
                            dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400",
                            file && "border-blue-500 bg-blue-50/30"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleFileChange}
                        />

                        <div className="text-center p-6 pointer-events-none">
                            {file ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="bg-blue-100 p-4 rounded-full mb-3 text-blue-600">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-900">{file.name}</p>
                                    <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                    <p className="text-xs text-blue-600 mt-4 font-medium">Click or Drag to replace</p>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="bg-slate-200 p-4 rounded-full mb-3 text-slate-500 group-hover:scale-110 transition-transform duration-200">
                                        <UploadCloud className="h-8 w-8" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-900">
                                        <span className="text-blue-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">CSV, JSON, or Excel files supported</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={clsx(
                                "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-blue-200 transition-all",
                                !file || loading
                                    ? "bg-slate-300 cursor-not-allowed shadow-none"
                                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
                            )}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing Data...
                                </>
                            ) : (
                                <>
                                    Run Analysis
                                    <ArrowIcon />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50"
                    >
                        <div className="p-8 sm:p-12 max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 mb-6">
                                {result.error ? (
                                    <AlertCircle className="h-6 w-6 text-red-500" />
                                ) : (
                                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                                )}
                                <h3 className="text-xl font-bold text-slate-900">
                                    {result.error ? "Analysis Failed" : "Analysis Complete"}
                                </h3>
                            </div>

                            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto shadow-inner text-slate-200 font-mono text-sm leading-relaxed">
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default AnalysisForm;
