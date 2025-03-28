# AI Image Editor

A web application that uses Google's Gemini AI to modify images based on text prompts. The application features a modern dark-themed UI and real-time image preview functionality.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API key

## Project Structure

```
myapp/
├── backend/         # Express.js server
│   └── .env        # Environment variables
└── frontend/        # React application
```

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the backend directory with your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

### 2. Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Choose File" to upload an image
3. Enter a text prompt describing how you want to modify the image
4. Click "Generate" to process the image
5. The modified image will appear in the result section

## Features

- Modern dark-themed UI
- Real-time image preview
- Responsive design
- Loading states and error handling
- Secure file upload handling

## Technologies Used

- Frontend:

  - React
  - TypeScript
  - CSS3
  - Axios

- Backend:
  - Node.js
  - Express
  - TypeScript
  - Google Gemini AI API
  - Multer (file upload handling)

## Development

- The backend uses TypeScript and includes type definitions
- The frontend is built with React and TypeScript
- Both frontend and backend have hot-reloading enabled for development

## Error Handling

- The application includes error handling for:
  - File upload failures
  - API request errors
  - Invalid input validation
  - Server-side processing errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
