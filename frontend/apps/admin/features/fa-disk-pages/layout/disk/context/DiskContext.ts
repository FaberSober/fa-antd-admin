import React, { createContext } from 'react';
import { Disk } from '@/types';

export interface UploadFileProps {
  id: string;
  fileName: string;
  total: number;
  loaded: number;
  progress: number;
  rate: number;
  status: 'uploading' | 'success' | 'error';
}

export interface DiskContextProps {
  bucket: Disk.StoreBucket;
  changeBucket: (bucketId: number) => void;
  renderCount: number;
  addRenderCount: () => void;
  uploadFiles: UploadFileProps[];
  fireUploadFile: (v:UploadFileProps) => void;
}

const DiskContext: React.Context<DiskContextProps> = createContext<DiskContextProps>({} as any);

export default DiskContext;
