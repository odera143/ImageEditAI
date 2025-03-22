import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { RequestHandler } from 'express-serve-static-core';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'noKey');

app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

const generateHandler: RequestHandler = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageFile = req.file;

    if (!prompt || !imageFile) {
      res.status(400).json({ error: 'Prompt and image are required.' });
      return;
    }

    // Convert the uploaded image to Base64
    const imageData = fs.readFileSync(imageFile.path);
    const base64Image = imageData.toString('base64');

    // **Pre-Prompt for Consistency**
    const prePrompt = `You are an advanced AI image editing assistant. Your task is to modify images strictly according to the user's request while maintaining realism and visual coherence. Always ensure the generated output aligns with the given image context and adheres to natural lighting, perspective, and artistic integrity. Avoid generating unrelated content, extreme alterations, or responses that are not images. If the request is unclear or unsafe, respond with a clarification prompt instead of an incorrect or unexpected output.`;

    // Prepare request data
    const contents = [
      { text: `${prePrompt}\n\nUser request: ${prompt}` },
      {
        inlineData: {
          mimeType: imageFile.mimetype,
          data: base64Image,
        },
      },
    ];

    // Call Gemini API
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        // @ts-ignore
        responseModalities: ['Text', 'Image'],
      },
    });

    const response = await model.generateContent(contents);

    // Parse Gemini's response
    let textResponse = '';
    let imageResponse = null;

    if (response.response?.candidates?.[0]?.content?.parts) {
      for (const part of response.response.candidates[0].content.parts) {
        if (part.text) {
          textResponse = part.text;
        } else if (part.inlineData) {
          imageResponse = part.inlineData.data;
        }
      }
    }

    res.json({ text: textResponse, image: imageResponse });

    // Clean up uploaded file
    fs.unlinkSync(imageFile.path);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
};

app.post('/api/generate', upload.single('image'), generateHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
