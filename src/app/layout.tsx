import '../styles/globals.css'

import Header from './components/Header'; // 引入 Header 組件

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>ReVogue</title>
      </head>
      <body>
        <Header /> {/* 顯示全局頭部 */}
        <main className="p-6">{children}</main> {/* 這是頁面內容 */}
      </body>
    </html>
  );
}
