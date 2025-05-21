import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import axios from 'axios';
const Workorders = () => {
    const [loading, setLoading] = useState(false);

    // lấy danh sách workorder thừ api về
    const [workOrders, setWorkOrders] = useState([])

    const [products, setProduct] = useState(null)
    const [processes, setProcesses] = useState(null)

    // biến hover
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
    useEffect(() => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 300);
        callApi()
    }, [])

    const callApi = async () => {
        await axios.get('https://localhost:7135/api/LenhSanXuatx')
            .then(response => {
                setWorkOrders(response.data)
            })
            .catch(error => {
                console.log(error.message)
            });

        await axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => {
                setProduct(response.data)
            })
            .catch(error => {
                console.log(error.message)
            });

        await axios.get('https://localhost:7135/api/QuyTrinhSanXuatx')
            .then(response => {
                setProcesses(response.data)
            })
            .catch(error => {
                console.log(error.message)
            });
    }

    const filterProductIdToName = (productid) => {
        var name = ''
        if (products !== null) {
            products.forEach((item) => {
                if (item.maSanPham === productid) {
                    name = item.tenSanPham
                }
            })
        }
        return name
    }

    const filterProcessIdToName = (processid) => {
        var name = ''
        if (processes !== null) {
            processes.forEach((item) => {
                if (item.maQuyTrinh === processid) {
                    name = item.tenQuyTrinh
                }
            })
        }
        return name
    }

    return (
        <div>
            <table className='manfacturing-table'>
                <thead>
                    <tr className='manfacturing-table-title'>
                        <th>Mã Lệnh sản xuất</th>
                        <th>Mã kế hoạch</th>
                        <th>Sản phẩm</th>
                        <th>Tên công việc</th>
                        <th>Số lượng</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Chịu trách nhiệm</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        workOrders.map((item, index) => (
                            <tr
                                key={index}
                                style={{
                                    backgroundColor:
                                        hoveredRowIndex === index
                                            ? "#C0C0C0" // Màu khi hover
                                            : index % 2 !== 0
                                                ? "#D1E8FE" // Màu nền xen kẽ
                                                : "#ffffff",
                                    transition: "background-color 0.3s", // Hiệu ứng mượt mà
                                }}
                                className="manfacturing-row"
                                onMouseEnter={() => setHoveredRowIndex(index)}
                                onMouseLeave={() => setHoveredRowIndex(null)}
                            >
                                <td title={item.maKeHoach}>{item.maLenh.slice(0, 18)}</td>
                                <td className='blue-color'>KHSX/{item.maKeHoach.toString().padStart(5, '0')}</td>
                                <td>{filterProductIdToName(item.maSanPham)}</td>
                                <td style={{width: 200}}>{filterProcessIdToName(item.maQuyTrinh)}</td>
                                <td>{item.soLuong}</td>
                                <td style={{width: 100}}>{item.ngayBatDau.slice(0,10)}</td>
                                <td style={{width: 100}}>{item.ngayKetThuc.slice(0,10)}</td>
                                <td>{item.nguoiChiuTrachNhiem}</td>
                                <td>
                                    <div
                                        style={{
                                            backgroundColor:
                                                item.trangThai === "Ready"
                                                    ? "#18A2B8"
                                                    : item.trangThai === "Inprogress"
                                                        ? "#1FA9FD"
                                                        : item.trangThai === "Block"
                                                            ? "#EE0000"
                                                            : "#339900", 
                                            color: "white", // Đổi màu chữ để dễ đọc hơn
                                            fontWeight: "bold", // Làm nổi bật chữ
                                            textAlign: "center", // Căn giữa nội dung
                                        }}
                                    >
                                        {item.trangThai}
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {loading && <Loading />} {/* Hiển thị Loading khi đang xử lý */}
        </div>
    )
}

function Loading() {
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: "rgba(0, 0, 0, 0.2)", // Màu nền mờ
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999, // Đảm bảo hiển thị trên tất cả
                position: 'fixed',
                top: 0,
                right: 0,
            }}
        >
            <Spinner animation="grow" variant="primary" />
        </div>
    );
}

export default Workorders