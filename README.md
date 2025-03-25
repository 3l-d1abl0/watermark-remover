<h1 align="center"> Watermark Remover </h1>
<p style="font-family: Arial; font-size: 13pt;Color: #711984;">A Simple watermark removal tool. Uses Google's Gemini api to remove watermarks from Images. 
Built for educational purposes.
</p>

<p align="center">
  <img src="/images/water-mark-meme-Screenshot_2025-03-25_20-12-26.png" alt="Gemini" width="100%"/>
</p>

## 🚀 Getting Started

### Prerequisites

- Typescript/NodeJS v23+
- Google OAuth Keys
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/3l-d1abl0/watermark-remover.git
   cd watermark-remover
   ```


2. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with your API keys:
   ```
   Please reference the .env.sample file for all of the keys required.
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

## ❗Disclaimer

This tool is just for educational purposes.

## 📝 References

- [Experiment with Gemini 2.0 Flash native image generation](https://developers.googleblog.com/en/experiment-with-gemini-20-flash-native-image-generation/)
- [Genimi Image generation API](https://ai.google.dev/gemini-api/docs/image-generation#node.js_1)


