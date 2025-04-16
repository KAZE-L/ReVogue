```bash
# 使用 POST 方法訪問
https://re-vogue.vercel.app/api/test/seed

# 預期返回：
{
  "status": "success",
  "message": "測試數據已準備就緒",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "測試用戶",
      "role": "buyer"
    },
    "product": {
      "id": 1,
      "name": "測試商品",
      "price": 99.99,
      "category": "測試類別"
    }
  }
}
```

## 2. 用戶認證 API

### 登錄
```bash
# 使用 POST 方法訪問
https://re-vogue.vercel.app/api/auth/login

# 請求體：
{
  "email": "test@example.com",
  "password": "test123"
}

# 預期返回：
{
  "id": 1,
  "email": "test@example.com",
  "name": "測試用戶",
  "role": "buyer"
}
```

## 3. 商品 API

### 獲取商品列表
```bash
# 使用 GET 方法訪問
https://re-vogue.vercel.app/api/products

# 可選查詢參數：
?category=測試類別
?keyword=測試

# 預期返回：
{
  "products": [
    {
      "id": 1,
      "name": "測試商品",
      "price": 99.99,
      "category": "測試類別"
    }
  ]
}
```

### 創建新商品
```bash
# 使用 POST 方法訪問
https://re-vogue.vercel.app/api/products

# 請求體：
{
  "name": "新測試商品",
  "price": 199.99,
  "description": "這是新測試商品",
  "category": "測試類別",
  "images": ["https://example.com/test.jpg"],
  "sellerId": 1
}

# 預期返回：
{
  "id": 2,
  "name": "新測試商品",
  "price": 199.99,
  "status": "active"
}
```

## 4. 購物車 API

### 添加商品到購物車
```bash
# 使用 POST 方法訪問
https://re-vogue.vercel.app/api/cart

# 請求體：
{
  "userId": 1,
  "productId": 1,
  "quantity": 1
}

# 預期返回：
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "quantity": 1
}
```

### 獲取購物車內容
```bash
# 使用 GET 方法訪問
https://re-vogue.vercel.app/api/cart?userId=1

# 預期返回：
{
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "測試商品",
        "price": 99.99
      },
      "quantity": 1
    }
  ]
}
```

## 5. 訂單 API

### 創建新訂單
```bash
# 使用 POST 方法訪問
https://re-vogue.vercel.app/api/order

# 請求體：
{
  "cartItems": [
    {
      "productId": 1,
      "quantity": 1
    }
  ],
  "paymentMethod": "credit_card",
  "shippingAddress": "測試地址",
  "buyerId": 1
}

# 預期返回：
{
  "id": 1,
  "status": "pending",
  "totalAmount": 99.99,
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "price": 99.99
    }
  ]
}