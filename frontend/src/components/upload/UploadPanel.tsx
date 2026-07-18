import React from 'react';
import { useChat } from '../../hooks/useChat';
import UploadCard from './UploadCard';
import { FileText, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/helpers';

export const UploadPanel: React.FC = () => {
  const { documents, uploadFile } = useChat();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Upload trigger section */}
      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-3">Upload Academic Files</h2>
        <UploadCard onFileSelect={uploadFile} />
      </div>

      {/* Uploaded Documents List */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Knowledge Base Documents ({documents.length})
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {documents.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No documents indexed yet.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3.5 bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all duration-150"
              >
                <div className="flex-shrink-0 p-2 bg-slate-800 border border-slate-700 rounded-lg text-violet-400">
                  <FileText className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate mb-0.5" title={doc.name}>
                    {doc.name}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{formatBytes(doc.size)}</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>

                  {/* Progress bar for upload simulation */}
                  {doc.status === 'uploading' && doc.progress !== undefined && (
                    <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${doc.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0" title={`Status: ${doc.status}`}>
                  {getStatusIcon(doc.status)}
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
