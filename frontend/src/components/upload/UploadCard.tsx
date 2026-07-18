import React, { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onFileSelect,
  maxSizeMB = 10,
  acceptedTypes = ['.pdf', '.txt', '.doc', '.docx', '.pptx'],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    
    // Check file size limits
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCardClick}
        className={cn(
          'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 select-none group',
          isDragOver
            ? 'border-violet-500 bg-violet-600/5'
            : 'border-slate-700 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50'
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedTypes.join(',')}
          className="hidden"
        />

        <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-violet-400 mb-3 transition-colors" />
        
        <p className="text-sm font-semibold text-slate-200 mb-1">
          Drag & drop your files here, or <span className="text-violet-400 group-hover:underline">browse</span>
        </p>
        
        <p className="text-xs text-slate-500 text-center">
          Supports: {acceptedTypes.join(', ')} (Max {maxSizeMB}MB)
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-xs text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
// Standard exports
