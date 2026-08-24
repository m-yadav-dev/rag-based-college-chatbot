import React, { useState } from 'react';
import { UploadCloud, FileText, Trash2, Loader2, ExternalLink } from 'lucide-react';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Please upload a valid PDF document.');
            setFile(null);
        } else {
            setError('');
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !file) {
            setError('Both title and a PDF file are required.');
            return;
        }

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        try {
            // Note: The actual API call is stubbed out for Day 3 scaffolding.
            // const response = await fetch('/api/documents/upload', {
            //     method: 'POST',
            //     headers: { Authorization: `Bearer ${token}` }, // Browser auto-sets multipart/form-data
            //     body: formData
            // });
            
            // Simulating API upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Stubbed successful response mock
            const newDoc = {
                _id: Math.random().toString(36).substr(2, 9),
                title,
                cloudinaryUrl: '#',
                createdAt: new Date().toISOString(),
            };
            
            setDocuments(prev => [newDoc, ...prev]);
            setTitle('');
            setFile(null);
            // Reset file input element explicitly if needed using a ref
            
        } catch (err) {
            setError(err.message || 'Failed to upload document.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Knowledge Base Management</h1>
                <p className="text-gray-600 mt-2">Upload and manage institutional documents for the AI chatbot.</p>
            </header>

            {/* Upload Section */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-indigo-600" />
                    Upload New Document
                </h2>
                
                <form onSubmit={handleUpload} className="space-y-4 max-w-2xl">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Computer Science Syllabus 2026"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            disabled={isUploading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                            disabled={isUploading}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isUploading || !title || !file}
                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading & Processing...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-4 h-4" />
                                Upload Document
                            </>
                        )}
                    </button>
                </form>
            </section>

            {/* Document Table Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Indexed Documents
                    </h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium border-b border-gray-100">Document Title</th>
                                <th className="px-6 py-4 font-medium border-b border-gray-100">Upload Date</th>
                                <th className="px-6 py-4 font-medium border-b border-gray-100">Status</th>
                                <th className="px-6 py-4 font-medium border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No documents found. Upload a PDF to populate the knowledge base.
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-900">{doc.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Indexed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <a 
                                                    href={doc.cloudinaryUrl} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                    title="View Document"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                                <button 
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete Document"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default DocumentManager;
