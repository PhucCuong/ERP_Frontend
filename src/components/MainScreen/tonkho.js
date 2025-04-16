import React, { useState, useEffect } from "react";
import axios from "axios";
import "./tonkho.css"; // Nếu có CSS riêng cho bảng

const TonKho = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7135/api/NguyenVatLieux");
        setRawMaterials(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="raw-materials-container">
      <h2>Danh sách Tồn Kho Nguyên Vật Liệu</h2>

      {/* Tìm kiếm */}
      <div className="raw-materials-search">
        <input
          type="text"
          placeholder="Tìm kiếm nguyên vật liệu..."
          className="raw-materials-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="raw-materials-table-container">
        <table className="raw-materials-table">
          <thead>
            <tr>
              <th>Tên Nguyên Vật Liệu</th>
              <th>Tồn Kho Hiện Có</th>
              <th>Số Lượng Tối Thiểu</th>
              <th>Số Lượng Tối Đa</th>
              <th>Đơn Vị</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Đang tải...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="error-message">{error}</td>
              </tr>
            ) : (
              rawMaterials.map((material) => (
                  <tr key={material.id}>
                    <td>{material.tenNguyenVatLieu}</td>
                    <td>{material.tonKhoHienCo}</td>
                    <td>{material.tonKhoToiThieu}</td>
                    <td>{material.tonKhoToiDa}</td>
                    <td>{material.donViTinh}</td>
                    <td>
                      {material.tonKhoHienCo < material.tonKhoToiThieu ? (
                        <span style={{ color: "red" }}>Cần đặt hàng</span>
                      ) : (
                        <span style={{ color: "green" }}>Đủ</span>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TonKho;
