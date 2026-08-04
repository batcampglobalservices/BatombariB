import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaCrop, FaSearchPlus, FaSearchMinus, FaUpload, FaRedo } from 'react-icons/fa';

export default function ImageCropperModal({ isOpen, onClose, onCropComplete, initialImage = '' }) {
  const [imageSrc, setImageSrc] = useState(initialImage);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setImageSrc(initialImage);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [initialImage, isOpen]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropAndSave = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 400; // Output cropped image size
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Clear & Draw Circular Crop Canvas
      ctx.clearRect(0, 0, size, size);
      
      // Save context state
      ctx.save();
      
      // Draw image with pan and scale offset centered
      const scale = zoom;
      const aspect = img.width / img.height;
      let drawW = size * scale;
      let drawH = (size / aspect) * scale;
      if (aspect < 1) {
        drawH = size * scale;
        drawW = size * aspect * scale;
      }

      const drawX = (size - drawW) / 2 + pan.x;
      const drawY = (size - drawH) / 2 + pan.y;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCropComplete(croppedDataUrl);
      onClose();
    };
    img.src = imageSrc;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-EveningBlack rounded-2xl border border-yellow/30 w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-LightGray/10 bg-DeepNightBlack">
          <h3 className="text-base font-bold text-Snow flex items-center gap-2">
            <FaCrop className="text-yellow" /> Crop & Adjust Profile Photo
          </h3>
          <button onClick={onClose} className="text-LightGray hover:text-Snow transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Circular Viewport Preview Frame */}
          <div
            className="relative w-64 h-64 rounded-full border-4 border-yellow/60 overflow-hidden bg-DeepNightBlack cursor-grab active:cursor-grabbing shadow-inner flex items-center justify-center select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {imageSrc ? (
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Profile Crop Target"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  maxWidth: 'none',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                className="pointer-events-none"
                onError={() => setImageSrc('/images/batombari.jpeg')}
              />
            ) : (
              <div className="text-center p-4 text-LightGray/60">
                <FaUpload className="text-3xl mx-auto mb-2 text-yellow/50" />
                <span className="text-xs">Upload an image to start cropping</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-LightGray/60 mt-3">
            💡 Drag photo to position within the circle frame. Use slider below to zoom.
          </p>

          {/* Controls */}
          <div className="w-full mt-6 space-y-4">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3 bg-DeepNightBlack p-3 rounded-xl border border-LightGray/10">
              <FaSearchMinus className="text-LightGray text-xs" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-yellow cursor-pointer"
              />
              <FaSearchPlus className="text-LightGray text-xs" />
              <button
                type="button"
                onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="text-xs text-yellow hover:underline flex items-center gap-1 ml-2"
                title="Reset Position"
              >
                <FaRedo className="text-[10px]" /> Reset
              </button>
            </div>

            {/* File Upload Button & URL input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-DeepNightBlack hover:bg-DeepNightBlack/80 border border-LightGray/20 text-Snow text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FaUpload className="text-yellow" /> Upload Photo File
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-DeepNightBlack border-t border-LightGray/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-LightGray hover:text-Snow transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropAndSave}
            disabled={!imageSrc}
            className="px-5 py-2 rounded-xl bg-yellow text-DeepNightBlack font-bold text-xs hover:bg-yellow/90 transition-all shadow-lg flex items-center gap-1.5"
          >
            <FaCrop /> Apply & Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}
