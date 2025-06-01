from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List
import shutil
import os
from datetime import datetime
from prisma.client import Prisma
from ..dependencies import get_current_user

router = APIRouter()

# 建立上傳目錄
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

prisma = Prisma()

@router.post("/")
async def upload_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    await prisma.connect()
    try:
        # 生成唯一檔案名稱
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(file.filename)[1]
        new_filename = f"image_{timestamp}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        
        # 儲存檔案
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 儲存圖片資訊到資料庫
        image = await prisma.image.create(
            data={
                'filename': new_filename,
                'originalFilename': file.filename,
                'path': file_path,
                'userId': current_user.id
            }
        )
        
        return {
            "id": image.id,
            "filename": image.filename,
            "message": "Image uploaded successfully"
        }
    except Exception as e:
        # 如果出錯，刪除已上傳的文件
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await prisma.disconnect()

@router.get("/{image_id}")
async def get_image(image_id: int):
    await prisma.connect()
    try:
        image = await prisma.image.find_unique(
            where={'id': image_id},
            include={'user': True}
        )
        if image is None:
            raise HTTPException(status_code=404, detail="Image not found")
        return image
    finally:
        await prisma.disconnect() 