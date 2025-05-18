'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ApiTestPage() {
  const [userId, setUserId] = useState('testuser');
  const [result, setResult] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userData, setUserData] = useState('{"name": "測試用戶", "age": 25}');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'photo'>('user');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 清除預覽URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 顯示通知
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const uploadUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/file-service/user-data/upload', {
        method: 'POST',
        headers: {
          'user-id': userId,
          'Content-Type': 'application/json'
        },
        body: userData
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));

      if (data.fileName) {
        setDownloadFileName(data.fileName);
        showNotification('數據上傳成功！', 'success');
      }
    } catch (error) {
      setResult(String(error));
      showNotification('上傳失敗', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadUserData = async () => {
    if (!downloadFileName) {
      showNotification('請先上傳數據或提供檔案名', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/file-service/user-data/download?fileName=${downloadFileName}`, {
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `下載失敗: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification('下載成功！', 'success');
    } catch (error) {
      setResult(`下載錯誤: ${error instanceof Error ? error.message : String(error)}`);
      showNotification('下載失敗', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async () => {
    if (!file) {
      showNotification('請先選擇檔案', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/file-service/photos/upload', {
        method: 'POST',
        headers: {
          'user-id': userId,
          'Content-Type': file.type
        },
        body: file
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));

      if (data.fileName) {
        setDownloadFileName(data.fileName);
        showNotification('照片上傳成功！', 'success');
      }
    } catch (error) {
      setResult(String(error));
      showNotification('上傳失敗', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPhoto = async () => {
    if (!downloadFileName) {
      showNotification('請先上傳照片或提供檔案名', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/file-service/photos/download?fileName=${downloadFileName}`, {
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `下載失敗: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification('下載成功！', 'success');
    } catch (error) {
      setResult(`下載錯誤: ${error instanceof Error ? error.message : String(error)}`);
      showNotification('下載失敗', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // 創建預覽URL
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-xl ${notification.type === 'success' ? 'bg-green-900 text-green-100' :
              'bg-red-900 text-red-100'
            }`}
        >
          {notification.message}
        </motion.div>
      )}

      <motion.div
        className="max-w-5xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">API</h1>

        </div>

        <div className="p-8 bg-gray-800">
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">用戶 ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="transition-all duration-300 block w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-gray-700 text-white"
              placeholder="輸入用戶ID"
            />
          </motion.div>

          <motion.div
            className="mb-8 bg-gray-700 rounded-xl p-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex">
              <button
                onClick={() => setActiveTab('user')}
                className={`flex-1 py-4 px-4 rounded-lg transition-all font-medium ${activeTab === 'user'
                    ? 'bg-teal-600 shadow-lg text-white'
                    : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                用戶數據
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-4 px-4 rounded-lg transition-all font-medium ${activeTab === 'photo'
                    ? 'bg-teal-600 shadow-lg text-white'
                    : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                照片管理
              </button>
            </div>
          </motion.div>

          {activeTab === 'user' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-600 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-teal-400">用戶數據管理</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">JSON 數據</label>
                <textarea
                  value={userData}
                  onChange={(e) => setUserData(e.target.value)}
                  className="transition-all duration-300 block w-full p-4 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-inner bg-gray-800 text-gray-100 h-40 font-mono text-sm"
                  placeholder="輸入JSON數據"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={uploadUserData}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-8 py-4 rounded-lg ${isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700'
                    } text-white font-medium transition-all duration-300 shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  上傳用戶數據
                </motion.button>

                <motion.button
                  onClick={downloadUserData}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-8 py-4 rounded-lg ${isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
                    } text-white font-medium transition-all duration-300 shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  下載用戶數據
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'photo' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-600 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-teal-400">照片管理</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">選擇照片</label>
                <div className="mt-1 flex justify-center px-8 pt-6 pb-8 border-2 border-gray-600 border-dashed rounded-lg hover:border-teal-400 transition-colors bg-gray-800">
                  <div className="space-y-2 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-teal-400 hover:text-teal-300 focus-within:outline-none">
                        <span>上傳照片</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">或拖放至此處</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP 最大 10MB</p>
                  </div>
                </div>
              </div>

              {previewUrl && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium text-gray-300 mb-2">預覽</p>
                  <div className="bg-black/30 p-3 rounded-lg shadow-inner">
                    <div className="relative w-full h-72 bg-gray-900 rounded overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="預覽"
                        className="w-full h-full object-contain transition-all duration-500"
                      />
                    </div>
                    {file && (
                      <div className="mt-3 text-sm text-gray-400">
                        <p>{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={uploadPhoto}
                  disabled={isLoading || !file}
                  className={`flex items-center justify-center px-8 py-4 rounded-lg ${isLoading || !file
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700'
                    } text-white font-medium transition-all duration-300 shadow-lg`}
                  whileHover={!isLoading && file ? { scale: 1.03 } : {}}
                  whileTap={!isLoading && file ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  上傳照片
                </motion.button>

                <motion.button
                  onClick={downloadPhoto}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-8 py-4 rounded-lg ${isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
                    } text-white font-medium transition-all duration-300 shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  下載照片
                </motion.button>
              </div>
            </motion.div>
          )}

          <motion.div
            className="bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-600 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-teal-400">檔案資訊</h2>
              {downloadFileName && (
                <motion.span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-900 text-teal-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  已存檔
                </motion.span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">檔案名</label>
              <input
                type="text"
                value={downloadFileName}
                onChange={(e) => setDownloadFileName(e.target.value)}
                className="transition-all duration-300 block w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm bg-gray-800 text-white"
                placeholder="檔案名 (例如: data-1234567890.json)"
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-teal-400">響應結果</h2>
            <div className="relative">
              <pre className="bg-gray-900 text-teal-400 p-6 rounded-lg overflow-auto h-60 font-mono text-sm shadow-inner tracking-tight">
                {result || '// 等待API響應...'}
              </pre>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full opacity-30 blur-3xl"></div>
            </div>
          </motion.div>
        </div>

        <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 text-center text-sm text-gray-400">
         ReVogue
        </div>
      </motion.div>
    </motion.div>
  );
} 