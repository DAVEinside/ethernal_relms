import React, { useState, useEffect } from 'react';

const ImageDisplay = ({ imageUrl, alt, type, onRegenerate = null, isLoading = false }) => {
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
    const baseStyle = 'transition-all duration-300 backdrop-blur-sm';
    switch (type) {
      case 'character':
        return `w-48 h-48 rounded-full object-cover glow-effect ${baseStyle}`;
      case 'location':
        return `w-full h-48 object-cover rounded-lg glow-effect ${baseStyle}`;
      case 'combat':
        return `w-full h-64 object-cover rounded-lg glow-effect ${baseStyle}`;
      default:
        return `w-full rounded-lg glow-effect ${baseStyle}`;
    }
  };

  const handleRegenerate = async () => {
    if (onRegenerate && !loading && !isLoading) {
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

  const renderLoadingSpinner = () => (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 bg-blue-500/20"></div>
      </div>
      <span className="text-blue-300 mt-4 text-sm">Generating image...</span>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center text-red-400 animate-fadeIn">
      <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{error || 'Failed to load image'}</span>
    </div>
  );

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center text-gray-400 animate-fadeIn">
      <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>Waiting for image...</span>
    </div>
  );

  return (
    <div className="relative group">
      <div className={`${getImageStyle()} bg-gray-700/50 flex items-center justify-center overflow-hidden`}>
        {(loading || isLoading) ? (
          renderLoadingSpinner()
        ) : error ? (
          renderError()
        ) : imgSrc ? (
          <img
            src={imgSrc}
            alt={alt}
            className={`${getImageStyle()} animate-fadeIn`}
          />
        ) : (
          renderPlaceholder()
        )}
      </div>

      {onRegenerate && !loading && !isLoading && imgSrc && (
        <button
          onClick={handleRegenerate}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 
                   bg-blue-600/90 hover:bg-blue-500 text-white px-3 py-1.5 
                   rounded-full text-sm transition-all duration-300 
                   backdrop-blur-sm hover:scale-105 transform
                   flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Regenerate</span>
        </button>
      )}

      {/* Image loading progress overlay */}
      {(loading || isLoading) && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded-full"></div>
      )}
    </div>
  );
};

export default ImageDisplay;