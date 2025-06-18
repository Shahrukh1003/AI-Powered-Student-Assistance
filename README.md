# REVA University AI Assistant

An intelligent AI-powered chatbot designed to assist REVA University students with their queries, built with modern web technologies and advanced AI integration.

## 🚀 Features

- **AI-Powered Responses**: Intelligent responses using OpenRouter API with REVA University context
- **Multi-modal Interaction**: Text and voice-based communication
- **Real-time Speech Processing**: Voice input and text-to-speech capabilities
- **University-Specific Data**: Integration with REVA University's data system
- **Responsive Design**: Modern UI with cosmic background and smooth animations
- **Accessibility**: ARIA-compliant components and voice assistance
- **Theme Support**: Light/Dark mode implementation

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI, Radix UI
- **State Management**: React Query
- **AI Integration**: OpenRouter API
- **Speech Processing**: Web Speech API
- **Development Tools**: ESLint, PostCSS, SWC

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/     # UI components including chatbot interface
├── pages/         # Page components
├── services/      # API services (chatbot, REVA data, OpenRouter)
├── hooks/         # Custom React hooks
├── contexts/      # React context providers
├── utils/         # Utility functions (speech, text processing)
├── types/         # TypeScript type definitions
├── config/        # Configuration files
└── lib/          # Library code
```

## 🎯 Key Features

- **Intelligent Response System**
  - Two-tier response system with REVA data integration
  - Fallback to general AI responses
  - Context-aware responses

- **Voice Interaction**
  - Speech-to-text input
  - Text-to-speech output
  - Voice assistant modal

- **User Experience**
  - Real-time typing indicators
  - Message history with timestamps
  - Smooth animations and transitions
  - Responsive design

- **Error Handling**
  - Robust error management
  - Graceful fallback mechanisms
  - User-friendly error messages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Shahrukh Saifi - Initial work

## 🙏 Acknowledgments

- REVA University for data integration
- OpenRouter for AI capabilities
- Shadcn UI for the component library
- Radix UI for accessible primitives
- Vite team for the build tool
