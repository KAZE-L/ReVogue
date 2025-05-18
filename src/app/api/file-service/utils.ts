import { promises as fs } from 'fs';
import path from 'path';

/**
 * 確保上傳目錄存在
 */
export async function ensureUploadDirectories() {
  const baseDir = path.join(process.cwd(), 'uploads');
  
  // 創建基礎目錄
  await fs.mkdir(baseDir, { recursive: true });
  
  // 創建用戶數據目錄
  await fs.mkdir(path.join(baseDir, 'user-data'), { recursive: true });
  
  // 創建照片目錄
  await fs.mkdir(path.join(baseDir, 'photos'), { recursive: true });
  
  console.log('已創建所有必要的上傳目錄');
} 