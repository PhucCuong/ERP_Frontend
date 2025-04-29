import React, { useState, useEffect } from "react";
import axios from "axios";
import "./tonkho.css";
import BoSungNVL from "./BoSungNVL";

const TonKho = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

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

  const handleBoSungClick = (material) => {
    setSelectedMaterial(material);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMaterial(null);
  };

  return (
    <div className="raw-materials-container">
      <h2>Danh sách Tồn Kho Nguyên Vật Liệu</h2>

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Đang tải...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="error-message">{error}</td>
              </tr>
            ) : (
              rawMaterials
                .filter((material) =>
                  material.tenNguyenVatLieu.toLowerCase().includes(search.toLowerCase())
                )
                .map((material) => (
                  <React.Fragment key={material.id}>
                    <tr>
                      <td>{material.tenNguyenVatLieu}</td>
                      <td>{material.tonKhoHienCo}</td>
                      <td>{material.tonKhoToiThieu}</td>
                      <td>{material.tonKhoToiDa}</td>
                      <td>{material.donViTinh}</td>
                      <td>
                        {material.tonKhoHienCo < material.tonKhoToiThieu ? (
                          <span style={{ color: "red", fontWeight: "bold" }}>!Cần đặt hàng</span>
                        ) : material.tonKhoHienCo > material.tonKhoToiDa ? (
                          <span style={{ color: "#ff9900", fontWeight: "bold" }}>⚠️Vượt tồn kho tối đa</span>
                        ) : (
                          <span style={{ color: "green", fontWeight: "bold" }}> Đủ</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleBoSungClick(material)}
                          className="bo-sung-link"
                        >
                          ➕ Bổ sung hàng
                        </button>
                      </td>
                    </tr>

                   
                  </React.Fragment>
                ))
            )}
          </tbody>

        </table>
      </div>

      {/* Hiển thị form bổ sung nếu người dùng chọn */}
      {showForm && selectedMaterial && (
        <BoSungNVL selectedMaterial={selectedMaterial} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default TonKho;
