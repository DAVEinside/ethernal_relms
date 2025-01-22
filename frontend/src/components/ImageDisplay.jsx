import React, { useState, useEffect } from 'react';

const ImageDisplay = ({ imageUrl, alt, type, onRegenerate = null }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImgSrc(imageUrl);
        setLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setLoading(false);
      };
    } else {
      setLoading(false);
    }
  }, [imageUrl]);

  const getImageStyle = () => {
    switch (type) {
      case 'character':
        return 'w-48 h-48 rounded-full object-cover';
      case 'location':
        return 'w-full h-48 object-cover rounded-lg';
      case 'combat':
        return 'w-full h-64 object-cover rounded-lg';
      default:
        return 'w-full rounded-lg';
    }
  };

  const handleRegenerate = async () => {
    if (onRegenerate && !loading) {
      setLoading(true);
      setError(null);
      try {
        await onRegenerate();
      } catch (err) {
        setError('Failed to regenerate image');
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className={`${getImageStyle()} bg-gray-700 flex items-center justify-center overflow-hidden`}>
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-gray-400 mt-2">Generating image...</span>
          </div>
        ) : imgSrc ? (
          <img
            src={imgSrc}
            alt={alt}
            className={`${getImageStyle()} transition-opacity duration-300`}
          />
        ) : (
          <span className="text-gray-400">{error || 'No image available'}</span>
        )}
      </div>

      {onRegenerate && !loading && (
        <button
          onClick={handleRegenerate}
          className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-sm"
        >
          Regenerate
        </button>
      )}
    </div>
  );
};

export default ImageDisplay;