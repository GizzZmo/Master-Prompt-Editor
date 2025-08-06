#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
const API_BASE_URL = process.env.MPE_API_URL || 'http://localhost:3001/api';

// Main CLI program
program
  .name('mpe')
  .description('Master Prompt Editor CLI - Advanced prompt management and AI toolkit')
  .version('1.0.0');

// Prompt management commands
const promptCmd = program.command('prompt').description('Manage prompts');

promptCmd
  .command('create')
  .description('Create a new prompt')
  .option('-n, --name <name>', 'Prompt name')
  .option('-d, --description <description>', 'Prompt description')
  .option('-c, --content <content>', 'Prompt content')
  .option('-t, --tags <tags>', 'Comma-separated tags')
  .option('-m, --modality <type>', 'Modality type (text, text-image, text-audio, multimodal)', 'text')
  .action(async (options) => {
    try {
      const promptData = {
        name: options.name || 'Untitled Prompt',
        description: options.description || '',
        content: options.content || '',
        tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [],
        modalityType: options.modality,
      };

      const response = await axios.post(`${API_BASE_URL}/prompts`, promptData);
      console.log('✅ Prompt created successfully:');
      console.log(`ID: ${response.data.id}`);
      console.log(`Name: ${response.data.name}`);
      console.log(`Version: ${response.data.version}`);
    } catch (error) {
      console.error('❌ Failed to create prompt:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

promptCmd
  .command('list')
  .description('List all prompts')
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prompts`);
      if (response.data.length === 0) {
        console.log('📝 No prompts found');
        return;
      }
      
      console.log('📋 Available prompts:');
      response.data.forEach((prompt: any) => {
        console.log(`  ${prompt.id} - ${prompt.name} (v${prompt.version})`);
        console.log(`    ${prompt.description}`);
        console.log(`    Tags: ${prompt.tags.join(', ')}`);
        console.log(`    Modality: ${prompt.modalityType}`);
        console.log('');
      });
    } catch (error) {
      console.error('❌ Failed to list prompts:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

promptCmd
  .command('analyze <promptId>')
  .description('Run responsible AI analysis on a prompt')
  .action(async (promptId) => {
    try {
      const promptResponse = await axios.get(`${API_BASE_URL}/prompts/${promptId}`);
      const analysisResponse = await axios.post(`${API_BASE_URL}/responsible-ai/analyze-prompt`, {
        promptContent: promptResponse.data.content
      });

      console.log('🔍 Prompt Analysis Results:');
      console.log(`Overall Assessment: ${analysisResponse.data.overallAssessment.summary}`);
      console.log(`Score: ${(analysisResponse.data.overallAssessment.score * 100).toFixed(1)}%`);
      console.log(`Recommended: ${analysisResponse.data.overallAssessment.isRecommended ? '✅' : '❌'}`);
      
      if (analysisResponse.data.biasDetection.overallScore > 0) {
        console.log('\n🚨 Bias Detection:');
        console.log(`  Overall Score: ${(analysisResponse.data.biasDetection.overallScore * 100).toFixed(1)}%`);
        analysisResponse.data.biasDetection.suggestions.forEach((suggestion: string) => {
          console.log(`  💡 ${suggestion}`);
        });
      }

      if (!analysisResponse.data.ethicsValidation.isEthical) {
        console.log('\n⚠️  Ethical Issues:');
        analysisResponse.data.ethicsValidation.violations.forEach((violation: string) => {
          console.log(`  ⚠️  ${violation}`);
        });
      }
    } catch (error) {
      console.error('❌ Failed to analyze prompt:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

// Evaluation commands (Mirascope-inspired)
const evalCmd = program.command('eval').description('Evaluate prompt performance');

evalCmd
  .command('run <promptId>')
  .description('Run evaluation on a prompt')
  .option('-v, --version <version>', 'Prompt version to evaluate', '1.0')
  .option('-t, --type <type>', 'Evaluation type (performance, cost, bias, quality)', 'performance')
  .action(async (promptId, options) => {
    try {
      const promptResponse = await axios.get(`${API_BASE_URL}/prompts/${promptId}`);
      const evalResponse = await axios.post(`${API_BASE_URL}/evaluation/prompts/${promptId}/evaluate`, {
        version: options.version,
        content: promptResponse.data.content,
        evaluationType: options.type
      });

      console.log('📊 Evaluation Results:');
      console.log(`Type: ${evalResponse.data.evaluationType}`);
      console.log(`Score: ${(evalResponse.data.score * 100).toFixed(1)}%`);
      console.log(`Evaluation ID: ${evalResponse.data.id}`);
      console.log(`Created: ${new Date(evalResponse.data.createdAt).toLocaleString()}`);
    } catch (error) {
      console.error('❌ Failed to evaluate prompt:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

evalCmd
  .command('compare <promptId> <version1> <version2>')
  .description('Compare two prompt versions')
  .action(async (promptId, version1, version2) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/evaluation/prompts/${promptId}/compare-versions`, {
        version1,
        version2
      });

      console.log('⚖️  Version Comparison:');
      console.log(`Version ${version1}: ${(response.data.version1Score * 100).toFixed(1)}%`);
      console.log(`Version ${version2}: ${(response.data.version2Score * 100).toFixed(1)}%`);
      console.log(`Winner: ${response.data.winner}`);
      console.log('\n💡 Recommendations:');
      response.data.improvements.forEach((improvement: string) => {
        console.log(`  • ${improvement}`);
      });
    } catch (error) {
      console.error('❌ Failed to compare versions:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

// Collaboration commands
const collabCmd = program.command('collab').description('Collaboration features');

collabCmd
  .command('vote <promptId>')
  .description('Vote on a prompt')
  .option('-u, --user <userId>', 'User ID', 'cli-user')
  .option('-t, --type <type>', 'Vote type (up, down)', 'up')
  .action(async (promptId, options) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/collaboration/prompts/${promptId}/vote`, {
        userId: options.user,
        voteType: options.type
      });

      console.log('🗳️  Vote recorded successfully!');
      console.log(`Summary: ${response.data.summary.upVotes}👍 ${response.data.summary.downVotes}👎 (Score: ${response.data.summary.score})`);
    } catch (error) {
      console.error('❌ Failed to vote:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

collabCmd
  .command('comment <promptId>')
  .description('Add a comment to a prompt')
  .option('-u, --user <userId>', 'User ID', 'cli-user')
  .option('-c, --content <content>', 'Comment content')
  .action(async (promptId, options) => {
    try {
      if (!options.content) {
        console.error('❌ Comment content is required');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/collaboration/prompts/${promptId}/comments`, {
        userId: options.user,
        content: options.content
      });

      console.log('💬 Comment added successfully!');
      console.log(`ID: ${response.data.id}`);
      console.log(`Created: ${new Date(response.data.createdAt).toLocaleString()}`);
    } catch (error) {
      console.error('❌ Failed to add comment:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

// Multimodal commands
const multiCmd = program.command('multimodal').description('Multimodal prompt features');

multiCmd
  .command('template')
  .description('Generate multimodal template')
  .option('-m, --modalities <types>', 'Comma-separated modality types (text,image,audio)', 'text,image')
  .option('-u, --use-case <case>', 'Use case description', 'general')
  .action(async (options) => {
    try {
      const modalityTypes = options.modalities.split(',').map((t: string) => t.trim());
      const response = await axios.post(`${API_BASE_URL}/multimodal/templates/generate`, {
        modalityTypes,
        useCase: options.useCase
      });

      console.log('🎭 Generated Multimodal Template:');
      console.log(`\nTemplate:\n${response.data.template}`);
      console.log(`\nRequired Inputs: ${response.data.requiredInputs.join(', ')}`);
      console.log(`\nProcessing Steps: ${response.data.processingSteps.join(' → ')}`);
    } catch (error) {
      console.error('❌ Failed to generate template:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

multiCmd
  .command('capabilities')
  .description('Show multimodal processing capabilities')
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/multimodal/capabilities`);
      
      console.log('🔧 Multimodal Processing Capabilities:');
      console.log('\n📁 Supported Formats:');
      Object.entries(response.data.supportedFormats).forEach(([type, formats]) => {
        console.log(`  ${type}: ${(formats as string[]).join(', ')}`);
      });
      
      console.log('\n📏 Max File Sizes:');
      Object.entries(response.data.maxFileSizes).forEach(([type, size]) => {
        const sizeInMB = ((size as number) / (1024 * 1024)).toFixed(1);
        console.log(`  ${type}: ${sizeInMB}MB`);
      });

      console.log('\n🎯 Available Analysis:');
      Object.entries(response.data.availableAnalysis).forEach(([type, analyses]) => {
        console.log(`  ${type}: ${(analyses as string[]).join(', ')}`);
      });
    } catch (error) {
      console.error('❌ Failed to get capabilities:', (error as any).response?.data?.error || (error as Error).message);
    }
  });

// Utility commands
program
  .command('config')
  .description('Show configuration')
  .action(() => {
    console.log('⚙️  Master Prompt Editor Configuration:');
    console.log(`API Base URL: ${API_BASE_URL}`);
    console.log(`CLI Version: 1.0.0`);
  });

program
  .command('health')
  .description('Check API health')
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      console.log('✅ API is healthy:', response.data);
    } catch (error) {
      console.error('❌ API health check failed:', (error as any).response?.data || (error as Error).message);
    }
  });

// Parse command line arguments
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse(process.argv);
}

export { program };