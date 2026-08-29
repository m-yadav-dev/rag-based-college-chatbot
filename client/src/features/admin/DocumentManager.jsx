import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { useDocumentStore } from '../../stores/useDocumentStore';
import Button from '../../components/common/Button';
import TextInput from '../../components/forms/TextInput';
import FileInput from '../../components/forms/FileInput';
import DocumentManagerListItems from './DocumentManagerListItems';

const DocumentManager = () => {
    // Local form state
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [localError, setLocalError] = useState('');

    // Global store subscriptions
    const documents = useDocumentStore((state) => state.documents);
    const isUploading = useDocumentStore((state) => state.isUploading);
    const storeError = useDocumentStore((state) => state.error);
    const loadDocuments = useDocumentStore((state) => state.loadDocuments);
    const addDocument = useDocumentStore((state) => state.addDocument);
    const removeDocument = useDocumentStore((state) => state.removeDocument);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setLocalError('Please upload a valid PDF document.');
            setFile(null);
        } else {
            setLocalError('');
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!title || !file) {
            setLocalError('Both title and a PDF file are required.');
            return;
        }

        try {
            await addDocument(title, file);
            setTitle('');
            setFile(null);
        } catch (err) {
            // Error is handled in store, UI will display storeError
        }
    };

    return (
        <div className="w-full mx-auto p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Knowledge Base Management</h1>
                <p className="text-gray-600 mt-2">Upload and manage institutional documents for the AI chatbot.</p>
            </header>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-indigo-600" />
                    Upload New Document
                </h2>

                <form onSubmit={handleUpload} className="space-y-4 max-w-2xl">
                    {(localError || storeError) && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                            {localError || storeError}
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
                                        <DocumentManagerListItems doc={doc} deleteDocument={removeDocument} />
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
