import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import { X, Edit2, Trash2, Package, Star, MapPin, DollarSign, Save } from 'lucide-react';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditingItem, setIsEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '', description: '', price: '', deposit: '', rating: '', image: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8086";
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`);
      if (response.data.success) setItems(response.data.data);
      else alert(response.data.message);
    } catch (error) {
      console.error("Load Items Error:", error);
      alert("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (item) => {
    if (userRole === "ADMIN") setSelectedItem(item);
  };

  const handleEditClick = (item) => {
    setIsEditingItem(item.id);
    setEditFormData({
      title: item.title || '', description: item.description || '',
      price: item.price || '', deposit: item.deposit || '',
      rating: item.rating || '', image: item.image || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Only image files allowed"); return; }
    if (file.size > 2 * 1024 * 1024) { alert("Max file size is 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setEditFormData(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async () => {
    if (!editFormData.title || !editFormData.description || !editFormData.price || !editFormData.deposit) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const productData = {
        title: editFormData.title, description: editFormData.description,
        price: Number(editFormData.price), deposit: Number(editFormData.deposit),
        rating: Number(editFormData.rating || 0), image: editFormData.image
      };
      const response = await axios.put(`${API_BASE_URL}/api/items/${isEditingItem}`, productData);
      if (response.data.success) {
        setItems(prev => prev.map(item => item.id === isEditingItem ? response.data.data : item));
        setSelectedItem(response.data.data);
        setIsEditingItem(null);
        alert(response.data.message || "Item updated successfully");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Edit Item Error:", error);
      if (error.response) alert(error.response.data?.message || "Backend error occurred");
      else if (error.request) alert("Cannot connect to backend. Check Spring Boot port 8086.");
      else alert("Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/items/${itemId}`);
      if (response.data.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        setSelectedItem(null);
        setIsEditingItem(null);
        alert(response.data.message || "Product deleted successfully");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Delete Item Error:", error);
      alert("Failed to delete item");
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; }
        .browse-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.09); }
        .browse-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .modal-backdrop { animation: fadeIn 0.18s ease; }
        .modal-box { animation: slideUp 0.22s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .form-input { width: 100%; padding: 11px 14px; border: 1px solid #E0DED8; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff; color: #111; }
        .form-input:focus { border-color: #0F6E56; box-shadow: 0 0 0 3px rgba(15,110,86,0.1); }
        .btn-primary { background: #0F6E56; color: #fff; border: none; border-radius: 10px; padding: 11px 20px; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: background 0.2s; }
        .btn-primary:hover { background: #085041; }
        .btn-danger { background: #fff; color: #A32D2D; border: 1.5px solid #F7C1C1; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: background 0.2s, border-color 0.2s; }
        .btn-danger:hover { background: #FCEBEB; border-color: #E24B4A; }
        .btn-ghost { background: #F5F4F0; color: #444; border: none; border-radius: 10px; padding: 11px 20px; font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer; transition: background 0.2s; }
        .btn-ghost:hover { background: #ECEAE3; }
        .close-btn { background: none; border: none; cursor: pointer; color: #bbb; border-radius: 8px; padding: 6px; display: flex; align-items: center; justify-content: center; transition: color 0.15s, background 0.15s; }
        .close-btn:hover { color: #333; background: #F5F4F0; }
        .footer-social-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #8BA89E; cursor: pointer; transition: all 0.2s; background: transparent; }
        .footer-social-btn:hover { border-color: #0F6E56; color: #fff; background: #0F6E56; }
        .footer-link { font-size: 13px; color: #8BA89E; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: #fff; }
        .footer-bottom-link { font-size: 12px; color: #4D706A; text-decoration: none; transition: color 0.2s; }
        .footer-bottom-link:hover { color: #8BA89E; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px', fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif" }}>

        {/* Page Header */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Marketplace</p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '36px', fontWeight: 700, color: '#0D0D0D', margin: 0, letterSpacing: '-0.02em' }}>
              Browse Available Items
            </h1>
          </div>
          {userRole === 'ADMIN' && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E1F5EE', color: '#0F6E56', borderRadius: '100px', padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} />
              Admin View
            </div>
          )}
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', color: '#bbb', fontSize: '15px' }}>
            Loading items…
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', background: '#fff', borderRadius: '20px', border: '1.5px dashed #E0DED8', color: '#bbb' }}>
            <Package size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ fontSize: '16px', margin: 0 }}>No products available yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {items.map(item => (
              <div
                key={item.id}
                className="browse-card"
                onClick={() => handleCardClick(item)}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  border: '1px solid #ECEAE3',
                  overflow: 'hidden',
                  cursor: userRole === 'ADMIN' ? 'pointer' : 'default'
                }}
              >
                <ItemCard item={item} userRole={userRole} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedItem && userRole === "ADMIN" && !isEditingItem && (
        <div
          className="modal-backdrop"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedItem(null); }}
        >
          <div className="modal-box" style={{ background: '#fff', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #F0EEE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#111', margin: 0 }}>{selectedItem.title}</h2>
              <button className="close-btn" onClick={() => setSelectedItem(null)}><X size={20} /></button>
            </div>

            <div style={{ padding: '28px' }}>
              {selectedItem.image ? (
                <div style={{ width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', background: '#F5F4F0' }}>
                  <img src={selectedItem.image} alt={selectedItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: '100%', height: '200px', borderRadius: '16px', border: '1.5px dashed #E0DED8', marginBottom: '24px', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#ccc' }}>
                  <Package size={32} />
                  <span style={{ fontSize: '13px' }}>No Image</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div style={{ gridColumn: '1 / -1', background: '#FAFAF8', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: '0 0 6px' }}>Description</p>
                  <p style={{ fontSize: '14px', color: '#333', margin: 0, lineHeight: 1.6 }}>{selectedItem.description || 'N/A'}</p>
                </div>

                {[
                  { label: 'Price', value: `Rs. ${selectedItem.price}/day`, icon: <DollarSign size={14} /> },
                  { label: 'Deposit', value: `Rs. ${selectedItem.deposit}`, icon: <DollarSign size={14} /> },
                  { label: 'Rating', value: selectedItem.rating || 'N/A', icon: <Star size={14} /> },
                  { label: 'Location', value: selectedItem.location || 'N/A', icon: <MapPin size={14} /> },
                ].map((d, i) => (
                  <div key={i} style={{ background: '#FAFAF8', borderRadius: '12px', padding: '14px 16px' }}>
                    <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#0F6E56' }}>{d.icon}</span>{d.label}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#111', margin: 0 }}>{d.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={() => handleEditClick(selectedItem)}>
                  <Edit2 size={15} /> Edit Details
                </button>
                <button className="btn-danger" onClick={() => handleDeleteItem(selectedItem.id)}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditingItem && userRole === "ADMIN" && (
        <div
          className="modal-backdrop"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditingItem(null); }}
        >
          <div className="modal-box" style={{ background: '#fff', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #F0EEE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#111', margin: 0 }}>Edit Item</h2>
              <button className="close-btn" onClick={() => setIsEditingItem(null)}><X size={20} /></button>
            </div>

            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>Title *</label>
                <input type="text" name="title" value={editFormData.title} onChange={handleInputChange} className="form-input" placeholder="Product title" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>Description *</label>
                <textarea name="description" value={editFormData.description} onChange={handleInputChange} className="form-input" rows="3" placeholder="Describe the item…" style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>Price (Rs.) *</label>
                  <input type="number" name="price" value={editFormData.price} onChange={handleInputChange} className="form-input" placeholder="0" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>Deposit (Rs.) *</label>
                  <input type="number" name="deposit" value={editFormData.deposit} onChange={handleInputChange} className="form-input" placeholder="0" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>Rating (0–5)</label>
                <input type="number" step="0.1" min="0" max="5" name="rating" value={editFormData.rating} onChange={handleInputChange} className="form-input" placeholder="0.0" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditImageChange(e.target.files[0])}
                  style={{ width: '100%', padding: '10px 14px', border: '1px dashed #D0CEC8', borderRadius: '10px', fontSize: '13px', color: '#777', cursor: 'pointer', background: '#FAFAF8' }}
                />
                {editFormData.image && (
                  <div style={{ marginTop: '12px', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ECEAE3' }}>
                    <img src={editFormData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: '1px solid #F0EEE8' }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSaveEdit}>
                  <Save size={15} /> Save Changes
                </button>
                <button className="btn-ghost" style={{ flex: 1, textAlign: 'center' }} onClick={() => setIsEditingItem(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
}