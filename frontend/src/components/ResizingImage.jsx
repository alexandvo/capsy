import React, { useState } from "react";

const ResizingImage = ({ swap = false, type, size, src, alt }) => {
  const [dimensions, setDimensions] = useState({});

  const handleMediaLoad = (event) => {
    const media = event.target;

    const aspectRatio = media.naturalWidth / media.naturalHeight;
    const height = `${size / aspectRatio}px`; // Calculate height based on aspect ratio

    if (swap) {
      if (media.naturalWidth <= media.naturalHeight) {
        setDimensions({ width: size, height });
      } else {
        setDimensions({ width: "auto", height: size });
      }
    } else {
      if (media.naturalWidth > media.naturalHeight) {
        setDimensions({ width: size, height });
      } else {
        setDimensions({ width: "auto", height: size });
      }
    }
  };

  return (
    <>
      {type === "image" && (
        <img onLoad={handleMediaLoad} style={dimensions} src={src} alt={alt} />
      )}
      {/* {type === "video" && (
        <video
          onLoadedData={handleMediaLoad}
          style={dimensions}
          src={src}
          controls
        >
          
        </video>
      )} */}
    </>
  );
};

export default ResizingImage;
