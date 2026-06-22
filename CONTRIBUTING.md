# Contributing to Mail Genie

First off, thank you for considering contributing to Mail Genie! It's people like you that make open source such a great community.

## Development Setup

1. Fork and clone the repo.
2. Install dependencies: `npm install --legacy-peer-deps`
3. Run the development server: `npm run dev`

### Project Structure
- `src/main`: Electron main process code (Node.js APIs, persistence, OAuth)
- `src/preload`: Preload scripts and Context Bridge exposure
- `src/renderer`: React UI code (Pages, Components, Stores)
- `src/shared`: Types and constants shared between main and renderer

## How to Contribute

### 1. Reporting Bugs & Requesting Features
If you find a bug or have an idea for a new feature, please open an issue using the provided templates. Provide as much detail as possible to help us reproduce the bug or understand the feature.

### 2. Making Code Changes
We welcome code contributions! Whether you're fixing a bug, adding a new feature, or making any other changes to the codebase:
- Always open an issue first to discuss the changes with the maintainers.
- Ensure changes are well-structured and follow the existing architecture.
- Make your changes and commit them descriptively following conventional commits.

### 3. Submitting a Pull Request
- Create a new branch: `git checkout -b feat/your-feature-name`
- Push your branch to your fork.
- Open a Pull Request using the provided template.
- Once the PR is approved and all tests pass, the maintainer will merge the PR.

## Code of Conduct
Please ensure your interactions in issues and PRs remain respectful and constructive.
