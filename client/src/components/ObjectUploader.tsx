import { useRef } from "react";
import type { ReactNode, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onFilesSelected?: (files: File[]) => void;
  buttonClassName?: string;
  children: ReactNode;
  accept?: string;
}

export function ObjectUploader({
  maxNumberOfFiles = 10,
  maxFileSize = 10485760,
  onFilesSelected,
  buttonClassName,
  children,
  accept = ".pdf,.png,.jpg,.jpeg",
}: ObjectUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        console.warn(`File ${file.name} exceeds max size of ${maxFileSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    }).slice(0, maxNumberOfFiles);
    
    if (validFiles.length > 0) {
      onFilesSelected?.(validFiles);
    }
    e.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        multiple={maxNumberOfFiles > 1}
        className="hidden"
        data-testid="input-file-upload"
      />
      <Button 
        onClick={handleClick} 
        className={buttonClassName} 
        type="button"
        variant="outline"
        data-testid="button-upload"
      >
        <Upload className="w-4 h-4 mr-2" />
        {children}
      </Button>
    </div>
  );
}
