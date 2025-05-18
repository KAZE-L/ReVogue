import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '../../route';
import { promises as fs } from 'fs';
import path from 'path';
import { createReadStream } from 'fs';

/**
 * 照片下載API
 */
export async function GET(req: NextRequest) {
  // 檢查請求速率限制
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 獲取用戶ID (實際應用中應從認證令牌中獲取)
    const userId = req.headers.get('user-id') || 'anonymous';
    
    // 獲取檔案名參數
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');
    
    if (!fileName) {
      return NextResponse.json({ error: '缺少檔案名參數' }, { status: 400 });
    }
    
    // 構建檔案路徑
    const filePath = path.join(process.cwd(), 'uploads', 'photos', userId, fileName);
    
    // 檢查檔案是否存在
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json({ error: '檔案不存在' }, { status: 404 });
    }
    
    // 獲取檔案信息
    const stat = await fs.stat(filePath);
    
    // 獲取檔案類型
    const fileExtension = path.extname(fileName).toLowerCase();
    let contentType = 'image/jpeg'; // 默認值
    
    // 根據擴展名設置正確的MIME類型
    switch (fileExtension) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      default:
        contentType = 'image/jpeg';
    }
    
    // 創建讀取流
    const fileStream = createReadStream(filePath);
    
    // 創建響應流
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=31536000'
    });
    
    // 使用Next.js的流式響應
    return new NextResponse(fileStream as any, {
      headers,
      status: 200
    });
    
  } catch (error) {
    console.error('照片下載錯誤:', error);
    return NextResponse.json({ error: '下載失敗' }, { status: 500 });
  }
} 