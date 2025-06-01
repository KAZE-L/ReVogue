from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from prisma.client import Prisma
import bcrypt

router = APIRouter()

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

prisma = Prisma()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    await prisma.connect()
    try:
        # 檢查用戶名是否已存在
        existing_user = await prisma.user.find_first(
            where={
                'OR': [
                    {'username': user.username},
                    {'email': user.email}
                ]
            }
        )
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username or email already exists"
            )
        
        # 加密密碼
        hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
        
        # 創建新用戶
        new_user = await prisma.user.create(
            data={
                'username': user.username,
                'email': user.email,
                'password': hashed_password.decode()
            }
        )
        return new_user
    finally:
        await prisma.disconnect()

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    await prisma.connect()
    try:
        user = await prisma.user.find_unique(where={'id': user_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    finally:
        await prisma.disconnect() 