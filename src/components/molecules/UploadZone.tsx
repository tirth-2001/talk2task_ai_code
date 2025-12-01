import React from 'react'

import clsx from 'clsx'

export interface UploadZoneProps {
  onFileSelect?: (file: File) => void
  accept?: string
  maxSize?: string
  className?: string
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  accept = '.pdf,.docx,.txt',
  maxSize = '10MB',
  className,
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileSelect) {
      onFileSelect(file)
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={clsx(
        'flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-primary transition-colors cursor-pointer',
        className,
      )}
    >
      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
      <p className="text-xs text-gray-500">
        {accept.replace(/\./g, '').toUpperCase()} up to {maxSize}
      </p>
      <input type="file" accept={accept} onChange={handleFileInput} className="hidden" id="file-upload" />
    </div>
  )
}

export default UploadZone
