import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Unbuildorders = () => {
    const [data, setData] = useState([]);

    const callApi = async () => {
        axios.get('https://localhost:7135/api/LenhGoBox/get-lenhgobo')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
            });
    }

    useEffect(() => {
        callApi()
    }, []);

    const updateStatus = async (malenh, trangthai) => {
        const requestBody = {
            maLenhGoBo: malenh,
            trangThai: trangthai
          }
        try {
            await axios.post('https://localhost:7135/api/LenhGoBox/update-status', requestBody)
            notify_success('Cập nhật trạng thái thành công!')
            callApi()
        } catch(ex) {
            notify_error('Cập nhật trạng thái Thất bại: ' + ex)
        }
    }

    // thao tác các nút 
    const handleStart = (malenh, trangthai) => {
        updateStatus(malenh, trangthai)
    };

    const handleComplete = (malenh, trangthai) => {
        updateStatus(malenh, trangthai)
    };

    const buttonStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        margin: '10px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    const startStyle = {
        ...buttonStyle,
        backgroundColor: '#4CAF50',
        color: 'white',
    };

    const completeStyle = {
        ...buttonStyle,
        backgroundColor: '#2196F3',
        color: 'white',
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>DANH SÁCH LỆNH GỠ BỎ</h2>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Mã Lệnh</th>
                        <th>Mã Kế Hoạch</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Lý Do Gỡ Bỏ</th>
                        <th>Trạng Thái</th>
                        <th>Người Chịu Trách Nhiệm</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
                    ) : (
                        data.map(item => (
                            <tr key={item.maLenhGoBo}>
                                <td
                                    style={{ fontWeight: 'bold', color: 'blue' }}
                                >{"LGB/" + item.maLenhGoBo.toString().padStart(5, '0')}</td>
                                <td
                                    style={{
                                        fontWeight: 'bold', color: '#FF00FF'
                                    }}
                                >{"KHSX/" + item.maKeHoach.toString().padStart(5, '0')}</td>
                                <td
                                    style={{ color: '#66CC99' }}
                                >{item.tenSanPham}</td>
                                <td
                                    style={{ textDecoration: 'underline' }}
                                >{item.lyDoGoBo}</td>
                                <td
                                    style={{
                                        color: item.trangThai === "Watting" ? "#FF33FF"
                                            : item.trangThai === "Done" ? "#009900" : "#FF0000"
                                    }}
                                >{item.trangThai}</td>
                                <td
                                    style={{ color: 'red' }}
                                >{item.nguoiChiuTrachNhiem}</td>

                                <td>
                                    {
                                        item.trangThai === "Watting"
                                            ?
                                            <button
                                                style={startStyle}
                                                onClick={() => handleStart(item.maLenhGoBo, "Inprogress")}
                                            >
                                                Bắt đầu
                                            </button>
                                            :
                                            item.trangThai === "Inprogress"
                                                ?
                                                <button
                                                    style={completeStyle}
                                                    onClick={() => handleComplete(item.maLenhGoBo, "Done")}
                                                >
                                                    Hoàn thành
                                                </button>
                                                :
                                                null
                                    }
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>


            <ToastContainer theme="colored" />
        </div>
    );
}

const notify_success = (message) => toast.info(message, { type: "success" });
const notify_error = (message) => toast.info(message, { type: "error" });

export default Unbuildorders