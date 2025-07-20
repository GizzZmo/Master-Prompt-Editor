import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SettingsPage: React.FC = () => {
  const [modelApiKey, setModelApiKey] = useState('sk-**********');
  const [enableXAI, setEnableXAI] = useState(true);
  const [biasDetectionEnabled, setBiasDetectionEnabled] = useState(true);
  const [dataPrivacyCompliance, setDataPrivacyCompliance] = useState('GDPR, CCPA');

  const handleSaveSettings = () => {
    // TODO: Implement actual settings saving (conceptual)
    console.log('Saving settings:', { modelApiKey, enableXAI, biasDetectionEnabled, dataPrivacyCompliance });
    alert('Settings saved successfully (conceptual).');
  };

  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your AI Orchestrator preferences, API integrations, and responsible AI policies. (Section 4, 5)</p>

      <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white', marginBottom: '20px' }}>
        <h3>General AI Configuration</h3>
        <Input
          label="Default AI Model API Key (e.g., OpenAI, Anthropic):"
          type="password"
          value={modelApiKey}
          onChange={(e) => setModelApiKey(e.target.value)}
          placeholder="Enter your AI model API key"
        />
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Flexible LLM integration allows dynamic selection of the most appropriate model. (Section 3.3)
        </p>
      </div>

      <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white', marginBottom: '20px' }}>
        <h3>Responsible AI & Ethical Considerations</h3>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={enableXAI}
              onChange={(e) => setEnableXAI(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            Enable Explainable AI (XAI) features
          </label>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            Helps users trust the product's capabilities and understand how AI arrived at its output. (Section 4.2)
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={biasDetectionEnabled}
              onChange={(e) => setBiasDetectionEnabled(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            Enable Bias Detection & Mitigation
          </label>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            Conduct algorithmic audits to assess for and mitigate bias. (Section 5.2)
          </p>
        </div>

        <Input
          label="Data Privacy Compliance Standards:"
          value={dataPrivacyCompliance}
          onChange={(e) => setDataPrivacyCompliance(e.target.value)}
          placeholder="e.g., GDPR, CCPA, HIPAA"
        />
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
          Strictly adhere to privacy protocols and relevant regulations. (Section 5.2)
        </p>

        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
          Clear disclosure when content has been AI-generated or AI-edited (e.g., metadata labeling for images). (Section 5.2)
        </p>
      </div>

      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </div>
  );
};

export default SettingsPage;
