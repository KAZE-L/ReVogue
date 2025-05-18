import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '../../route';
import { promises as fs } from 'fs';
import path from 'path';
import { Readable } from 'stream';

// 支持的圖片類型
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// 最大檔案大小 (10MB)
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * 照片上傳API
 */
export async function POST(req: NextRequest) {
  // 檢查請求速率限制
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 獲取用戶ID (實際應用中應從認證令牌中獲取)
    const userId = req.headers.get('user-id') || 'anonymous';
    
    // 獲取內容類型
    const contentType = req.headers.get('content-type') || '';
    
    // 檢查檔案類型
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ 
        error: '不支持的檔案類型',
        allowedTypes: ALLOWED_TYPES 
      }, { status: 400 });
    }
    
    // 如果沒有請求體，返回錯誤
    if (!req.body) {
      return NextResponse.json({ error: '沒有數據' }, { status: 400 });
    }
    
    // 確保目錄存在
    const uploadDir = path.join(process.cwd(), 'uploads', 'photos', userId);
    await fs.mkdir(uploadDir, { recursive: true });
    
    // 確定檔案擴展名
    const extension = contentType.split('/')[1];
    
    // 生成檔案名
    const fileName = `photo-${Date.now()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);
    
    // 流式處理上傳
    const stream = Readable.fromWeb(req.body as any);
    const chunks: Uint8Array[] = [];
    let size = 0;

    // 從流中讀取數據
    for await (const chunk of stream) {
      size += chunk.length;
      
      // 檢查檔案大小
      if (size > MAX_SIZE) {
        return NextResponse.json({ 
          error: `檔案大小超過限制 (${MAX_SIZE / (1024 * 1024)}MB)` 
        }, { status: 413 });
      }
      
      chunks.push(chunk);
    }

    // 將數據寫入檔案
    const buffer = Buffer.concat(chunks);
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      filePath: `/uploads/photos/${userId}/${fileName}`,
      fileName,
      contentType,
      size: buffer.length
    }, { status: 201 });
    
  } catch (error) {
    console.error('照片上傳錯誤:', error);
    return NextResponse.json({ error: '上傳失敗' }, { status: 500 });
  }
} 