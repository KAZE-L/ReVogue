import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '../../route';
import { promises as fs } from 'fs';
import path from 'path';
import { Readable } from 'stream';

/**
 * 用戶數據上傳API
 */
export async function POST(req: NextRequest) {
  // 檢查請求速率限制
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 獲取用戶ID (實際應用中應從認證令牌中獲取)
    const userId = req.headers.get('user-id') || 'anonymous';
    
    // 如果沒有請求體，返回錯誤
    if (!req.body) {
      return NextResponse.json({ error: '沒有數據' }, { status: 400 });
    }
    
    // 確保目錄存在
    const uploadDir = path.join(process.cwd(), 'uploads', 'user-data', userId);
    await fs.mkdir(uploadDir, { recursive: true });
    
    // 生成檔案名
    const fileName = `data-${Date.now()}.json`;
    const filePath = path.join(uploadDir, fileName);
    
    // 流式處理上傳
    const stream = Readable.fromWeb(req.body as any);
    const chunks: Uint8Array[] = [];

    // 從流中讀取數據
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    // 將數據寫入檔案
    const buffer = Buffer.concat(chunks);
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      filePath: `/uploads/user-data/${userId}/${fileName}`,
      fileName,
      size: buffer.length
    }, { status: 201 });
    
  } catch (error) {
    console.error('用戶數據上傳錯誤:', error);
    return NextResponse.json({ error: '上傳失敗' }, { status: 500 });
  }
} 