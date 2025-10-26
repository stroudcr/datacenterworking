'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="glass rounded-lg px-4 py-2.5 min-h-[150px] flex items-center justify-center">
      <span className="text-silver-400 text-sm">Loading editor...</span>
    </div>
  ),
});

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'link'];

export function QuillEditor({ value, onChange, placeholder, error }: QuillEditorProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="quill-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="quill-editor"
        />
      </div>
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  );
}
