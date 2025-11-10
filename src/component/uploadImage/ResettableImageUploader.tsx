import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ImageUploader, { ImageUploaderRef, ImageUploaderProps } from './ImageUploader';

export interface ResettableImageUploaderRef extends ImageUploaderRef {
  reset: () => void;
}

const ResettableImageUploader = forwardRef<ResettableImageUploaderRef, ImageUploaderProps>((props, ref) => {
  const [key, setKey] = useState(Date.now());
  const uploaderRef = useRef<ImageUploaderRef>(null);

  useImperativeHandle(ref, () => ({
    upload: async () => {
      if (uploaderRef.current) {
        return uploaderRef.current.upload();
      }
      return [];
    },
    reset: () => {
      setKey(Date.now()); // Force recreate ImageUploader
    }
  }));

  return (
    <ImageUploader
      key={key}
      ref={uploaderRef}
      {...props}
    />
  );
});

ResettableImageUploader.displayName = 'ResettableImageUploader';

export default ResettableImageUploader;