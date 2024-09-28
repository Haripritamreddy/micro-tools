// src/app/tools/image/resize-image/page.tsx
'use client';

import { useState } from 'react';
import './../../tool.css'; // Import the CSS file
import JSZip from 'jszip';

export default function ResizeImage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [width, setWidth] = useState<number>(500); 
  const [height, setHeight] = useState<number>(500); 
  const [widthUnit, setWidthUnit] = useState<'px' | 'cm'>('px'); 
  const [heightUnit, setHeightUnit] = useState<'px' | 'cm'>('px'); 
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

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(parseInt(e.target.value, 10) || 0);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(parseInt(e.target.value, 10) || 0);
  };

  const handleWidthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWidthUnit(e.target.value as 'px' | 'cm');
  };

  const handleHeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHeightUnit(e.target.value as 'px' | 'cm');
  };

  const handleResize = () => {
    if (!selectedFiles) return;

    if (selectedFiles.length === 1) {
      const file = selectedFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const resizedUrl = canvas.toDataURL(file.type);
            const link = document.createElement('a');
            link.download = file.name.replace(/\.[^/.]+$/, '_resized.jpg');
            link.href = resizedUrl;
            link.click();
          }
        };
      };
    } else {
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
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const resizedUrl = canvas.toDataURL(file.type);
                zip.file(file.name.replace(/\.[^/.]+$/, '_resized.jpg'), resizedUrl.split(',')[1], { base64: true });
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
          link.download = 'resized_images.zip';
          link.click();
        });
      });
    }
  };

  const handleDeleteFile = (index: number) => {
    if (selectedFiles) {
      const updatedFiles = Array.from(selectedFiles).filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      setSelectedFiles(dataTransfer.files);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Image Resizer</h1>

      <div
        className={`file-drop-area ${isDragging ? 'highlight' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="file-input"
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <p>Drag and Drop your images here or </p>
          <p>click to browse.</p>
        </label>
      </div>

      {selectedFiles && (
        <div className="selected-files mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
          <ul>
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <button onClick={() => handleDeleteFile(index)}>&times;</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <div className="mb-2">
          <label
            htmlFor="width"
            className="block text-sm font-medium text-gray-700"
          >
            Width:
          </label>
          <div className="flex">
            <select
              id="widthUnit"
              value={widthUnit}
              onChange={handleWidthUnitChange}
              className="mr-2 p-2 border rounded-md w-20"
            >
              <option value="px">px</option>
              <option value="cm">cm</option>
            </select>
            <input
              type="number"
              id="width"
              value={width}
              onChange={handleWidthChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="height"
            className="block text-sm font-medium text-gray-700"
          >
            Height:
          </label>
          <div className="flex">
            <select
              id="heightUnit"
              value={heightUnit}
              onChange={handleHeightUnitChange}
              className="mr-2 p-2 border rounded-md w-20"
            >
              <option value="px">px</option>
              <option value="cm">cm</option>
            </select>
            <input
              type="number"
              id="height"
              value={height}
              onChange={handleHeightChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          className="convert-button"
          onClick={handleResize}
          disabled={!selectedFiles}
        >
          Resize
        </button>
      </div>
    </div>
  );
}