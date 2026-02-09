#  AI Chatbot with Secure API Integration

A modern, responsive AI chatbot built with vanilla JavaScript that integrates with Google's Gemini API through a secure serverless backend.

![Chatbot Demo](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

##  Features

-  **Real-time Chat Interface** - Clean, intuitive chat UI with smooth animations
-  **Secure API Key Management** - API keys hidden via Netlify Functions (never exposed to client)
-  **Google Gemini AI** - Powered by Google's Gemini Pro model
-  **Modern Design** - Purple-themed UI with Material Icons
-  **Responsive Layout** - Works seamlessly on desktop and mobile devices
-  **Auto-Model Detection** - Automatically selects the best available Gemini model

##  Live Demo

[View Live Demo](#) *(yourdesire1.netlify.app)*

##  Screenshots

*(Add screenshots of your chatbot here)*

##  Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Netlify Serverless Functions
- **API**: Google Gemini AI
- **Hosting**: Netlify
- **Icons**: Google Material Symbols

##  Prerequisites

Before you begin, ensure you have:

- A [Netlify](https://www.netlify.com/) account
- A [Google AI Studio](https://makersuite.google.com/app/apikey) API key for Gemini
- Git installed on your machine
- A code editor (VS Code recommended)

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-chatbot.git
cd ai-chatbot
```

### 2. Project Structure

```
ai-chatbot/
├── netlify/
│   └── functions/
│       └── chat.js          # Serverless function (handles API calls)
├── index.html               # Main HTML file
├── script.js                # Frontend JavaScript
├── style.css                # Styling
└── README.md
```

### 3. Get Your Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key (keep it safe!)

### 4. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended for Beginners)

1. Push your code to GitHub
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: *(leave empty)*
   - **Publish directory**: `/` (root)
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### 5. Set Environment Variables in Netlify

 **CRITICAL STEP** - This keeps your API key secure!

1. In Netlify Dashboard, go to **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Add:
   - **Key**: `GOOGLE_API_KEY`
   - **Value**: Your Google API key
4. Click "Save"
5. **Redeploy** your site for changes to take effect

##  Security Features

 **API Key Protection**
- API key stored as Netlify environment variable
- Never exposed in frontend code or GitHub
- Serverless function acts as a secure proxy

 **Best Practices**
- No sensitive data in client-side code
- Proper error handling
- CORS protection via Netlify Functions

##  Usage

1. Open the deployed chatbot URL
2. Type your message in the input box
3. Press Enter or click the send button
4. The AI assistant will respond with helpful information

##  Customization

### Change Chatbot Personality

Edit the system prompt in `netlify/functions/chat.js`:

```javascript
parts: [{ text: `You are a helpful  Assistant. Answer this concisely: ${message}` }]
```

Replace `" Assistant"` with your desired role.

### Modify Theme Colors

Edit `style.css`:

```css
/* Primary color (purple) */
.chatbot header {
    background: #724ae8; /* Change this */
}

/* Background color */
body {
    background: #E3F2FD; /* Change this */
}
```

##  Troubleshooting

### "Missing Google API Key" Error
- Ensure you've added `GOOGLE_API_KEY` to Netlify environment variables
- Redeploy the site after adding the variable

### "Method Not Allowed" Error
- The function only accepts POST requests
- Check that your frontend is sending POST requests

### Chat Not Responding
- Check browser console for errors (F12)
- Verify your API key is valid in Google AI Studio
- Check Netlify function logs in the dashboard

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Author

**Bishal**

- GitHub: [@bshresth1](https://github.com/yourusername)
- Project Link: [https://github.com/bshresth1/ai-chatbot](https://github.com/bshresth/ai-chatbot)

##  Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities
- [Netlify](https://www.netlify.com/) for serverless hosting
- [Material Symbols](https://fonts.google.com/icons) for icons
- [Poppins Font](https://fonts.google.com/specimen/Poppins) by Google Fonts

##  Support

If you have any questions or run into issues, please [open an issue](https://github.com/bshresth1/ai-chatbot/issues).

---

 **If you found this project helpful, please consider giving it a star!** 
