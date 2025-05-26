// components/Sidebar.tsx
import { Menu } from 'lucide-react';

export default function Sidebar({ isOpen, onToggleSidebar }: { isOpen: boolean; onToggleSidebar: () => void }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r p-4 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center mb-4">
        <button onClick={onToggleSidebar} className="text-gray-700 mr-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <ul className="space-y-2 text-sm text-gray-700">
        <h2 className="font-semibold text-lg">歷史紀錄</h2>
        <li className="hover:underline cursor-pointer">5/23 音樂祭穿搭</li>
        <li className="hover:underline cursor-pointer">5/20 面試穿搭</li>
        <li className="hover:underline cursor-pointer">5/18 約會穿搭</li>
      </ul>
    </aside>
  );
}