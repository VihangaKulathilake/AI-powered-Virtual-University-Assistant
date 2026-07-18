import React from 'react';
import { useChat } from '../../hooks/useChat';
import UploadCard from './UploadCard';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  Trash2,
  FileCode,
  FileSpreadsheet,
  FileIcon
} from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/helpers';

export const UploadPanel: React.FC = () => {
  const { documents, uploadFile, deleteDocument } = useChat();

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-400" />;
    } else if (type.includes('javascript') || type.includes('typescript') || type.includes('json') || type.includes('code')) {
      return <FileCode className="w-5 h-5 text-indigo-400" />;
    } else if (type.includes('excel') || type.includes('sheet') || type.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-450" />;
    }
    return <FileIcon className="w-5 h-5 text-sky-400" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span title="Processing Completed"><CheckCircle className="w-4 h-4 text-emerald-450" /></span>;
      case 'processing':
        return <span title="AI Model Parsing Text"><Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /></span>;
      case 'uploading':
        return <span title="Uploading File to Store"><Loader2 className="w-4 h-4 text-sky-400 animate-spin" /></span>;
      case 'failed':
        return <span title="Upload Failed"><AlertTriangle className="w-4 h-4 text-red-450" /></span>;
      default:
        return <span title="Queued"><Clock className="w-4 h-4 text-slate-500" /></span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full select-none">
      {/* Upload trigger card */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-slate-100 font-outfit">Upload Academic Files</h2>
        <p className="text-xs text-slate-450">Inject specific coursework resources or slides into your assistant's search context.</p>
        <div className="pt-2">
          <UploadCard onFileSelect={uploadFile} />
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="flex-1 flex flex-col min-h-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Indexed Resource Files ({documents.length})
          </h3>
          {documents.length > 0 && (
            <span className="text-[10px] text-slate-550 font-bold uppercase">
              {formatBytes(documents.reduce((acc, curr) => acc + (curr.size || curr.fileSize || 0), 0))} Total
            </span>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {documents.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
              <FileText className="w-8 h-8 text-slate-650 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No resources indexed yet.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id || (doc as any)._id}
                className="flex items-center gap-3.5 p-3.5 bg-slate-900 border border-slate-850 hover:border-slate-800/80 rounded-xl transition-all duration-150 group"
              >
                <div className="flex-shrink-0 p-2 bg-slate-950 border border-slate-850 rounded-lg">
                  {getFileIcon(doc.type || doc.fileType || '')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate mb-0.5" title={doc.name || doc.originalName || ''}>
                    {doc.name || doc.originalName || ''}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[10px] text-slate-550 font-medium">
                    <span>{formatBytes(doc.size || doc.fileSize || 0)}</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploadedAt || doc.uploadDate || '')}</span>
                  </div>

                  {/* Progress bar for upload simulation */}
                  {doc.status === 'uploading' && doc.progress !== undefined && (
                    <div className="w-full bg-slate-950 h-1 rounded-full mt-2 overflow-hidden border border-slate-850">
                      <div
                        className="bg-sky-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${doc.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Badges & Delete Buttons Row */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="group-hover:hidden transition-all">
                    {getStatusIcon(doc.status)}
                  </div>
                  
                  <button
                    onClick={() => deleteDocument(doc.id || (doc as any)._id)}
                    type="button"
                    className="hidden group-hover:flex p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                    title="Remove index resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;
