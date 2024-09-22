//src/app/tools/image/jpeg-to-png/page.tsx
'use client';

import { useState } from 'react';
import JSZip from 'jszip'; // Import JSZip
import './../../tool.css'; // Import the CSS file

export default function JpegToPng() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedFiles) {
        const existingFiles = Array.from(selectedFiles);
        const dataTransfer = new DataTransfer();
        [...existingFiles, ...newFiles].forEach((file) => dataTransfer.items.add(file));
        setSelectedFiles(dataTransfer.files);
      } else {
        setSelectedFiles(e.target.files);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (selectedFiles) {
        const existingFiles = Array.from(selectedFiles);
        const dataTransfer = new DataTransfer();
        [...existingFiles, ...newFiles].forEach((file) => dataTransfer.items.add(file));
        setSelectedFiles(dataTransfer.files);
      } else {
        setSelectedFiles(e.dataTransfer.files);
      }
    }
  };

  const handleConvert = () => {
    if (!selectedFiles) return;

    if (selectedFiles.length === 1) {
      // Single file conversion
      const file = selectedFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL('image/png');
            // Trigger download
            const link = document.createElement('a');
            link.download = file.name.replace('.jpeg', '.png'); 
            link.href = pngUrl;
            link.click();
          }
        };
      };
    } else {
      // Multiple files conversion
      const zip = new JSZip();
      const promises = Array.from(selectedFiles).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                const jpegUrl = canvas.toDataURL('image/png');
                zip.file(file.name.replace('.jpeg', '.png'), jpegUrl.split(',')[1], { base64: true });
                resolve(null);
              }
            };
          };
        });
      });

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = 'converted_images.zip';
          link.click();
        });
      });
    }
  };

  const handleDeleteFile = (index: number) => {
    if (selectedFiles) {
      const updatedFiles = Array.from(selectedFiles).filter((_, i) => i !== index);
      // Create a new FileList using a DataTransfer object
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      setSelectedFiles(dataTransfer.files);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">JPEG to PNG Converter</h1>

      {/* File Drop Area */}
      <div 
        className={`file-drop-area ${isDragging ? 'highlight' : ''}`} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/jpeg" 
          multiple 
          onChange={handleFileChange} 
          className="file-input" 
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <p>Drag and Drop your JPEG files here or </p> 
          <p>click to browse.</p>
        </label>
      </div>

      {/* Display Selected Files (if any) */}
      {selectedFiles && (
        <div className="selected-files mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
          <ul>
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index} className="flex items-center justify-between"> 
                <span>{file.name}</span>
                <button onClick={() => handleDeleteFile(index)}>&times;</button> {/* Delete icon */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Convert Button */}
      <div className="text-center"> 
        <button 
          className="convert-button" 
          onClick={handleConvert} 
          disabled={!selectedFiles}
        >
          Convert
        </button>
      </div>
    </div>
  );
}