import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Button from '../../components/common/Button';
import TextInput from '../../components/forms/TextInput';
import FileInput from '../../components/forms/FileInput';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const fetchDocuments = async () => {
        try {
            const { data } = await axios.get('/api/documents');
            setDocuments(data);
        } catch (err) {
            console.error('Error fetching documents:', err);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

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
            const { data } = await axios.post('/api/documents/upload', formData);
            
            // Add to UI immediately
            setDocuments(prev => [data.document, ...prev]);
            
            // Reset form
            setTitle('');
            setFile(null);
            
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.errors && Array.isArray(errData.errors)) {
                setError(errData.errors.map(e => e.message).join(', '));
            } else {
                setError(errData?.message || err.message || 'Failed to upload document.');
            }
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
                    
                    <TextInput
                        label="Document Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Computer Science Syllabus 2026"
                        disabled={isUploading}
                    />
                    
                    <FileInput
                        label="PDF File"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    
                    <Button
                        type="submit"
                        disabled={isUploading || !title || !file}
                        isLoading={isUploading}
                        loadingText="Uploading & Processing..."
                        icon={UploadCloud}
                    >
                        Upload Document
                    </Button>
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
