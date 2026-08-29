import { Trash2, ExternalLink, FileText, Pencil } from 'lucide-react'


const DocumentManagerListItems = (props) => {
    const { doc, deleteDocument } = props
    const { createdAt, cloudinaryUrl, title } = doc

    const onClickDelete = () => {
        deleteDocument(doc._id)
    }
    return (
        <>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">{title}</span>
                    
                    <Pencil className="w-4 h-4 cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" title="Edit Document" />
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
                        title="View Document"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Document"
                        onClick={onClickDelete}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </>
    )
}

export default DocumentManagerListItems