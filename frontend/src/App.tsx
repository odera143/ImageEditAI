import { useState } from 'react';
import { fetchData } from './api';

function App() {
  const [data, setData] = useState<{ text: string; image: string } | null>(
    null
  );
  const [prompt, setPrompt] = useState('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [sketchFile, setSketchFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
    null
  );
  const [sketchPreviewUrl, setSketchPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!originalFile || !sketchFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('originalImage', originalFile);
    formData.append('sketchImage', sketchFile);

    const response = await fetchData({
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setData(response);
    setIsLoading(false);
  };

  const handleOriginalFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalPreviewUrl(url);
    }
  };

  const handleSketchFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSketchFile(file);
      const url = URL.createObjectURL(file);
      setSketchPreviewUrl(url);
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
            <label className='label'>Upload Original Image</label>
            <div className='upload-area'>
              <input
                type='file'
                accept='image/*'
                onChange={handleOriginalFileChange}
                className='file-input'
                id='original-upload'
              />
              <label htmlFor='original-upload' className='file-input-label'>
                Choose Original Image
              </label>
              {originalPreviewUrl && (
                <img
                  src={originalPreviewUrl}
                  alt='Original Preview'
                  className='preview-image'
                />
              )}
            </div>
          </div>

          <div className='form-group'>
            <label className='label'>Upload Sketch/Drawing</label>
            <div className='upload-area'>
              <input
                type='file'
                accept='image/*'
                onChange={handleSketchFileChange}
                className='file-input'
                id='sketch-upload'
              />
              <label htmlFor='sketch-upload' className='file-input-label'>
                Choose Sketch Image
              </label>
              {sketchPreviewUrl && (
                <img
                  src={sketchPreviewUrl}
                  alt='Sketch Preview'
                  className='preview-image'
                />
              )}
            </div>
          </div>

          <div className='form-group'>
            <label className='label'>Additional Context (Optional)</label>
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder='Add any additional context about the modifications...'
              className='textarea'
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!originalFile || !sketchFile || isLoading}
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
