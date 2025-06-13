//Login Page (Main Page)

'use client';

import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // 防止表單刷新
    router.push('/chatbot'); // 對應 app/chatbot/page.tsx
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-3xl font-bold mb-2">ReVogue</h1>
      <h2 className="text-lg font-medium mb-4">登入</h2>

      <p className="text-sm text-gray-600 mb-3">快速登入</p>
      <div className="flex space-x-4 mb-4">
        <button className="p-2 rounded-full border">
          <FcGoogle className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full border bg-black text-white">
          <FaApple className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full border text-blue-600">
          <FaFacebook className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center w-full max-w-sm mb-6">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-3 text-sm text-gray-500">更多</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm flex flex-col space-y-4"
      >
        <div>
          <label className="text-sm font-medium">E-mail</label>
          <input
            type="email"
            placeholder="輸入 E-mail"
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="text-sm font-medium">密碼</label>
          <input
            type="password"
            placeholder="輸入密碼"
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-full font-medium"
        >
          登入
        </button>
      </form>

      <div className="mt-4 flex flex-col items-center space-y-2 text-sm">
        <button className="text-gray-500 hover:underline">忘記密碼</button>
        <button className="text-gray-700 font-medium hover:underline">
          還沒註冊？
        </button>
      </div>
    </div>
  );
}
