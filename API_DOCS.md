# Master Prompt Editor API Documentation

## Base URL
```
http://localhost:3001/api
```

## Core Endpoints

### Health Check
- **GET** `/health` - Check API health status

### Prompt Management

#### List Prompts
- **GET** `/prompts`
- **Response**: Array of prompt objects

#### Get Prompt
- **GET** `/prompts/{id}`
- **Response**: Single prompt object

#### Get Enhanced Prompt
- **GET** `/prompts/{id}/enhanced`
- **Response**: Prompt with collaboration summary and bias analysis

#### Create Prompt
- **POST** `/prompts`
- **Body**:
```json
{
  "name": "string",
  "description": "string", 
  "content": "string",
  "tags": ["string"],
  "modalityType": "text|text-image|text-audio|multimodal"
}
```

## Collaboration API

### Voting

#### Vote on Prompt
- **POST** `/collaboration/prompts/{promptId}/vote`
- **Body**:
```json
{
  "userId": "string",
  "voteType": "up|down"
}
```

#### Get Votes
- **GET** `/collaboration/prompts/{promptId}/votes`
- **Response**: Vote summary and individual votes

### Comments

#### Add Comment
- **POST** `/collaboration/prompts/{promptId}/comments`
- **Body**:
```json
{
  "userId": "string",
  "content": "string",
  "parentCommentId": "string" // optional
}
```

#### Get Comments
- **GET** `/collaboration/prompts/{promptId}/comments`
- **Response**: Array of comment objects

### Shared Libraries

#### Create Library
- **POST** `/collaboration/libraries`
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "ownerId": "string",
  "isPublic": boolean
}
```

#### Get Libraries
- **GET** `/collaboration/libraries?userId={userId}`
- **Response**: Array of accessible libraries

## Evaluation API (Mirascope-inspired)

### Evaluate Prompt
- **POST** `/evaluation/prompts/{promptId}/evaluate`
- **Body**:
```json
{
  "version": "string",
  "content": "string", 
  "evaluationType": "performance|cost|bias|quality"
}
```

### Get Evaluations
- **GET** `/evaluation/prompts/{promptId}/evaluations`
- **Response**: Array of evaluation results

### Compare Versions
- **POST** `/evaluation/prompts/{promptId}/compare-versions`
- **Body**:
```json
{
  "version1": "string",
  "version2": "string"
}
```

### A/B Test
- **POST** `/evaluation/prompts/{promptId}/ab-test`
- **Body**:
```json
{
  "versionA": "string",
  "versionB": "string",
  "evaluationType": "performance|cost|bias|quality"
}
```

### Cost Analytics
- **GET** `/evaluation/prompts/{promptId}/cost-analytics`
- **Response**: Cost breakdown and analytics

## Responsible AI API

### Detect Bias
- **POST** `/responsible-ai/detect-bias`
- **Body**:
```json
{
  "promptContent": "string"
}
```
- **Response**: Bias detection results with categories and suggestions

### Validate Ethics
- **POST** `/responsible-ai/validate-ethics`
- **Body**:
```json
{
  "promptContent": "string",
  "templateId": "string" // optional
}
```

### Ethical Templates

#### Get Templates
- **GET** `/responsible-ai/ethical-templates`
- **Response**: Array of ethical template objects

#### Get Template
- **GET** `/responsible-ai/ethical-templates/{templateId}`
- **Response**: Single ethical template

#### Create Template
- **POST** `/responsible-ai/ethical-templates`
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "template": "string",
  "ethicalGuidelines": ["string"],
  "tags": ["string"]
}
```

#### Apply Template
- **POST** `/responsible-ai/ethical-templates/{templateId}/apply`
- **Body**:
```json
{
  "variables": {
    "key": "value"
  }
}
```

### Comprehensive Analysis
- **POST** `/responsible-ai/analyze-prompt`
- **Body**:
```json
{
  "promptContent": "string",
  "templateId": "string" // optional
}
```
- **Response**: Combined bias and ethics analysis

## Multimodal API

### Upload Media
- **POST** `/multimodal/media/upload`
- **Body**:
```json
{
  "type": "image|audio|video",
  "mimeType": "string",
  "metadata": {}
}
```

### Process Multimodal Content
- **POST** `/multimodal/process`
- **Body**:
```json
{
  "textContent": "string",
  "mediaInputs": [
    {
      "id": "string",
      "type": "image|audio|video",
      "url": "string",
      "mimeType": "string",
      "size": number
    }
  ],
  "processingOptions": {
    "imageAnalysis": boolean,
    "audioTranscription": boolean, 
    "multimodalFusion": boolean
  }
}
```

### Generate Template
- **POST** `/multimodal/templates/generate`
- **Body**:
```json
{
  "modalityTypes": ["text", "image", "audio"],
  "useCase": "string"
}
```

### Get Capabilities
- **GET** `/multimodal/capabilities`
- **Response**: Supported formats, file sizes, and analysis types

### Validate Inputs
- **POST** `/multimodal/validate-inputs`
- **Body**:
```json
{
  "mediaInputs": [...]
}
```

## Data Types

### Prompt Object
```json
{
  "id": "string",
  "name": "string", 
  "description": "string",
  "content": "string",
  "tags": ["string"],
  "version": "string",
  "versions": [],
  "modalityType": "text|text-image|text-audio|multimodal",
  "isShared": boolean,
  "votes": [],
  "comments": [],
  "ethicalTags": ["string"],
  "biasDetectionResult": {}
}
```

### Vote Object
```json
{
  "id": "string",
  "promptId": "string",
  "userId": "string", 
  "voteType": "up|down",
  "createdAt": "string"
}
```

### Comment Object
```json
{
  "id": "string",
  "promptId": "string",
  "userId": "string",
  "content": "string", 
  "createdAt": "string",
  "parentCommentId": "string",
  "annotations": []
}
```

### Bias Detection Result
```json
{
  "overallScore": number,
  "categories": [
    {
      "type": "gender|race|age|religion|socioeconomic|other",
      "score": number,
      "evidence": ["string"]
    }
  ],
  "suggestions": ["string"],
  "detectedAt": "string"
}
```

### Evaluation Result
```json
{
  "id": "string",
  "promptId": "string",
  "version": "string",
  "evaluationType": "performance|cost|bias|quality",
  "score": number,
  "metadata": {},
  "createdAt": "string"
}
```

## Error Responses

All endpoints return errors in the following format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- **200**: Success
- **201**: Created 
- **400**: Bad Request
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Authentication

Currently, the API uses a simple userId-based system. In production, implement proper authentication and authorization.

## Rate Limiting

No rate limiting is currently implemented. Consider adding rate limiting for production use.

## Examples

### Create and Analyze a Prompt
```bash
# Create prompt
curl -X POST http://localhost:3001/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Prompt",
    "description": "A test prompt",  
    "content": "Please help me with testing",
    "tags": ["test"],
    "modalityType": "text"
  }'

# Analyze for bias
curl -X POST http://localhost:3001/api/responsible-ai/analyze-prompt \
  -H "Content-Type: application/json" \
  -d '{
    "promptContent": "Please help me with testing"
  }'
```

### Vote and Comment
```bash
# Vote on prompt
curl -X POST http://localhost:3001/api/collaboration/prompts/prompt_123/vote \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user1",
    "voteType": "up"
  }'

# Add comment
curl -X POST http://localhost:3001/api/collaboration/prompts/prompt_123/comments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user1", 
    "content": "Great prompt!"
  }'
```