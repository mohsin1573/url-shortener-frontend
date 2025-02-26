import { useState } from 'react';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCopied(false);
    try {
      const response = await fetch('http://localhost:3000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: originalUrl }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setShortUrl(data.short_url);
        setError('');
      } else {
        setError(data.errors?.join(', ') || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="shortener-container">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          required
        />
        <button type="submit">Shorten</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {shortUrl && (
        <div className="result-container">
          <p>
            Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
            <button 
              onClick={copyToClipboard}
              className="copy-button"
              type="button"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </p>
          {copied && <p className="success-message">URL copied to clipboard!</p>}
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
