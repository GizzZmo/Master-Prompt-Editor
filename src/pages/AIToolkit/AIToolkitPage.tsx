import React from 'react';
import { MultimodalInput } from './components/MultimodalInput';

// Define a type for the data being handled to avoid 'any'
interface GeneratedContent {
  text?: string;
  imageUrl?: string;
}

export function AIToolkitPage() {
  // FIX: Replaced 'any' with the specific 'GeneratedContent' type.
  const handleGenerate = async (config: GeneratedContent) => {
    console.log("Generating with config:", config);
    // Call your API to generate content
  };

  return (
    <div>
      <h1>AI Toolkit</h1>
      <MultimodalInput onGenerate={handleGenerate} />
    </div>
  );
}
