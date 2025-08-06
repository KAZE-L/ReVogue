'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ChevronRight, Database, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

type UserData = {
  gender: string;
  height: string;
  skinColor: string;
  occupation: string;
  photos: string[];
  stylePreferences: string[];
  schedule: string;
  wardrobe: string[];
};

export default function UserProfilePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempPhotos, setTempPhotos] = useState<File[]>([]);
  const [tempWardrobe, setTempWardrobe] = useState<File[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const [userData, setUserData] = useState<UserData>({
    gender: '女性',
    height: '170 cm',
    skinColor: '#f7e6c4',
    occupation: '學生',
    photos: ['/sample1.jpg', '/sample2.jpg', '/sample3.jpg', '/sample4.jpg', '/sample5.jpg', '/sample6.jpg', '/sample7.jpg'],
    stylePreferences: ['極簡', '知性通勤'],
    schedule: '未授權',
    wardrobe: ['/closet1.jpg', '/closet2.jpg', '/closet3.jpg']
  });

  const styleOptions = ["極簡", "知性通勤", "日系", "都會休閒", "Y2K復古未來感", "戶外機能",
                "英倫學院", "韓系", "波西米亞", "時尚實驗", "文青", "法式優雅", "古著",
                "日系古著", "中性", "蒲公英系森系", "暗黑哥德", "未來工業", "視覺系", "嘻哈風",
                "輕便", "休閑", "美式", "運動風", "工裝風", "Cyberpunk", "洛麗塔", "懶人舒適風", "浪漫唯美", "輕熟氣質",
                "甜美可愛", "軍裝風", "民族風", "蒸汽龐克", "水手風", "海島度假風",
                "溫柔姐姐風", "原宿風", "名媛風", "美式復古", "鄉村田園", "工業風",
                "藝術系", "山系", "帥氣皮衣風", "賽博和風", "中式新潮"];


  const goHome = () => {
    setSidebarOpen(false);
    router.push('/chatbot');
  };

  const openEditModal = (field: string) => {
    setEditingField(field);
    if (field === 'stylePreferences') {
      setSelectedStyles([...userData.stylePreferences]);
    }
  };

  const handleSave = (value: any) => {
    if (editingField) {
      setUserData(prev => ({
        ...prev,
        [editingField]: value
      }));
    }
    setEditingField(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'wardrobe') => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (type === 'photos') {
        setTempPhotos([...tempPhotos, ...files]);
      } else {
        setTempWardrobe([...tempWardrobe, ...files]);
      }
    }
  };

  const handleRemovePhoto = (index: number, type: 'photos' | 'wardrobe') => {
    if (type === 'photos') {
      const newPhotos = [...userData.photos];
      newPhotos.splice(index, 1);
      setUserData({ ...userData, photos: newPhotos });
    } else {
      const newWardrobe = [...userData.wardrobe];
      newWardrobe.splice(index, 1);
      setUserData({ ...userData, wardrobe: newWardrobe });
    }
  };

  const toggleStylePreference = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  return (
    <div className="profile-main">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} onLogoClick={goHome} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} goHome={goHome} />

      <div className="profile-content">
        <div className="profile-header">
          <Database className="profile-header-icon" />
          個人數據
        </div>

        <div className="profile-section">
          <div className="profile-block">
            {/* 性別 */}
            <Item 
              label="性別" 
              value={userData.gender} 
              onClick={() => openEditModal('gender')} 
            />

            {/* 身高 */}
            <Item 
              label="身高" 
              value={userData.height} 
              onClick={() => openEditModal('height')} 
            />

            {/* 膚色 */}
            <Item 
              label="膚色" 
              custom={<div className="profile-color-demo" style={{ backgroundColor: userData.skinColor }} />} 
              onClick={() => openEditModal('skinColor')} 
            />

            {/* 職業 */}
            <Item 
              label="職業" 
              value={userData.occupation} 
              onClick={() => openEditModal('occupation')} 
            />

            {/* 照片上傳 */}
            <Item 
              label="照片上傳" 
              custom={
                <div className="profile-photo-list">
                  {userData.photos.map((photo, i) => (
                    <div key={i} className="photo-item">
                      <img src={photo} alt="" className="w-8 h-8 rounded object-cover" />
                      <button 
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto(i, 'photos');
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="upload-btn">
                    <Plus size={16} />
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => handlePhotoUpload(e, 'photos')} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              } 
              onClick={() => openEditModal('photos')} 
            />

            {/* 風格偏好 */}
            <Item 
              label="風格偏好" 
              custom={
                <div className="profile-tag-list">
                  {userData.stylePreferences.map((tag, i) => (
                    <span key={i} className="profile-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              } 
              onClick={() => openEditModal('stylePreferences')} 
            />

            {/* 行程 */}
            <Item 
              label="行程" 
              value={userData.schedule} 
              onClick={() => openEditModal('schedule')} 
            />

            {/* 你的衣櫃 */}
            <Item 
              label="你的衣櫃" 
              custom={
                <div className="profile-photo-list">
                  {userData.wardrobe.map((item, i) => (
                    <div key={i} className="photo-item">
                      <img src={item} alt="" className="w-8 h-8 rounded object-cover" />
                      <button 
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto(i, 'wardrobe');
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="upload-btn">
                    <Plus size={16} />
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => handlePhotoUpload(e, 'wardrobe')} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              } 
              onClick={() => openEditModal('wardrobe')} 
            />
          </div>
        </div>
      </div>

      {/* 性別 Modal */}
      {editingField === 'gender' && (
        <Modal
          title="你的性別"
          description="不同性別在衣物設計上有原型差異，提供性別能讓系統推薦更合身、符合日常需求的穿搭組合。"
          onClose={() => setEditingField(null)}
          onSave={() => handleSave(userData.gender)}
        >
          <div className="modal-options">
            {['男性', '女性', '其他'].map(option => (
              <div
                key={option}
                className={`modal-option ${userData.gender === option ? 'selected' : ''}`}
                onClick={() => setUserData({...userData, gender: option})}
              >
                {option}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* 身高 Modal */}
      {editingField === 'height' && (
        <Modal
          title="你的身高"
          description="身高資訊有助於掌握穿搭比例，例如衣服長度、褲款選擇，提升整體視覺平衡感。"
          onClose={() => setEditingField(null)}
          onSave={() => handleSave(userData.height)}
        >
          <div className="input-container">
            <input
              type="text"
              value={userData.height}
              onChange={(e) => setUserData({...userData, height: e.target.value})}
              placeholder="輸入身高（例如：170 cm）"
              className="input"
            />
          </div>
        </Modal>
      )}

      {/* 膚色選項 Modal */}
      {editingField === 'skinColor' && (
        <Modal
          title="你的膚色"
          description="膚色是色彩鑑定的關鍵依據，能幫助我們挑選更適合你的主色與配件色，提升整體氣質與和諧感。"
          onClose={() => setEditingField(null)}
          onSave={() => handleSave(userData.skinColor)}
        >
          <div className="skin-color-modal">
            <div className="skin-color-grid">
              {[
                "#F7F0E8", "#AB8763", "#F4E9E3", "#8F654D", "#F8EDD9",
                "#6C4B3C", "#EDDFC4", "#423731", "#DDC5A1", "#2F2A24"
              ].map((color, i) => (
                <button
                  key={i}
                  className={`skin-color-option ${userData.skinColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setUserData({...userData, skinColor: color})}
                />
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* 職業 Modal */}
      {editingField === 'occupation' && (
        <Modal
          title="你的職業"
          description="根據你的工作性質，我們會建議適合的穿搭語言與風格，展現你的專業與個性。"
          onClose={() => setEditingField(null)}
          onSave={() => handleSave(userData.occupation)}
        >
          <div className="input-container">
            <input
              type="text"
              value={userData.occupation}
              onChange={(e) => setUserData({...userData, occupation: e.target.value})}
              placeholder="輸入職業（例如：學生）"
              className="input"
            />
          </div>
        </Modal>
      )}

      {/* 風格偏好 Modal */}
      {editingField === 'stylePreferences' && (
        <Modal
          title="你的風格偏好"
          description="我們希望打造你「自己也會愛上」的穿搭風格，你可以勾選喜歡的風格參考。"
          onClose={() => setEditingField(null)}
          onSave={() => {
            handleSave(selectedStyles);
            setSelectedStyles([]);
          }}
        >
          <div className="style-options">
            {styleOptions.map(style => (
              <div
                key={style}
                className={`style-option ${selectedStyles.includes(style) ? 'selected' : ''}`}
                onClick={() => toggleStylePreference(style)}
              >
                {style}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* 照片上傳/衣櫃 Modal */}
      {(editingField === 'photos' || editingField === 'wardrobe') && (
      <Modal
        title={editingField === 'photos' ? '上傳你的照片' : '你的衣櫃'}
        description={editingField === 'photos' 
          ? '上傳你平常的全身照或自拍照，我們會自動分析體型與膚色，幫助顧問們提供更準確建議。' 
          : '如果你已經有一些常穿的衣物，我們可以依據你衣櫃內容來推薦實際可行的穿搭組合。'}
        onClose={() => setEditingField(null)}
        onSave={() => setEditingField(null)}
      >
        <div className="photo-manager">
          <div className="photo-scroll-container">
            <div className="photo-grid">
              {(editingField === 'photos' ? userData.photos : userData.wardrobe).map((photo, i) => (
                <div key={i} className="photo-item">
                  <img src={photo} alt="" />
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemovePhoto(i, editingField as 'photos' | 'wardrobe')}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <label className="upload-area">
            <Plus size={24} />
            <span>點擊上傳新照片</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => handlePhotoUpload(e, editingField as 'photos' | 'wardrobe')} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </Modal>
    )}

    {/* 行程 Modal */}
    {editingField === 'schedule' && (
      <Modal
        title="你的行程"
        description="若你願意，我們可以讀取你的今日日程（Google Calendar），根據天氣、地點與行程內容進行穿搭建議。"
        onClose={() => setEditingField(null)}
        onSave={() => handleSave(userData.schedule)}
      >
        <div className="calendar-sync-container">
          {userData.schedule === '未授權' ? (
            <button
              onClick={() => setUserData({...userData, schedule: '已授權'})}
              className="calendar-sync-btn"
            >
              <div className="flex items-center justify-center gap-3">
                <Image
                  src="/GoogleCalendar.png"
                  alt="Google Calendar"
                  width={28}
                  height={28}
                />
                <span>同步行事曆活動</span>
              </div>
            </button>
          ) : (
            <div className="calendar-authorized">
              <span className="text-green-600">✓ 已授權</span>
              <button 
                onClick={() => setUserData({...userData, schedule: '未授權'})}
                className="text-sm text-gray-500 underline mt-2"
              >
                取消授權
              </button>
            </div>
          )}
        </div>
      </Modal>
    )}
    </div>
  );
}



function Item({ label, value, custom, onClick }: { 
  label: string; 
  value?: string; 
  custom?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="profile-item" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <span className="profile-label">{label}</span>
      <div className="profile-item-right">
        {value && <span className="profile-value">{value}</span>}
        {custom}
        {onClick && <ChevronRight className="profile-arrow" />}
      </div>
    </div>
  );
}

function Modal({
  title,
  description,
  children,
  onClose,
  onSave
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-star-container">
            <Image 
              src="/star.svg" 
              alt="star" 
              width={20} 
              height={20} 
              className="modal-star"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
           <h2 className="modal-title">{title}</h2>
          </div>
        <p className="modal-description">{description}</p>
        
        {children}

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>取消</button>
          <button className="modal-save" onClick={onSave}>儲存</button>
        </div>
      </div>
    </div>
  );
}