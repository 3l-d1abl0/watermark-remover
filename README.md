
# Watermark Remover
A Simple watermark removal tool. Uses Google's Gemini api to remove watermarks from Images.
Built for educational purposes.

## 🚀 Getting Started

### Prerequisites

- Typescript/Node v23+
- Google OAuth Keys
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone 
   cd dir
   ```
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with your API keys:
   ```
   Please reference the .env.sample file for all the keys required.
   ```

### Setting up Google OAuth

This application uses Google OAuth for user authentication. Follow these steps to set it up:
Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new Application.
Copy the Client ID and Client Secret. Save them to your `.env` file:
    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    GOOGLE_CLIENT_ID=your_google_client_id_here
    GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    ```

### Running Locally

Start the node Server
```bash
npm run dev
```

Visit `http://127.0.0.1:<port>` in your browser.

## 🔍 D

1. User uploads an image containing a watermark
2. The application sends the image to Google's Gemini model
3. A prompt instructs the AI to identify and remove the watermark while preserving the rest of the image
4. The processed image is returned and displayed alongside the original

## 🛠️ Technologies Used

- **Backend**: Flask (Python)
- **AI**: Google Gemini
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Deployment**: Vercel

## ❗Disclaimer

This tool is just for educational purposes.

## 📝 References

- [Experiment with Gemini 2.0 Flash native image generation](https://developers.googleblog.com/en/experiment-with-gemini-20-flash-native-image-generation/)
- [Genimi Image generation API](https://ai.google.dev/gemini-api/docs/image-generation#node.js_1)