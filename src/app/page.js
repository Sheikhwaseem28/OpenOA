'use client';
import { useState } from 'react';

export default function Home() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

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
            setResult({ error: "Upload failed" });
        }
        setLoading(false);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold mb-8">OpenOA Web App</h1>

                <div className="flex flex-col gap-4">
                    <input type="file" onChange={handleFileChange} className="border p-2" />
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
                    >
                        {loading ? 'Analyzing...' : 'Upload & Analyze'}
                    </button>

                    {result && (
                        <div className="mt-8 p-4 border rounded bg-gray-100">
                            <h2 className="text-xl font-bold">Results:</h2>
                            <pre>{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
