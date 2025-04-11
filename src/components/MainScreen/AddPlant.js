import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddPlant.css'
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";
const AddPlant = ({ userName }) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        maSanPham: '',
        maNhaMay: '',
        soLuong: 0,
        ngayBatDauDuKien: '',
        ngayKetThucDuKien: '',
        mucTonKhoAnToan: 0,
        soLuongSanXuatToiThieu: 0,
        soLuongSanXuatToiDa: 0,
        trangThai: '',
        nguoiTao: '',
        ngayTao: ''
    });

    const [loading, setLoading] = useState(false);

    const [sanPhams, setSanPhams] = useState([]);
    const [nhaMays, setNhaMays] = useState([]);

    const notify_success = (message) => toast.info(message, { type: "success" });
    const notify_error = (message) => toast.info(message, { type: "error" });

    useEffect(() => {
        axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => {
                setSanPhams(response.data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        axios.get('https://localhost:7135/api/NhaMayx')
            .then(response => {
                setNhaMays(response.data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clickBackManfacturingOrders = () => {
        navigate('/manfacturingorders')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedData = {
            ...formData,
            nguoiTao: userName,
            ngayTao: new Date().toISOString()
        };

        try {
            const res = await axios.post('https://localhost:7135/api/KeHoachSanXuatx', updatedData);
            notify_success("Thêm Kế hoạch sản xuất thành công!");
            setLoading(false);
            console.log(res.data);
        } catch (err) {
            let errorMsg = 'Có lỗi xảy ra!';

            if (err.response) {
                if (err.response.data && typeof err.response.data === 'string') {
                    errorMsg += ' ' + err.response.data;
                } else if (err.response.data && err.response.data.message) {
                    errorMsg += ' ' + err.response.data.message;
                } else {
                    errorMsg += ` Status code: ${err.response.status}`;
                }
            } else {
                errorMsg += ' ' + err.message;
            }

            notify_error(errorMsg);
            setLoading(false);
            console.error('Lỗi chi tiết:', err);
        }
    };


    return (
        <div>
            <h2>Thêm kế hoạch sản xuất</h2>
            <button className='manfacturing-create-close-button' onClick={() => clickBackManfacturingOrders()}>
                <IoMdClose className='manfacturing-detail-close-icon' />
            </button>
            <form onSubmit={handleSubmit}>
                <label>Sản Phẩm</label><br />
                <select name="maSanPham" value={formData.maSanPham} onChange={handleChange} required>
                    <option value="">-- Chọn sản phẩm --</option>
                    {sanPhams.map(sp => (
                        <option key={sp.maSanPham} value={sp.maSanPham}>{sp.tenSanPham}</option>
                    ))}
                </select><br />

                <label>Nhà Máy</label><br />
                <select name="maNhaMay" value={formData.maNhaMay} onChange={handleChange} required>
                    <option value="">-- Chọn nhà máy --</option>
                    {nhaMays.map(nm => (
                        <option key={nm.maNhaMay} value={nm.maNhaMay}>{nm.tenNhaMay}</option>
                    ))}
                </select><br />


                <label>Số Lượng</label><br />
                <input type="number" name="soLuong" placeholder="Số Lượng" value={formData.soLuong} onChange={handleChange} required /><br />

                <label>Ngày Bắt Đầu Dự Kiến</label><br />
                <input type="datetime-local" name="ngayBatDauDuKien" value={formData.ngayBatDauDuKien} onChange={handleChange} required /><br />

                <label>Ngày Kết Thúc Dự Kiến</label><br />
                <input type="datetime-local" name="ngayKetThucDuKien" value={formData.ngayKetThucDuKien} onChange={handleChange} required /><br />

                <label>Mức Tồn Kho An Toàn</label><br />
                <input type="number" name="mucTonKhoAnToan" placeholder="Mức Tồn Kho An Toàn" value={formData.mucTonKhoAnToan} onChange={handleChange} required /><br />

                <label>Sản Xuất Tối Thiểu</label><br />
                <input type="number" name="soLuongSanXuatToiThieu" placeholder="Sản Xuất Tối Thiểu" value={formData.soLuongSanXuatToiThieu} onChange={handleChange} required /><br />

                <label>Sản Xuất Tối Đa</label><br />
                <input type="number" name="soLuongSanXuatToiDa" placeholder="Sản Xuất Tối Đa" value={formData.soLuongSanXuatToiDa} onChange={handleChange} required /><br />

                <label>Trạng Thái</label><br />
                <select name="trangThai" value={formData.trangThai} onChange={handleChange} required>
                    <option value="">-- Chọn trạng thái --</option>
                    <option value="Ready">Ready</option>
                    <option value="Inprogress">Inprogress</option>
                    <option value="Fail">Fail</option>
                    <option value="Done">Done</option>
                </select><br /><br />

                <button type="submit">Gửi</button>
            </form>

            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="grow" variant="primary" />
                </div>
            )}
            <ToastContainer theme="colored" />
        </div>

    );
};

export default AddPlant;
