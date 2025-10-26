'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Upload } from 'lucide-react';
import { useState } from 'react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
}

export function CloudinaryUploadWidget({
  onUploadSuccess,
  currentUrl
}: CloudinaryUploadWidgetProps) {
  const [preview, setPreview] = useState(currentUrl || '');

  return (
    <div className="flex flex-col gap-3">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result: any) => {
          const url = result.info.secure_url;
          setPreview(url);
          onUploadSuccess(url);
        }}
        options={{
          maxFiles: 1,
          maxFileSize: 2000000, // 2MB
          resourceType: 'image',
          clientAllowedFormats: ['png', 'jpg', 'jpeg', 'svg', 'webp'],
          folder: 'company-logos',
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="glass rounded-lg px-4 py-3 text-white text-sm hover:bg-white/10 transition-all flex items-center gap-2 justify-center"
          >
            <Upload className="w-4 h-4" />
            {preview ? 'Change Logo' : 'Upload Logo'}
          </button>
        )}
      </CldUploadWidget>

      {preview && (
        <div className="mt-2">
          <p className="text-xs text-silver-400 mb-2">Preview:</p>
          <div className="w-16 h-16 rounded-lg glass overflow-hidden">
            <img
              src={preview}
              alt="Company logo preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
