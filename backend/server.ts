import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { RequestHandler } from 'express-serve-static-core';

type MulterRequest = Request & {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
};

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
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const originalImage = files?.['originalImage']?.[0];
    const sketchImage = files?.['sketchImage']?.[0];

    if (!originalImage || !sketchImage) {
      res.status(400).json({
        error: 'Original image and sketch image are required.',
      });
      return;
    }

    // Convert both images to Base64
    const originalImageData = fs.readFileSync(originalImage.path);
    const originalBase64 = originalImageData.toString('base64');

    const sketchImageData = fs.readFileSync(sketchImage.path);
    const sketchBase64 = sketchImageData.toString('base64');

    // Prepare request data
    const contents = [
      {
        text: `You are an advanced AI image editing assistant. I will provide you with two images:
1. An original image
2. A sketch/drawing on top of the original image showing the desired modifications

Please analyze both images and generate a new image that incorporates the modifications shown in the sketch while maintaining the style and quality of the original image. The modifications should be seamlessly integrated and look natural. Only pay attention to the concept of the sketch, not the details.
If you can tell what the sketch is supposed to be, make the changes. If you can't tell, make the changes that you think are best.

${prompt ? `User's additional context: ${prompt}` : ''}`,
      },
      {
        inlineData: {
          mimeType: originalImage.mimetype,
          data: originalBase64,
        },
      },
      {
        inlineData: {
          mimeType: sketchImage.mimetype,
          data: sketchBase64,
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

    // Clean up uploaded files
    fs.unlinkSync(originalImage.path);
    fs.unlinkSync(sketchImage.path);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
};

app.post(
  '/api/generate',
  upload.fields([
    { name: 'originalImage', maxCount: 1 },
    { name: 'sketchImage', maxCount: 1 },
  ]),
  generateHandler
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
