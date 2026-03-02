import { useState } from 'react';

interface FileUploadMockProps {
  label: string;
  accept?: string;
}

export default function FileUploadMock({ label, accept = 'image/*,.pdf' }: FileUploadMockProps) {
  const [file, setFile] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary-600'}`}>
        {file ? (
          <div className="text-sm text-green-700 flex items-center justify-center gap-2">
            <span>✓</span>
            <span>{file}</span>
            <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 ml-2 text-xs">Remover</button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-1 text-gray-500">
            <span className="text-2xl">📎</span>
            <span className="text-sm">Clique para selecionar arquivo</span>
            <span className="text-xs text-gray-400">{accept}</span>
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f.name);
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
