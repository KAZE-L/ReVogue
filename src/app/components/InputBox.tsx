// components/InputBox.tsx
export default function InputBox() {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="詢問任何穿搭建議..."
        className="flex-1 px-4 py-2 rounded-3xl border focus:outline-none"
      />
      <button className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800">
        送出
      </button>
    </div>
  );
}