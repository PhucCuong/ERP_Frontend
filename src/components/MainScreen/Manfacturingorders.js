import './Manfacturingorders.css'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

const Manfacturingorders = () => {
    const navigate = useNavigate();

    const [plantList, setPlantList] = useState([])
    const [productList, setProductList] = useState([])
    const [facturyList, setFacturyList] = useState([])

    const [list, setList] = useState([])

    const [loading, setLoading] = useState(false);

    // hover từng dòng
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

    useEffect(() => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 300);
        axios.get('https://localhost:7135/api/KeHoachSanXuatx')
            .then(response => {
                setPlantList(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => {
                setProductList(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        axios.get('https://localhost:7135/api/NhaMayx')
            .then(response => {
                setFacturyList(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, [])

    useEffect(() => {
        if (plantList.length !== 0 && productList.length && facturyList.length) {
            const mergedData = plantList.map(plant => ({
                ...plant,
                tenSanPham: productList.find(sp => sp.maSanPham === plant.maSanPham)?.tenSanPham || null,
                tenNhaMay: facturyList.find(nm => nm.maNhaMay === plant.maNhaMay)?.tenNhaMay || null,
            }));
            setList(mergedData)
        }
    }, [plantList, productList, facturyList])

    // const list = [
    //     {
    //         maKeHoach: 'KH001',
    //         maSanPham: '1',
    //         maNhaMay: 'NM001',
    //         maDinhMuc: 'DM1',
    //         soLuong: '1000',
    //         ngayBatDauDuKien: '2025-01-01',
    //         ngayKetThucDuKien: '2025-01-01',
    //         mucTonKhoAnToan: '300',
    //         soLuongSanXuatToiThieu: '100',
    //         soLuongSanXuatToiDa: '1000',
    //         trangThai: 'Done',
    //         nguoiTao: 'Thomas',
    //         ngayTao: '2025-01-01',
    //         nguoiChinhSua: 'Bill Gate',
    //         ngayChinhSua: ''
    //     },
    //     {
    //         maKeHoach: 'KH001',
    //         maSanPham: '1',
    //         maNhaMay: 'NM001',
    //         maDinhMuc: 'DM2',
    //         soLuong: '1000',
    //         ngayBatDauDuKien: '2025-01-01',
    //         ngayKetThucDuKien: '2025-01-01',
    //         mucTonKhoAnToan: '300',
    //         soLuongSanXuatToiThieu: '100',
    //         soLuongSanXuatToiDa: '1000',
    //         trangThai: 'Inprogress',
    //         nguoiTao: 'Thomas',
    //         ngayTao: '2025-01-01',
    //         nguoiChinhSua: 'Bill Gate',
    //         ngayChinhSua: ''
    //     },
    //     {
    //         maKeHoach: 'KH001',
    //         maSanPham: '1',
    //         maNhaMay: 'NM001',
    //         maDinhMuc: 'DM3',
    //         soLuong: '1000',
    //         ngayBatDauDuKien: '2025-01-01',
    //         ngayKetThucDuKien: '2025-01-01',
    //         mucTonKhoAnToan: '300',
    //         soLuongSanXuatToiThieu: '100',
    //         soLuongSanXuatToiDa: '1000',
    //         trangThai: 'Fail',
    //         nguoiTao: 'Thomas',
    //         ngayTao: '2025-01-01',
    //         nguoiChinhSua: 'Bill Gate',
    //         ngayChinhSua: ''
    //     },
    //     {
    //         maKeHoach: 'KH001',
    //         maSanPham: '1',
    //         maNhaMay: 'NM001',
    //         maDinhMuc: 'DM4',
    //         soLuong: '1000',
    //         ngayBatDauDuKien: '2025-01-01',
    //         ngayKetThucDuKien: '2025-01-01',
    //         mucTonKhoAnToan: '300',
    //         soLuongSanXuatToiThieu: '100',
    //         soLuongSanXuatToiDa: '1000',
    //         trangThai: 'Done',
    //         nguoiTao: 'Thomas',
    //         ngayTao: '2025-01-01',
    //         nguoiChinhSua: 'Bill Gate',
    //         ngayChinhSua: ''
    //     }
    // ]

    const doubleClickRow = (item) => {
        navigate('/manfacturing/detail', { state: { item } })
    }

    return (
        <div>
            <div className="product-header">Manfacturing Orders</div>
            <div className="manfactring-button-row">
                <button className='manfacturing-new-button'>New</button>
                <input className='manfacturing-filter-input' />
                <button className='manfacturing-search-button'><FaSearch /></button>
                {/* <select value={selectedValue} onChange={handleChange}> */}
                <select className='manfacturing-select'>
                    <option value=""> Select </option>
                    <option value="apple">Táo</option>
                    <option value="banana">Chuối</option>
                    <option value="orange">Cam</option>
                </select>
                <select className='manfacturing-select'>
                    <option value=""> Human </option>
                    <option value="apple">Táo</option>
                    <option value="banana">Chuối</option>
                    <option value="orange">Cam</option>
                </select>
            </div>
            <table className='manfacturing-table'>
                <thead>
                    <tr className='manfacturing-table-title'>
                        <th>Plan ID</th>
                        <th>Owner</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Start Date</th>
                        <th>Creator</th>
                        <th>Factory</th>
                        <th>State</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        list.map((item, index) => (
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
                                onDoubleClick={() => doubleClickRow(item)}
                            >
                                <td title={item.maKeHoach}>{item.maKeHoach.slice(0,18)}...</td>
                                <td className='blue-color'>{item.nguoiTao}</td>
                                <td>{item.tenSanPham}</td>
                                <td>{item.soLuong}</td>
                                <td>{item.ngayBatDauDuKien.slice(0,10)}</td>
                                <td>{item.nguoiTao}</td>
                                <td>{item.tenNhaMay}</td>
                                <td>
                                    <div
                                        style={{
                                            backgroundColor:
                                                item.trangThai === "Ready"
                                                    ? "#18A2B8"
                                                    : item.trangThai === "Inprogress"
                                                        ? "#1FA9FD"
                                                        : item.trangThai === "Fail"
                                                            ? "#EE0000"
                                                            : "transparent", // Màu mặc định nếu không khớp
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

export default Manfacturingorders