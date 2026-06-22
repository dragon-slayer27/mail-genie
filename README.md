# Mail Genie

<p align="center">
  <em>An open-source desktop application that allows you to generate and send emails using AI without opening your email client.</em>
</p>

## Features

- **Premium UI**: Clean, high-density, minimalist user interface inspired by premium desktop tools like Linear and Raycast, featuring a dockable AI assistant panel and inline composer headers.
- **AI-Powered Generation**: Describe your email in natural language and let AI generate the draft.
- **Tone Adjustment**: Select between professional, friendly, formal, concise, and persuasive tones.
- **Rich Text Editing**: Edit the generated content with an intuitive rich-text editor (TipTap) configured with typography styling.
- **Direct Sending**: Connect your Gmail account via OAuth and send emails directly from the app.
- **Sent History**: View past emails along with the original AI prompts used to generate them.
- **Theme Support**: Seamlessly toggle between Light and Dark modes.
- **Privacy First**: API keys and OAuth tokens are stored locally on your machine using Electron's secure `safeStorage`.
- **Extensible AI Providers**: Default support for Google Gemini, with architecture ready for more providers.

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) & [React 19](https://react.dev/)
- **Build Tool**: [Electron Vite](https://electron-vite.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **AI Integration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) >= 18
- A Google Cloud Project with the Gmail API enabled and an OAuth Desktop Client ID/Secret. (See our [Gmail Setup Guide](GMAIL_SETUP.md)).
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation & Development Setup

1. Clone the repository:
```bash
git clone https://github.com/dragon-slayer27/mail-genie.git
cd mail-genie
```

2. Install dependencies:
> **Note:** Due to bleeding-edge dependencies (Tailwind CSS v4, TipTap, and React 19), you must use the `--legacy-peer-deps` flag to bypass NPM's strict peer dependency resolution.
```bash
npm install --legacy-peer-deps
```

3. Run in development mode:
```bash
npm run dev
```


## Configuration

1. Open the application and navigate to the **Settings** page.
2. Enter your **Gemini API Key**.
3. Follow the instructions in the [Gmail OAuth Setup Guide](GMAIL_SETUP.md) to get your **Google OAuth Client ID** and **Client Secret**, and enter them in Settings.
4. Click **Connect Gmail** to authenticate.

## Troubleshooting

- **`EADDRINUSE: address already in use` error when logging in**:
  Mail Genie spins up a temporary local server on port 3000 to catch the OAuth redirect from Google. Ensure no other application is running on port 3000 when you click "Connect Gmail".
- **Google hasn’t verified this app**:
  Because you are creating your own Google Cloud project and it is in "Testing" status, Google will show an unverified app warning. Click **Advanced** -> **Go to Mail Genie (unsafe)** to proceed. Ensure you added your email as a "Test User" in the Google Cloud Console.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started, set up the project, and submit Pull Requests.

### Upcoming Features
- OpenAI/Anthropic provider plugins
- Local LLM support (Ollama)
- Scheduled emails
- Email templates
- Contact suggestions

## License

This project is licensed under the [MIT License](LICENSE).
