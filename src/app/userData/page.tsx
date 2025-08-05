'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ChevronRight, Database, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    photos: ['/sample1.jpg', '/sample2.jpg', '/sample3.jpg'],
    stylePreferences: ['極簡', '知性通勤'],
    schedule: '未授權',
    wardrobe: ['/closet1.jpg', '/closet2.jpg', '/closet3.jpg']
  });

  const styleOptions = ['極簡', '知性通勤', '日系', '街頭', '復古', '運動風', '甜美', '中性'];


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

      {/* 風格偏好 Modal */}
      {editingField === 'stylePreferences' && (
        <Modal
          title="風格偏好"
          description="選擇你喜歡的穿搭風格（可多選）"
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
          title={editingField === 'photos' ? '照片上傳' : '你的衣櫃'}
          description={editingField === 'photos' 
            ? '上傳你的個人照片' 
            : '管理你的衣櫃照片'}
          onClose={() => setEditingField(null)}
          onSave={() => {
            // 這裡實際處理照片上傳邏輯
            setEditingField(null);
          }}
        >
          <div className="photo-manager">
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
        <h2 className="modal-title">{title}</h2>
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