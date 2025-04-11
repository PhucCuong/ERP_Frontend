import { useState } from "react";
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
        hoatDong: []
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
                id: Date.now() // Thêm ID để làm key
            }]
        }));
        setShowModal(false);
    };

    return (
        <div className="add-process-form-container">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="header">
                <h2 className="form-title">Quy trình sản xuất / Mới</h2>
                <div className="action-buttons">
                    <button 
                        className="save-button" 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : "LƯU"}
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                        HỦY BỎ
                    </button>
                </div>
            </div>

            <div className="form-body">
                <label className="form-label">Tên quy trình sản xuất*</label>
                <input 
                    type="text" 
                    className="form-input" 
                    value={formData.tenQuyTrinh}
                    onChange={(e) => setFormData({...formData, tenQuyTrinh: e.target.value})}
                    required
                />
            </div>

            <div className="tab-container">
                <button className="tab active">Hoạt động Sản xuất</button>
            </div>

            <div className="activity-table-container">
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Hoạt động</th>
                            <th>Công đoạn sản xuất</th>
                            <th>Thời lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.hoatDong.map((activity, index) => (
                            <tr key={activity.id}>
                                <td>{index + 1}</td>
                                <td>{activity.hoatDong}</td>
                                <td>{activity.congDoan}</td>
                                <td>{activity.thoiGianMacDinh}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="4">
                                <button 
                                    className="add-row-button" 
                                    onClick={handleAddRow}
                                    type="button"
                                >
                                    + Thêm một dòng
                                </button>
                            </td>
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
    );
};

export default AddProcessForm;