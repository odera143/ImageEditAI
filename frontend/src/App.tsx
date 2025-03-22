import { useState } from 'react';
import { fetchData } from './api';

function App() {
  const [data, setData] = useState<{ text: string; image: string } | null>(
    null
  );
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !prompt) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('image', file);

    const response = await fetchData({
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setData(response);
    setIsLoading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  return (
    <div className='container'>
      <h1 className='title'>AI Image Editor</h1>

      <div className='grid'>
        {/* Input Section */}
        <div className='card'>
          <h2 className='card-title'>Edit Your Image</h2>

          <div className='form-group'>
            <label className='label'>Upload Image</label>
            <div className='upload-area'>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='file-input'
                id='file-upload'
              />
              <label htmlFor='file-upload' className='file-input-label'>
                Choose File
              </label>
              {previewUrl && (
                <img src={previewUrl} alt='Preview' className='preview-image' />
              )}
            </div>
          </div>

          <div className='form-group'>
            <label className='label'>Describe Your Changes</label>
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder='Describe how you want to modify the image...'
              className='textarea'
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!file || !prompt || isLoading}
            className='button'
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Output Section */}
        <div className='card'>
          <h2 className='card-title'>Result</h2>
          {isLoading ? (
            <div className='spinner' />
          ) : data ? (
            <div>
              {data.image && (
                <img
                  src={`data:image/png;base64,${data.image}`}
                  alt='Generated'
                  className='result-image'
                />
              )}
              {data.text && (
                <div className='result-text'>
                  <p>{data.text}</p>
                </div>
              )}
            </div>
          ) : (
            <div className='empty-state'>
              <p>Your generated image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
