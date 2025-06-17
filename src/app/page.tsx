//Login Page (Main Page)

'use client';

import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // 防止表單刷新
    router.push('/survey');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-3xl font-bold mb-4">ReVogue</h1>
      <h2 className="text-lg font-bold mb-4">登入</h2>

      <p className="text-sm font-bold text-gray-600 mb-4">快速登入</p>
      <div className="flex space-x-5 mb-4">
        <button className="p-2 rounded-full border">
          <FcGoogle className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full border">
          <FaApple className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full border text-blue-600">
          <FaFacebook className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center w-full max-w-sm mb-4">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-3 text-sm font-bold text-gray-400">更多</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm flex flex-col space-y-4"
      >
        <div>
          <label className="text-sm font-medium font-bold ml-4">E-mail</label>
          <input
            type="email"
            placeholder="輸入 E-mail"
            className="w-full text-gray-400 mt-2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium font-bold ml-4">密碼</label>
          <input
            type="password"
            placeholder="輸入密碼"
            className="w-full text-gray-400 mt-2 mb-5 px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-800 text-white py-2 rounded-xl font-medium font-bold"
        >
          登入
        </button>
      </form>

      <div className="mt-2 flex flex-col items-center space-y-4 text-sm">
        <button className="text-gray-700 font-bold hover:underline">忘記密碼</button>
        <button className="text-gray-700 font-bold hover:underline">
          註冊
        </button>
      </div>
    </div>
  );
}
