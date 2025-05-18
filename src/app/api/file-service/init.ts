import { ensureUploadDirectories } from './utils';

// 在開發環境中初始化目錄
if (process.env.NODE_ENV === 'development') {
  ensureUploadDirectories()
    .then(() => console.log('檔案服務初始化成功'))
    .catch(error => console.error('檔案服務初始化失敗:', error));
} 