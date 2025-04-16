import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddProcessForm.css";
import ActivityDetails from "./ActivityDetails";

const AddProcessForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tenQuyTrinh: "",
        moTa: "",
        hoatDong: [],
        maSanPham: ""
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productList, setProductList] = useState([]);

    // biến lưu danh sách quy trình sản xuất
    const [processes, setProcesses] = useState([])

    // biến lưu các chi tiết hoạt động sản xuất
    const [activities, setActivities] = useState([])

    // Lấy danh sách sản phẩm khi load component
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://localhost:7135/api/SanPhamx");
                setProductList(response.data);

                const response2 = await axios.get("https://localhost:7135/api/QuyTrinhSanXuatx");
                setProcesses(response2.data)

                callApiGetActivityList()
            } catch (error) {
                toast.error("Không thể lấy danh sách sản phẩm!");
            }
        };

        fetchProducts();
    }, []);

    const callApiGetActivityList = async () => {
        const response = await axios.get("https://localhost:7135/api/ChiTietHoatDongSanXuats");
        setActivities(response.data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("https://localhost:7135/api/QuyTrinhSanXuatx", formData);
            toast.success("Lưu thành công!");
        } catch (error) {
            toast.error("Lỗi kết nối đến server!");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => navigate("/productionprocess");

    const handleAddRow = () => setShowModal(true);

    const handleSaveActivity = (activity) => {
        setFormData(prev => ({
            ...prev,
            hoatDong: [...prev.hoatDong, {
                ...activity,
                id: Date.now()
            }]
        }));
        setShowModal(false);
        callApiGetActivityList()
    };

    function getTenQuyTrinhByMa(maQuyTrinh) {
        const found = processes.find(p => p.maQuyTrinh === maQuyTrinh);
        return found ? found.tenQuyTrinh : null;
    }

    return (
        <div className="add-process-form-container">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="header">
                <h2 className="form-title">Thêm quy trình sản xuất / hoạt động sản xuất</h2>
                <div className="action-buttons">
                    <button className="cancel-button" onClick={handleCancel}>
                        HỦY BỎ
                    </button>
                </div>
            </div>

            <div
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
            >
                {/* FORM 1: Thông tin chung */}
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <h2 className="form-title">Quy trình sản xuất / Mới</h2>
                        <div className="form-body">
                            <label className="form-label">Sản phẩm*</label>
                            <select
                                className="form-input"
                                value={formData.maSanPham}
                                onChange={(e) =>
                                    setFormData({ ...formData, maSanPham: e.target.value })
                                }
                                required
                            >
                                <option value="">-- Chọn sản phẩm --</option>
                                {productList.map((product) => (
                                    <option key={product.maSanPham} value={product.maSanPham}>
                                        {product.tenSanPham}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label">Tên quy trình sản xuất*</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.tenQuyTrinh}
                                onChange={(e) =>
                                    setFormData({ ...formData, tenQuyTrinh: e.target.value })
                                }
                                required
                            />
                            <button
                                className="save-button"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Đang lưu..." : "LƯU"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* chia tại đây */}

                {/* FORM 2: Danh sách hoạt động */}
                <div style={{ flex: 1, marginLeft: 100 }}>
                    <div onSubmit={(e) => e.preventDefault()} style={{ width: '100%', boxSizing: 'border-box' }}>
                        <h2 className="form-title">Hoạt động sản xuất / Mới</h2>

                        <div className="activity-table-container">
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Tên quy trình</th>
                                        <th>Tên hoạt động</th>
                                        <th>Thời gian dự kiến (phút)</th>
                                        <th>Điều kiện bắt đầu công đoạn tiếp theo</th>
                                        <th>Mô tả / Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((activity, index) => (
                                        <tr key={activity.id || index}>
                                            <td>{getTenQuyTrinhByMa(activity.maQuyTrinh)}</td>
                                            <td>{activity.tenHoatDong}</td>
                                            <td>{activity.thoiGianMacDinh}</td>
                                            <td>{activity.dieuKienBatDauGiaiDoanTiepTheo}</td>
                                            <td>{activity.moTa}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <button
                                            className="add-row-button"
                                            onClick={handleAddRow}
                                            type="button"
                                        >
                                            + Thêm một hoạt động
                                        </button>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {showModal && (
                            <ActivityDetails
                                onSave={handleSaveActivity}
                                onCancel={() => setShowModal(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AddProcessForm;
