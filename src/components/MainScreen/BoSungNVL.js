import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BoSungNVL.css";

const BoSungNVL = ({ selectedMaterial, onClose }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    maNhaCungCap: "",
    tenNhaCungCap: "",
    tenNguyenVatLieu: selectedMaterial?.tenNguyenVatLieu || "",
    donViTinh: "",
    giaNhap: 0,
    soLuong: "",
    ngayGiaoHang: "",
    ngayBoSung: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, materialsRes] = await Promise.all([
          axios.get("https://localhost:7135/api/NhaCungCap"),
          axios.get("https://localhost:7135/api/NguyenVatLieux"),
        ]);
        setSuppliers(suppliersRes.data);
        setMaterials(materialsRes.data);

        const matchedSupplier = suppliersRes.data.find(
          (ncc) => ncc.maNguyenVatLieu === selectedMaterial?.maNguyenVatLieu
        );

        if (matchedSupplier) {
          const matchedMaterial = materialsRes.data.find(
            (mat) => mat.maNguyenVatLieu === matchedSupplier.maNguyenVatLieu
          );

          setFormData((prev) => ({
            ...prev,
            maNhaCungCap: matchedSupplier.maNhaCungCap,
            tenNhaCungCap: matchedSupplier.tenNhaCungCap,
            tenNguyenVatLieu: matchedMaterial?.tenNguyenVatLieu || "",
            donViTinh: matchedMaterial?.donViTinh || "",
            giaNhap: matchedMaterial?.giaNhap || 0,
          }));
        } else {
          alert("Không có nhà cung cấp phù hợp với nguyên vật liệu này.");
          onClose();
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, [selectedMaterial, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tongTien =
      formData.soLuong && formData.giaNhap
        ? parseInt(formData.soLuong) * parseFloat(formData.giaNhap)
        : 0;

    const yeuCauData = {
      maNguyenVatLieu: selectedMaterial?.maNguyenVatLieu,
      soLuongCanThiet: parseInt(formData.soLuong),
      maNhaCungCap: formData.maNhaCungCap,
      ngayGiaoHangDuKien: formData.ngayGiaoHang,
      ngayTao: formData.ngayBoSung,
      tongTien: tongTien, 
    };

    try {
      // Gửi yêu cầu bổ sung nguyên vật liệu
      await axios.post("https://localhost:7135/api/YeuCauNguyenVatLieux", yeuCauData);

      // Cập nhật tồn kho nguyên vật liệu
      const updatedMaterialData = {
        ...selectedMaterial,
        tonKhoHienCo: selectedMaterial.tonKhoHienCo + parseInt(formData.soLuong), // Tăng số lượng tồn kho
      };

      await axios.put(
        `https://localhost:7135/api/NguyenVatLieux/${selectedMaterial.maNguyenVatLieu}`,
        updatedMaterialData
      );

      alert("Đã gửi yêu cầu bổ sung và cập nhật tồn kho!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu hoặc cập nhật tồn kho:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu hoặc cập nhật tồn kho!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Bổ sung nguyên vật liệu</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên nguyên vật liệu:</label>
            <input type="text" value={formData.tenNguyenVatLieu} readOnly />
          </div>

          <div className="form-group">
            <label>Đơn vị tính:</label>
            <input type="text" value={formData.donViTinh} readOnly />
          </div>

          <div className="form-group">
            <label>Tên nhà cung cấp:</label>
            <input type="text" value={formData.tenNhaCungCap} readOnly />
          </div>

          <div className="form-group">
            <label>Giá nhập:</label>
            <input
              type="text"
              value={Number(formData.giaNhap).toLocaleString("vi-VN") + " VNĐ"}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Số lượng:</label>
            <input
              type="number"
              value={formData.soLuong}
              onChange={(e) =>
                setFormData({ ...formData, soLuong: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Tổng tiền:</label>
            <input
              type="text"
              value={
                formData.soLuong && formData.giaNhap
                  ? (
                      parseInt(formData.soLuong) * parseFloat(formData.giaNhap)
                    ).toLocaleString("vi-VN") + " VNĐ"
                  : "0 VNĐ"
              }
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Ngày giao hàng dự kiến:</label>
            <input
              type="date"
              value={formData.ngayGiaoHang}
              onChange={(e) =>
                setFormData({ ...formData, ngayGiaoHang: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Ngày bổ sung:</label>
            <input
              type="date"
              value={formData.ngayBoSung}
              onChange={(e) =>
                setFormData({ ...formData, ngayBoSung: e.target.value })
              }
              required
            />
          </div>

          <div className="button-group">
            <button type="submit">Gửi</button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoSungNVL;
