import { generateAIContent } from '../../utils/api'; // Import the new specific API function
import { AIConfig } from '../../types/ai'; // Import AIConfig

// Define a type for the data being handled to avoid 'any'
interface GeneratePayload {
  prompt: string;
  config: AIConfig; // Use AIConfig type
}

export function AIToolkitPage() {
  // FIX: Replaced 'any' with the specific 'GeneratePayload' type.
  const handleGenerate = async (payload: GeneratePayload) => {
    console.log("Generating with payload:", payload);
    try {
      const response = await generateAIContent(payload.prompt, payload.config);
      if (response.success) {
        alert('Content generated successfully! Check console for details.');
        console.log('Generated Content:', response.data);
      } else {
        alert(`Failed to generate content: ${response.error}`);
        console.error('Generation error:', response.error);
      }
    } catch (error) {
      alert('An error occurred during content generation.');
      console.error('Generation API call failed:', error);
    }
  };

  return (
    <div>
      <h1>Advanced AI Toolkit</h1>
      <p>Explore multimodal AI integration, task chaining, and workflow automation.</p>
      {/* Example usage of MultimodalInput - This component would encapsulate the UI for gathering input for `generateAIContent` */}
      {/* For demonstration, we'll provide a simple button here. In a real app, `MultimodalInput` would handle UI. */}
      <button
        onClick={() => handleGenerate({ prompt: 'Generate a creative headline for a tech blog post about AI.', config: { model: 'GPT-4', temperature: 0.7 } })}
        style={{ marginTop: '20px', marginBottom: '20px' }}
      >
        Generate Example AI Content
      </button>
      {/* MultimodalInput could be used for more complex inputs */}
      {/* <MultimodalInput onGenerate={handleGenerate} /> */}
    </div>
  );
}
