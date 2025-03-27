import { useEffect, useRef, useState } from 'react';

const ROISelector = ({ image, onROISelected, onCancel, existingPoints = null }) => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState(existingPoints || []);
  const [isComplete, setIsComplete] = useState(existingPoints ? true : false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create new image object
    const img = new Image();
    
    // Set up onload handler before setting src
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw existing points and lines
      if (points.length > 0) {
        // Draw lines between points
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((point, index) => {
          if (index > 0) {
            ctx.lineTo(point.x, point.y);
          }
        });
        if (isComplete) {
          ctx.closePath();
        }
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (isComplete) {
          ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
          ctx.fill();
        }

        // Draw points
        points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#00FF00';
          ctx.fill();
        });
      }
    };

    // Set image source after setting up onload
    img.src = image;
  }, [image, points, isComplete]);

  const handleCanvasClick = (e) => {
    if (isComplete) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicking near the start point to close the polygon
    if (points.length > 2) {
      const startPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(startPoint.x - x, 2) + Math.pow(startPoint.y - y, 2)
      );
      
      if (distance < 20) {
        setIsComplete(true);
        return;
      }
    }

    setPoints([...points, { x, y }]);
  };

  const handleConfirm = () => {
    if (!isComplete) return;
    onROISelected(points);
  };

  const handleReset = () => {
    setPoints([]);
    setIsComplete(false);
  };

  return (
    <>
      <div className="text-sm text-gray-600 mb-2">
        Click to add points. Click near the start point to close the shape.
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={640}
        onClick={handleCanvasClick}
        className="cursor-crosshair"
        style={{ 
          width: '640px',
          height: '640px'
        }}
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Reset
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isComplete}
          className={`px-4 py-2 text-white rounded ${
            isComplete 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default ROISelector;