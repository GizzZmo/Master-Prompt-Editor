import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { MultimodalInput as MultimodalInputType } from '../../../types/ai';

interface MultimodalInputProps {
  currentInput: MultimodalInputType;
  onInputChange: (input: MultimodalInputType) => void;
}

const MultimodalInput: React.FC<MultimodalInputProps> = ({ currentInput, onInputChange }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange({ ...currentInput, text: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onInputChange({ ...currentInput, [type]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="text-input">Text Input:</label>
        <textarea
          id="text-input"
          value={currentInput.text || ''}
          onChange={handleTextChange}
          rows={5}
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Enter text here... (e.g., description for image generation)"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="image-input">Image Input (Upload or URL):</label>
        <Input type="file" id="image-input" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
        {currentInput.image && <img src={currentInput.image} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="audio-input">Audio Input (Upload or URL):</label>
        <Input type="file" id="audio-input" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} />
        {currentInput.audio && <audio controls src={currentInput.audio} style={{ width: '100%', marginTop: '10px' }} />}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="video-input">Video Input (Upload or URL):</label>
        <Input type="file" id="video-input" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
        {currentInput.video && <video controls src={currentInput.video} style={{ maxWidth: '200px', maxHeight: '150px', marginTop: '10px' }} />}
      </div>

      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
        This component enables the system to process diverse inputs simultaneously, including text, images, audio, and video, to generate contextually aware and human-like outputs. (Section 3.1)
      </p>
    </div>
  );
};

export default MultimodalInput;
