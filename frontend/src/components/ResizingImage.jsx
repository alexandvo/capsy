import { useState } from "react";

const ResizingImage = ({size, src, alt}) => {
  const [isWide, setIsWide] = useState(false);
  const [dimensions, setDimensions] = useState({});

  const handleImageLoad = (event) => {
    const img = event.target;
    
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const height = `${size / aspectRatio}px`; // Calculate height based on aspect ratio
    if (img.naturalWidth > img.naturalHeight) {
        setDimensions({ width: size, height});
      } else {
        setDimensions({ width: 'auto', height: size });


      }
    
  };

  return (
    <img
      onLoad={handleImageLoad}
      style={dimensions}
      src={src}
      alt={alt}
    />
  );
};

export default ResizingImage;
