import { Image, Upload, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import styles from './ImageUploader.module.scss';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export interface ImageUploaderRef {
  upload: () => Promise<string[]>;
}

export interface ImageUploaderProps {
  defaultUrls?: string[];
  mode?: 'single' | 'multiple';
  folder?: string;
  disabled?: boolean;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  onImagesChange?: (hasImages: boolean) => void;
  onUrlsChange?: (urls: string[]) => void;
  onUrlDelete?: (url: string) => void;
}

const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(({
  defaultUrls = [],
  mode = 'single',
  folder = 'mobile-shop',
  disabled = false,
  maxFileSize = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  onImagesChange,
  onUrlsChange,
  onUrlDelete,
}, ref) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Convert defaultUrls to fileList format when component mounts or defaultUrls changes
  useEffect(() => {
    if (defaultUrls.length > 0) {
      const newFileList: UploadFile[] = defaultUrls.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}.png`,
        status: 'done',
        url: url,
      }));
      setFileList(newFileList);
    }
  }, [defaultUrls]);

  const validateFile = (file: File): boolean => {
    // Kiểm tra định dạng file
    if (!acceptedFileTypes.includes(file.type)) {
      message.error(`File ${file.name} không đúng định dạng. Chỉ chấp nhận ${acceptedFileTypes.join(', ')}`);
      return false;
    }

    // Kiểm tra kích thước
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxFileSize) {
      message.error(`File ${file.name} vượt quá kích thước cho phép (${maxFileSize}MB)`);
      return false;
    }

    return true;
  };

  const handleFileChange: UploadProps['onChange'] = async ({ fileList: newFileList, file: changedFile }) => {
    console.log('File change:', { 
      action: changedFile.status,
      filename: changedFile.name,
      currentFiles: fileList.length,
      newFiles: newFileList.length
    });

    // Handle file removal
    if (changedFile.status === 'removed') {
      const remainingFiles = newFileList;
      console.log('After removal:', { remainingCount: remainingFiles.length });
      
      // Update state and notify parent components in the correct order
      setFileList(remainingFiles);
      
      // Wait for state update before notifying
      setTimeout(() => {
        onImagesChange?.(remainingFiles.length > 0);
        const urls = remainingFiles
          .filter(f => f.status === 'done' && f.url)
          .map(f => f.url as string);
        onUrlsChange?.(urls);
        onUrlDelete?.(changedFile.url as string);
      }, 0);
      return;
    }

    // For new files: validate and generate previews
    const validNewFiles = newFileList.filter(file => {
      if (file.originFileObj && !validateFile(file.originFileObj)) {
        return false;
      }
      return true;
    });

    // In single mode, only keep the latest file
    // In multiple mode, keep existing files and add new ones
    const filesToProcess = mode === 'single' ? 
      validNewFiles.slice(-1) : 
      validNewFiles;

    // Generate previews for new files
    const updatedFiles = await Promise.all(
      filesToProcess.map(async (file) => {
        if (file.originFileObj && !file.url) {
          const preview = await getBase64(file.originFileObj);
          return { ...file, preview };
        }
        return file;
      })
    );

    setFileList(updatedFiles);

    // Notify parent components
    const hasFiles = updatedFiles.length > 0;
    onImagesChange?.(hasFiles);

    // Update URLs for parent
    const urls = updatedFiles
      .filter(file => file.status === 'done' && file.url)
      .map(file => file.url as string);
    onUrlsChange?.(urls);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const upload = async (): Promise<string[]> => {
    const filesToUpload = fileList.filter(file => file.originFileObj);
    
    if (filesToUpload.length === 0) {
      return fileList.filter(file => file.url).map(file => file.url as string);
    }

    setIsUploading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing');
      }

      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj as File);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await res.json();
        if (!data.secure_url) throw new Error('Upload failed');
        return data.secure_url;
      });

      const newUrls = await Promise.all(uploadPromises);
      
      // Combine existing URLs with new ones based on mode
      const existingUrls = fileList
        .filter(file => file.url)
        .map(file => file.url as string);

      const finalUrls = mode === 'single' ? 
        newUrls.slice(-1) : 
        [...existingUrls, ...newUrls];

      message.success('Upload ảnh thành công!');
      return finalUrls;
    } catch (error) {
      console.error('Error uploading files:', error);
      message.error('Có lỗi xảy ra khi upload ảnh');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    upload,
  }));

  // Button to add more images
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleFileChange}
        beforeUpload={() => false}
        disabled={disabled}
        accept='image/*'
        multiple={mode === 'multiple'}
        maxCount={mode === 'single' ? 1 : undefined}
      >
        {mode === 'single' && fileList.length >= 1 ? null : 
         mode === 'multiple' && fileList.length >= 8 ? null : 
         uploadButton}
      </Upload>

      {/* Loading Overlay */}
      {isUploading && (
        <div className={styles.loadingOverlay}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
            <div className={styles.loadingContent}>
              <div>Đang upload...</div>
            </div>
          </Spin>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <Image
          style={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            src: previewImage,
            onVisibleChange: (visible) => {
              setPreviewOpen(visible);
              if (!visible) {
                setPreviewImage('');
              }
            },
          }}
        />
      )}
    </div>
  );
});

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;