import React, { useState, useEffect } from 'react';

interface MultimodalCapabilities {
  supportedFormats: Record<string, string[]>;
  maxFileSizes: Record<string, number>;
  availableAnalysis: Record<string, string[]>;
}

interface MultimodalInputStubProps {
  onInputsChange?: (inputs: any[]) => void;
}

const MultimodalInputStub: React.FC<MultimodalInputStubProps> = ({ onInputsChange }) => {
  const [capabilities, setCapabilities] = useState<MultimodalCapabilities | null>(null);
  const [selectedModalities, setSelectedModalities] = useState<string[]>(['text']);
  const [mockInputs, setMockInputs] = useState<any[]>([]);

  useEffect(() => {
    fetchCapabilities();
  }, []);

  useEffect(() => {
    if (onInputsChange) {
      onInputsChange(mockInputs);
    }
  }, [mockInputs, onInputsChange]);

  const fetchCapabilities = async () => {
    try {
      const response = await fetch('/api/multimodal/capabilities');
      const caps = await response.json();
      setCapabilities(caps);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
    }
  };

  const handleModalityToggle = (modality: string) => {
    setSelectedModalities(prev => {
      const newModalities = prev.includes(modality) 
        ? prev.filter(m => m !== modality)
        : [...prev, modality];
      
      // Update mock inputs based on selected modalities
      const newInputs = newModalities.map(mod => ({
        type: mod,
        id: `mock-${mod}-${Date.now()}`,
        url: `/mock-${mod}.${mod === 'image' ? 'jpg' : mod === 'audio' ? 'mp3' : 'mp4'}`,
        mimeType: mod === 'image' ? 'image/jpeg' : mod === 'audio' ? 'audio/mp3' : 'video/mp4',
        size: mod === 'image' ? 1024 * 1024 : mod === 'audio' ? 2 * 1024 * 1024 : 5 * 1024 * 1024,
      }));
      setMockInputs(newInputs);
      
      return newModalities;
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
  };

  const generateTemplate = async () => {
    try {
      const response = await fetch('/api/multimodal/templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modalityTypes: selectedModalities,
          useCase: 'general-analysis',
        }),
      });
      const template = await response.json();
      
      // Show template in a simple alert for demo purposes
      alert(`Generated Template:\n\n${template.template}\n\nRequired Inputs: ${template.requiredInputs.join(', ')}`);
    } catch (error) {
      console.error('Error generating template:', error);
    }
  };

  return (
    <div className="multimodal-input-stub" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🎭 Multimodal Input Studio
      </h3>

      {/* Modality Selection */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#333', marginBottom: '12px' }}>Select Input Modalities</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {capabilities && Object.keys(capabilities.supportedFormats).map(modality => (
            <label
              key={modality}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: selectedModalities.includes(modality) ? '#4CAF50' : 'white',
                color: selectedModalities.includes(modality) ? 'white' : '#333',
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="checkbox"
                checked={selectedModalities.includes(modality)}
                onChange={() => handleModalityToggle(modality)}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '20px' }}>
                {modality === 'image' ? '🖼️' : modality === 'audio' ? '🎵' : modality === 'video' ? '🎬' : '📝'}
              </span>
              <span style={{ textTransform: 'capitalize' }}>{modality}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Current Inputs Display */}
      {mockInputs.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ color: '#333', marginBottom: '12px' }}>Mock Input Files</h4>
          <div style={{ background: 'white', borderRadius: '8px', padding: '16px' }}>
            {mockInputs.map(input => (
              <div
                key={input.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  marginBottom: '8px',
                  background: '#f8f9fa',
                  borderRadius: '4px',
                }}
              >
                <span style={{ fontSize: '24px' }}>
                  {input.type === 'image' ? '🖼️' : input.type === 'audio' ? '🎵' : '🎬'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    Mock {input.type} file
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {input.mimeType} • {formatFileSize(input.size)}
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 12px',
                    background: '#4CAF50',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  Ready
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capabilities Display */}
      {capabilities && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ color: '#333', marginBottom: '12px' }}>Processing Capabilities</h4>
          <div style={{ background: 'white', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {Object.entries(capabilities.supportedFormats).map(([type, formats]) => (
                <div key={type} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <h5 style={{ 
                    marginBottom: '8px', 
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {type === 'image' ? '🖼️' : type === 'audio' ? '🎵' : '🎬'}
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                  </h5>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    <strong>Formats:</strong> {(formats as string[]).join(', ')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    <strong>Max Size:</strong> {formatFileSize(capabilities.maxFileSizes[type])}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Analysis:</strong> {capabilities.availableAnalysis[type]?.slice(0, 2).join(', ')}
                    {capabilities.availableAnalysis[type]?.length > 2 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div>
        <h4 style={{ color: '#333', marginBottom: '12px' }}>Actions</h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={generateTemplate}
            disabled={selectedModalities.length === 0}
            style={{
              background: selectedModalities.length > 0 ? '#4CAF50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              cursor: selectedModalities.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🎭 Generate Template
          </button>
          
          <div
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📊 Mock Processing Available
          </div>

          <div
            style={{
              padding: '10px 20px',
              background: '#FF9800',
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🔄 Real File Upload Coming Soon
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div 
        style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: '#e3f2fd', 
          borderRadius: '8px',
          border: '1px solid #2196F3'
        }}
      >
        <strong style={{ color: '#1976D2' }}>📝 Note:</strong>
        <span style={{ color: '#1976D2', marginLeft: '8px' }}>
          This is a demo interface showing multimodal capabilities. File upload and processing 
          functionality would be implemented with proper file handling, storage, and AI processing pipelines.
        </span>
      </div>
    </div>
  );
};

export default MultimodalInputStub;