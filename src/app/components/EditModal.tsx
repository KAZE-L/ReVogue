'use client';

import React from 'react';
import Image from "next/image";

interface EditModalProps {
  title: string;
  description: string;
  options: string[];
  currentValue: string;
  onCancel: () => void;
  onSave: (value: string) => void;
}

export default function EditModal({
  title,
  description,
  options,
  currentValue,
  onCancel,
  onSave,
}: EditModalProps) {
  const [selectedValue, setSelectedValue] = React.useState(currentValue);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-star-container">
            <Image 
              src="/star.svg" 
              alt="star" 
              width={20} 
              height={20} 
              className="modal-star"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none'; // 加載失敗時隱藏
              }}
            />
          </div>
          <h2 className="modal-title">{title}</h2>
        </div>
        
        <p className="modal-description">{description}</p>
        
        <div className="modal-options">
          {options.map((option) => (
            <button
              key={option}
              className={`modal-option ${selectedValue === option ? 'selected' : ''}`}
              onClick={() => setSelectedValue(option)}
              type="button" // 避免表單提交行為
            >
              {option}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel} type="button">取消</button>
          <button className="modal-save" onClick={() => onSave(selectedValue)} type="button">儲存</button>
        </div>
      </div>
    </div>
  );
}