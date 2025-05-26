export default function ChatMessage({ showDetails, setShowDetails }: { showDetails: boolean, setShowDetails: (v: boolean) => void }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-bold text-lg">👗 服裝設計師</h3>
      <p className="mt-2">我為你準備了三套穿搭：</p>
      <ol className="list-decimal list-inside mt-2 space-y-1">
        <li>夏日清新風：白襯衫 + 牛仔裙 + 草帽</li>
        <li>音樂節個性風：印花 T 恤 + 寬褲 + 墨鏡</li>
        <li>約會甜美風：荷葉邊上衣 + 長裙 + 涼鞋</li>
      </ol>
      <span className="block mt-3 text-pink-600 font-medium">
        你今天一定會成為全場焦點 ✨
      </span>
      <button
        className="text-blue-600 hover:underline mt-4"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "⬆️ 收起分析依據" : "👀 查看分析依據"}
      </button>

      {showDetails && (
        <div className="mt-4 space-y-2 border-t pt-4 text-sm text-gray-700">
          <p>🗓 <strong>個人秘書</strong>：今天 26°C，無雨，地點是戶外音樂節</p>
          <p>🧍‍♀️ <strong>形象顧問</strong>：建議半休閒風格，呼應活動氛圍</p>
          <p>🎨 <strong>色彩鑒定師</strong>：膚色適合淺藍、白、薰衣草色</p>
          <p>🔥 <strong>潮流分析師</strong>：今夏流行短版上衣與丹寧單品</p>
        </div>
      )}
    </div>
  );
}
