import React, { useRef, useState } from "react";

const ImageZoom = ({ src, alt }) => {
  const [zoomStyle, setZoomStyle] = useState({});
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%", // zoom level
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-96 border rounded-lg bg-white shadow relative overflow-hidden cursor-zoom-in"
      style={{
        backgroundImage: zoomStyle.backgroundImage,
        backgroundPosition: zoomStyle.backgroundPosition,
        backgroundSize: zoomStyle.backgroundSize,
        backgroundRepeat: "no-repeat",
      }}
    >
      {!zoomStyle.backgroundImage && (
        <img src={src} alt={alt} className="object-contain w-full h-full" />
      )}
    </div>
  );
};

export default ImageZoom;