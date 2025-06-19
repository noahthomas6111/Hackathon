import React, { useState, useRef } from 'react';
import { useZxing } from 'react-zxing';
import { Camera, CameraOff, Image as ImageIcon } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string, imageUrl?: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      // Capture the current frame as an image
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0);
          const imageUrl = canvas.toDataURL('image/jpeg');
          onScan(result.getText(), imageUrl);
        }
      }
      setIsEnabled(false);
    },
    paused: !isEnabled,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onScan('manual-upload', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isEnabled ? (
          <>
            <CameraOff className="w-5 h-5" />
            Stop Scanning
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            Start Scanning
          </>
        )}
      </button>

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center gap-2 w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ImageIcon className="w-5 h-5" />
          Upload Product Image
        </label>
      </div>
      
      {isEnabled && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <video 
            ref={(el) => {
              if (el) {
                videoRef.current = el;
                ref(el);
              }
            }}
            className="w-full h-full object-cover" 
          />
        </div>
      )}
    </div>
  );
}