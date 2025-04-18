import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "./NhaCungCap.css";

const API_NCC = 'https://localhost:7135/api/NhaCungCap';
const API_NVL = 'https://localhost:7135/api/NguyenVatLieux';

const NhaCungCapPage = () => {
  const [dsNCC, setDsNCC] = useState([]);
  const [dsNVL, setDsNVL] = useState([]);
  const [form, setForm] = useState({
    tenNhaCungCap: '',
    diaChi: '',
    soDienThoai: '',
    email: '',
    ghiChu: '',
    maNguyenVatLieu: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // 👈 toggle form

  // Fetch Nhà Cung Cấp (NCC) from API
  const fetchNCC = async () => {
    try {
      const res = await axios.get(API_NCC);
      setDsNCC(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu NCC:', err);
    }
  };

  // Fetch Nguyên Vật Liệu (NVL) from API
  const fetchNVL = async () => {
    try {
      const res = await axios.get(API_NVL);
      setDsNVL(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy NVL:', err);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchNCC();
    fetchNVL();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for adding or updating NCC
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Tạo dữ liệu cần gửi
    const requestData = {
      tenNhaCungCap: form.tenNhaCungCap,
      diaChi: form.diaChi,
      soDienThoai: form.soDienThoai,
      email: form.email,
      ghiChu: form.ghiChu,
      maNguyenVatLieu: form.maNguyenVatLieu
    };
  
    if (editingId) {
      requestData.maNhaCungCap = editingId; // chỉ gán khi cập nhật
    }
  
    try {
        let res;
        if (editingId) {
          res = await axios.put(`${API_NCC}/${editingId}`, requestData);
          toast.success('Cập nhật nhà cung cấp thành công!');
          await fetchNCC(); 
        } else {
          res = await axios.post(API_NCC, requestData);
          toast.success('Thêm nhà cung cấp mới thành công!');
          setDsNCC((prev) => [...prev, res.data]);
        }
      
        // Reset form và đóng form
        setForm({
          tenNhaCungCap: '',
          diaChi: '',
          soDienThoai: '',
          email: '',
          ghiChu: '',
          maNguyenVatLieu: ''
        });
        setEditingId(null);
        setShowForm(false);
      } catch (err) {
        console.error('Lỗi khi lưu:', err.response?.data || err.message);
        toast.error('Có lỗi xảy ra!');
      }      
  };
  
  

  // Edit existing NCC
  const handleEdit = (ncc) => {
    setForm({
      tenNhaCungCap: ncc.tenNhaCungCap,
      diaChi: ncc.diaChi,
      soDienThoai: ncc.soDienThoai,
      email: ncc.email,
      ghiChu: ncc.ghiChu,
      maNguyenVatLieu: ncc.maNguyenVatLieu
    });
    setEditingId(ncc.maNhaCungCap); // Set NCC ID to editing
    setShowForm(true); // Show form for editing
  };

  // Delete NCC
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await axios.delete(`${API_NCC}/${id}`);
        fetchNCC();
        toast.success('Xóa nhà cung cấp thành công!');
      } catch (err) {
        console.error('Lỗi khi xóa:', err);
        toast.error('Có lỗi xảy ra khi xóa!');
      }
    }
  };

  // Get Nguyên Vật Liệu by ID
  const getNguyenVatLieu = (maNguyenVatLieu) => {
    return dsNVL.find((x) => x.maNguyenVatLieu === maNguyenVatLieu);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 Quản lý Nhà Cung Cấp</h2>

      {/* Button to toggle form visibility */}
      <button
        className="ncc-toggle-btn"
        onClick={() => {
          setShowForm(!showForm);
          setForm({
            tenNhaCungCap: '',
            diaChi: '',
            soDienThoai: '',
            email: '',
            ghiChu: '',
            maNguyenVatLieu: ''
          });
          setEditingId(null);
        }}
      >
        {showForm ? 'Ẩn Form' : '➕ Thêm nhà cung cấp'}
      </button>

      {/* Form to add or edit NCC */}
      <form onSubmit={handleSubmit} className={`ncc-form ${showForm ? 'show' : ''} space-y-3 mb-6 bg-blue-50 p-4 rounded shadow`}>
        <div className="grid grid-cols-2 gap-4">
          <input name="tenNhaCungCap" value={form.tenNhaCungCap} onChange={handleChange} placeholder="Tên nhà cung cấp" required className="p-2 border rounded" />
          <input name="diaChi" value={form.diaChi} onChange={handleChange} placeholder="Địa chỉ" className="p-2 border rounded" />
          <input name="soDienThoai" value={form.soDienThoai} onChange={handleChange} placeholder="Số điện thoại" className="p-2 border rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
          <select name="maNguyenVatLieu" value={form.maNguyenVatLieu} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">-- Chọn Nguyên vật liệu --</option>
            {dsNVL.map((nvl) => (
              <option key={nvl.maNguyenVatLieu} value={nvl.maNguyenVatLieu}>
                {nvl.tenNguyenVatLieu}
              </option>
            ))}
          </select>
        </div>
        <textarea name="ghiChu" value={form.ghiChu} onChange={handleChange} placeholder="Ghi chú" className="p-2 border rounded w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingId ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>

      {/* NCC Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-blue-100 text-left">
            <th className="border p-2">Tên NCC</th>
            <th className="border p-2">Địa chỉ</th>
            <th className="border p-2">SĐT</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Ghi chú</th>
            <th className="border p-2">Nguyên vật liệu</th>
            <th className="border p-2 text-right">Giá nhập</th>
            <th className="border p-2">Đơn vị</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dsNCC.map((ncc) => {
            const nvl = getNguyenVatLieu(ncc.maNguyenVatLieu) || {};
            return (
              <tr key={ncc.maNhaCungCap}>
                <td className="border p-2">{ncc.tenNhaCungCap}</td>
                <td className="border p-2">{ncc.diaChi}</td>
                <td className="border p-2">{ncc.soDienThoai}</td>
                <td className="border p-2">{ncc.email}</td>
                <td className="border p-2">{ncc.ghiChu}</td>
                <td className="border p-2">{nvl.tenNguyenVatLieu || ''}</td>
                <td className="border p-2 text-right">
                  {nvl.giaNhap != null ? `${nvl.giaNhap.toLocaleString('vi-VN')} VNĐ` : ''}
                </td>
                <td className="border p-2">{nvl.donViTinh || ''}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleEdit(ncc)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Sửa</button>
                  <button onClick={() => handleDelete(ncc.maNhaCungCap)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <ToastContainer />
    </div>
  );
};

export default NhaCungCapPage;
