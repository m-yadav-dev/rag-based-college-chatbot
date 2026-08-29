import React, { useState } from 'react';
import { Trash2, ExternalLink, FileText, Pencil, Check, X } from 'lucide-react';
import { useDocumentStore } from '../../stores/useDocumentStore';

const DocumentItem = ({ doc }) => {
    const { _id, createdAt, cloudinaryUrl, title } = doc;
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    
    const removeDocument = useDocumentStore((state) => state.removeDocument);
    const renameDocument = useDocumentStore((state) => state.renameDocument);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this document? This will also remove it from the AI knowledge base.')) {
            removeDocument(_id);
        }
    };

    const handleRename = async () => {
        if (editTitle.trim() === '' || editTitle === title) {
            setIsEditing(false);
            setEditTitle(title);
            return;
        }
        try {
            await renameDocument(_id, editTitle);
            setIsEditing(false);
        } catch (error) {
            console.error('Rename failed', error);
            setEditTitle(title);
        }
    };

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileText className="w-4 h-4" />
                    </div>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500 w-full max-w-[200px]"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                autoFocus
                            />
                            <Check 
                                className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-800 transition-colors" 
                                onClick={handleRename} 
                            />
                            <X 
                                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors" 
                                onClick={() => { setIsEditing(false); setEditTitle(title); }} 
                            />
                        </div>
                    ) : (
                        <>
                            <span className="font-medium text-gray-900">{title}</span>
                            <Pencil 
                                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" 
                                title="Rename Document" 
                                onClick={() => setIsEditing(true)}
                            />
                        </>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-gray-600">
                {new Date(createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Indexed
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                    <a
                        href={cloudinaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View Original PDF"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Document & Vectors"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default DocumentItem;
