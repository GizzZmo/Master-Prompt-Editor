# Contributing to Master-Prompt-Editor

Thank you for your interest in contributing! Here are some guidelines to help you get started:

## How to Contribute

- Fork the repository and create your branch from `main`.
- Make your changes and write clear, descriptive commit messages.
- Ensure your code passes existing tests and lints. Add new tests as appropriate.
- Open a pull request with a clear description of what you’ve changed and why.

## Coding Standards

- Use consistent code style (see existing code for reference).
- Prefer TypeScript for new features or enhancements.
- Keep functions and components small and focused.
- Register new AI backends through the pluggable provider registry (`src/utils/providers.ts`) instead of hard-coding API calls.
- Keep the human-in-the-loop safety check intact when adding any feature that can execute code or commands.

## Build, Lint, and Test

- Install dependencies with `npm run install:all`.
- Build shared types first: `npx tsc --build src/types`.
- Run the full build: `npm run build:all`.
- Run linting: `npm run lint:all`.

## Reporting Issues

- Search existing issues before opening a new one.
- Provide detailed steps to reproduce the problem.
- Include screenshots or code snippets if helpful.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Blueprints and Examples

- Starter prompts live in `assets/blueprints/best-practice-prompts.json`. Feel free to add concise, well-tagged blueprints (no secrets, no PII).
- Keep templates reusable by leveraging the variable syntax (`{{variable}}`) supported in the prompt editor preview.

Thank you for helping improve Master-Prompt-Editor!
