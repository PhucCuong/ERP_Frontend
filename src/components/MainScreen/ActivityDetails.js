import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ActivityDetails.css";
import { ToastContainer, toast } from 'react-toastify';

const ActivityDetails = ({ onSave, onCancel }) => {
    const navigate = useNavigate();
    const inputIndexRef = useRef(null);

    const [activeTab, setActiveTab] = useState("moTa");
    const [quyTrinhList, setQuyTrinhList] = useState([]);
    const [newActivity, setNewActivity] = useState({
        maQuyTrinh: "",
        hoatDong: "",
        congDoan: "",
        thuTu: "",
        soLuongChoXuLy: "",
        dieuKienBatDau: "",
        thoiGianMacDinh: "",
        moTa: "",
        banVe: null,
        fileName: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [processId, setProcessId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'maQuyTrinh') {
            setProcessId(value);
        }
        setNewActivity(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchQuyTrinh = async () => {
            try {
                const response = await axios.get("https://localhost:7135/api/QuyTrinhSanXuatx");
                setQuyTrinhList(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách quy trình:", error);
                setError("Không thể tải danh sách quy trình sản xuất");
                notify_error("Không thể tải danh sách quy trình sản xuất");
            }
        };

        fetchQuyTrinh();
    }, []);

    const handleFileUpload = (e) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.type !== "application/pdf") {
                setError("Vui lòng chọn file PDF");
                notify_error("Vui lòng chọn file PDF");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("Kích thước file không được vượt quá 5MB");
                notify_error("Kích thước file không được vượt quá 5MB");
                return;
            }

            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);

            setNewActivity(prev => ({
                ...prev,
                banVe: file,
                fileName: file.name
            }));
        }
    };

    const validateForm = () => {
        if (!newActivity.maQuyTrinh) {
            setError("Vui lòng chọn quy trình");
            notify_error("Vui lòng chọn quy trình");
            return false;
        }
        if (!newActivity.hoatDong.trim()) {
            setError("Vui lòng nhập tên hoạt động");
            notify_error("Vui lòng nhập tên hoạt động");
            return false;
        }
        if (!newActivity.congDoan.trim()) {
            setError("Vui lòng nhập công đoạn sản xuất");
            notify_error("Vui lòng nhập công đoạn sản xuất");
            return false;
        }
        if (!newActivity.thuTu || isNaN(newActivity.thuTu)) {
            setError("Vui lòng nhập trình tự hợp lệ");
            notify_error("Vui lòng nhập trình tự hợp lệ");
            return false;
        }
        if (!newActivity.thoiGianMacDinh || isNaN(newActivity.thoiGianMacDinh)) {
            setError("Vui lòng nhập thời gian mặc định hợp lệ");
            notify_error("Vui lòng nhập thời gian mặc định hợp lệ");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (isSubmitting) return;
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Tạo hoạt động mới
            const activityData = new FormData();
            activityData.append("MaQuyTrinh", newActivity.maQuyTrinh);
            activityData.append("TenHoatDong", newActivity.hoatDong);
            activityData.append("GiaiDoanSanXuat", newActivity.congDoan);
            activityData.append("ThuTu", newActivity.thuTu);
            activityData.append("SoLuongChoXuLy", newActivity.soLuongChoXuLy || "0");
            activityData.append("DieuKienBatDauGiaiDoanTiepTheo", newActivity.dieuKienBatDau || "");
            activityData.append("ThoiGianMacDinh", newActivity.thoiGianMacDinh);
            activityData.append("MoTa", newActivity.moTa || "");

            const response = await axios.post(
                "https://localhost:7135/api/ChiTietHoatDongSanXuats",
                activityData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            const maHoatDong = response.data.maHoatDong;
            if (!maHoatDong) {
                throw new Error("Không nhận được mã hoạt động từ server");
            }

            // Upload file PDF nếu có
            if (newActivity.banVe) {
                try {
                    const fileData = new FormData();
                    fileData.append("file", newActivity.banVe);

                    await axios.post(
                        `https://localhost:7135/api/ChiTietHoatDongSanXuats/${maHoatDong}/upload`,
                        fileData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            }
                        }
                    );
                } catch (uploadError) {
                    console.error("Lỗi khi upload file:", uploadError);
                    notify_error("Lưu hoạt động thành công nhưng upload file không thành công");
                }
            }

            notify_success("Lưu hoạt động thành công!");
            
            // Xử lý sau khi lưu thành công
            setTimeout(() => {
                if (typeof onSave === 'function') {
                    onSave(response.data);
                } else {
                    navigate(-1); // Mặc định quay lại trang trước nếu không có onSave
                }
            }, 2000);

        } catch (error) {
            console.error("Lỗi trong quá trình lưu:", error);
            let errorMessage = "Lưu thất bại, vui lòng thử lại!";
            
            if (error.response) {
                errorMessage = error.response.data?.message ||
                    error.response.data?.title ||
                    "Dữ liệu không hợp lệ";
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            notify_error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        if (typeof onCancel === 'function') {
            onCancel();
        } else {
            navigate(-1); // Mặc định quay lại trang trước nếu không có onCancel
        }
    };

    const checkThuTu = async (e) => {
        const index = e.target.value;

        if (index === "" || isNaN(index)) {
            notify_error('Hãy điền vào ô trình tự');
            inputIndexRef.current.style.borderColor = 'red';
            return;
        }

        const requestbody = {
            maQuyTrinh: processId,
            thuTu: index
        };

        try {
            const response = await axios.post(
                'https://localhost:7135/api/ChiTietHoatDongSanXuats/kiem-tra-thu-tu', 
                requestbody
            );

            if (response.data.success === false) {
                notify_error(response.data.message);
                inputIndexRef.current.value = '';
                inputIndexRef.current.style.borderColor = 'red';
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra thứ tự:", error);
            notify_error("Có lỗi xảy ra khi kiểm tra thứ tự");
        }
    };

    const handleFocus = () => {
        inputIndexRef.current.style.borderColor = 'black';
    };

    // Clean up preview URL khi component unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Thêm Hoạt động</h3>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>Chọn Quy trình*</label>
                    <select
                        name="maQuyTrinh"
                        value={newActivity.maQuyTrinh}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    >
                        <option value="">-- Chọn quy trình --</option>
                        {quyTrinhList.map(qt => (
                            <option key={qt.maQuyTrinh} value={qt.maQuyTrinh}>
                                {qt.tenQuyTrinh}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Hoạt động*</label>
                    <input
                        type="text"
                        name="hoatDong"
                        value={newActivity.hoatDong}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Nhập tên hoạt động"
                    />
                </div>

                <div className="form-group">
                    <label>Công đoạn sản xuất*</label>
                    <input
                        type="text"
                        name="congDoan"
                        value={newActivity.congDoan}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Nhập công đoạn sản xuất"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Trình tự*</label>
                        <input
                            type="number"
                            name="thuTu"
                            value={newActivity.thuTu}
                            onChange={handleChange}
                            onBlur={checkThuTu}
                            required
                            disabled={isSubmitting}
                            min="1"
                            ref={inputIndexRef}
                            onFocus={handleFocus}
                        />
                    </div>

                    <div className="form-group">
                        <label>Số lượng chờ xử lý</label>
                        <input
                            type="number"
                            name="soLuongChoXuLy"
                            value={newActivity.soLuongChoXuLy}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            min="0"
                            placeholder="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Thời gian mặc định (phút)*</label>
                        <input
                            type="number"
                            name="thoiGianMacDinh"
                            value={newActivity.thoiGianMacDinh}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            min="1"
                            placeholder="1"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Bắt đầu công đoạn kế tiếp</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="dieuKienBatDau"
                                value="Khi tất cả hoàn thành"
                                checked={newActivity.dieuKienBatDau === "Khi tất cả hoàn thành"}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            Khi tất cả hoàn thành
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="dieuKienBatDau"
                                value="Khi một số hoàn thành"
                                checked={newActivity.dieuKienBatDau === "Khi một số hoàn thành"}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            Khi một số hoàn thành
                        </label>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        type="button"
                        className={`tab ${activeTab === "moTa" ? "active" : ""}`}
                        onClick={() => setActiveTab("moTa")}
                        disabled={isSubmitting}
                    >
                        Mô tả
                    </button>
                    <button
                        type="button"
                        className={`tab ${activeTab === "fileData" ? "active" : ""}`}
                        onClick={() => setActiveTab("fileData")}
                        disabled={isSubmitting}
                    >
                        Bản vẽ
                    </button>
                </div>

                {activeTab === "moTa" ? (
                    <div className="form-group">
                        <textarea
                            name="moTa"
                            value={newActivity.moTa}
                            onChange={handleChange}
                            placeholder="Nhập mô tả chi tiết về hoạt động..."
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Tải lên file PDF</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={isSubmitting}
                        />
                        {newActivity.fileName && (
                            <div className="file-info">
                                <span>File đã chọn: {newActivity.fileName}</span>
                                {previewUrl && (
                                    <a
                                        href={previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="preview-link"
                                    >
                                        Xem trước
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="save-button"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Đang lưu...
                            </>
                        ) : "Lưu"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="cancel-button"
                    >
                        Hủy
                    </button>
                </div>
            </div>

            <ToastContainer theme="colored" />
        </div>
    );
};

const notify_success = (message) => toast.info(message, {
    type: "success"
});

const notify_error = (message) => toast.info(message, {
    type: "error"
});

export default ActivityDetails;