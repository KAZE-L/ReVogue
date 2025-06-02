// components/WeatherCard.tsx
export default function WeatherCard() {
  return (
    <div className="bg-blue-300 text-white p-4 rounded-xl flex flex-col justify-between min-h-[150px]">
      <div>
        <div className="text-lg font-semibold">多 雲 偶 陣 雨</div>
        <div className="text-sm mt-1">多雲偶陣雨，要留意材質與層次的搭配</div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="text-2xl font-bold">27℃</div>
        <a href="#" className="text-sm underline">看看穿搭建議 →</a>
      </div>
    </div>
  );
}
