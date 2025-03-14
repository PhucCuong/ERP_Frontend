import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import './ManfacturingDetail.css'
const ManfacturingDetail = () => {

    const navigate = useNavigate();

    // biến mã sản phẩm để lấy định mức nguyên vật liệu
    const [productId, setProductId] = useState(null)

    // list call api
    const [bomList, setBomList] = useState(null)
    const [materials, setMaterials] = useState(null)
    const [processList, setProcessList] = useState(null)
    const [productList, setProductList] = useState(null)

    // biến để lấy định mức nguyên vật liệu của MỘT sản phẩm đó
    const [components, setComponents] = useState([])
    // nhận tham số truyền vào
    const location = useLocation();
    const item = location.state?.item;

    // biến lưu lệnh sản xuất từ api về tạm trước khi lọc lại
    const [workOrderList, setWorkOrderList] = useState([])

    // biến lưu danh sách lệnh sản xuất
    const [workOrders, setWorkOrders] = useState([])

    useEffect(() => {
        setProductId(item.maSanPham)
        callApiGetBomList()
        callApiGetMaterials()
        setComponents([])
        callApiGetWorkOrders()
        filterWorkOrder()
        callApiGetProcessList()
        callApiGetProductList()
    }, [])

    useEffect(() => {
        if (bomList !== null && materials !== null) {
            var mergeData = []
            bomList.map((bom, index) => {
                if (bom.maSanPham === productId) {
                    mergeData.push({
                        ...bom,
                        tenNguyenVatLieu: materials.find(material => bom.maNguyenVatLieu === material.maNguyenVatLieu)?.tenNguyenVatLieu || null,
                        donViTinh: materials.find(material => bom.maNguyenVatLieu === material.maNguyenVatLieu)?.donViTinh || null,
                    })
                }
            })
            setComponents(mergeData);
        }
    }, [bomList, materials])

    useEffect(() => {
        filterWorkOrder(item.maKeHoach)
    }, [workOrderList])

    const callApiGetBomList = () => {
        axios.get('https://localhost:7135/api/DinhMucNguyenVatLieux')
            .then(response => {
                setBomList(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const callApiGetMaterials = () => {
        axios.get('https://localhost:7135/api/NguyenVatLieux')
            .then(response => {
                setMaterials(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }


    const callApiGetWorkOrders = () => {

        axios.get('https://localhost:7135/api/LenhSanXuatx')
            .then(response => {
                setWorkOrderList(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const callApiGetProcessList = () => {
        axios.get('https://localhost:7135/api/QuyTrinhSanXuatx')
            .then(response => {
                setProcessList(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const callApiGetProductList = () => {
        axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => {
                setProductList(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const filterWorkOrder = (makehoach) => {
        var list = workOrderList.filter(wo => wo.maKeHoach === makehoach)
        setWorkOrders(list)
    }

    const clickBackManfacturingOrders = () => {
        navigate('/manfacturingorders')
    }

    return (
        <div>
            <div className="header">View Manfacturing Order</div>
            <button className='manfacturing-detail-close-button' onClick={() => clickBackManfacturingOrders()}>
                {/* <IoMdClose className='manfacturing-detail-close-icon' /> */}
            </button>
            <div className='manfacturing-detail-info'>
                <div className='manfacturing-detail-column'>
                    <div className='man-det-info-row'>
                        <div className='bold'>Product :</div>
                        <div className='man-det-info-value primary-color'>{item.tenSanPham}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Quantity :</div>
                        <div className='man-det-info-value primary-color'>{item.soLuong}</div>
                    </div>
                </div>

                <div className='manfacturing-detail-column'>
                    <div className='man-det-info-row'>
                        <div className='bold'>Start Date :</div>
                        <div className='man-det-info-value green-color'>{item.ngayTao.slice(0, 10)}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Responsible :</div>
                        <div className='man-det-info-value primary-color'>{item.nguoiTao}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Status :</div>
                        <div className='man-det-info-value'
                            style={{
                                color:
                                    item.trangThai === "Ready"
                                        ? "#18A2B8"
                                        : item.trangThai === "Inprogress"
                                            ? "#1FA9FD"
                                            : item.trangThai === "Fail"
                                                ? "#EE0000"
                                                : "transparent", // Màu mặc định nếu không khớp
                                fontWeight: "bold", // Làm nổi bật chữ
                                textAlign: "center", // Căn giữa nội dung
                            }}
                        >{item.trangThai}</div>
                    </div>
                </div>
            </div>
            <div style={{
                fontSize: 23,
                textAlign: 'left',
                marginLeft: 70,
                marginTop: 20,
                color: '#18A2B8'
            }}>Bill of material :</div>
            <table className='man-det-table'>
                <thead>
                    <tr className='man-det-table-title'>
                        <th className='man-det-th'>Component</th>
                        <th className='man-det-th'>To Comsume</th>
                        <th className='man-det-th'>Unit</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        components.map((nvl, index) => (
                            <tr style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#FFFFFF' }}>
                                <td className='man-det-td' style={{ fontWeight: 600, color: '#3348A9' }}>{nvl.tenNguyenVatLieu}</td>
                                <td className='man-det-td' style={{ fontSize: 20 }}>{nvl.soLuong}</td>
                                <td className='man-det-td' style={{ fontSize: 20 }}>{nvl.donViTinh}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div style={{
                fontSize: 23,
                textAlign: 'left',
                marginLeft: 70,
                marginTop: 20,
                color: '#18A2B8'
            }}>Work orders :</div>
            <table className='man-det-table'>
                <thead>
                    <tr className='man-det-table-title'>
                        <th className='man-det-th'>Work Orders Code</th>
                        <th className='man-det-th'>Plan Code</th>
                        <th className='man-det-th'>Process</th>
                        <th className='man-det-th'>Product</th>
                        <th className='man-det-th'>Quantity</th>
                        <th className='man-det-th'>Start date</th>
                        <th className='man-det-th'>End date</th>
                        <th className='man-det-th'>Real duration</th>
                        <th className='man-det-th'>Manufacturing Supervisor</th>
                        <th className='man-det-th'>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        workOrders.map((llv, index) => {
                            return (
                                <tr style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#FFFFFF' }}>
                                    <td title={llv.maLenh} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >{llv.maLenh.slice(0, 13)}...</td>
                                    <td title={llv.maKeHoach} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >{llv.maKeHoach.slice(0, 13)}...</td>
                                    <td className='man-det-td' style={{ width: 150 }}>
                                        {(() => {
                                            if (processList !== null) {
                                                var object = processList.filter(p => p.maQuyTrinh === llv.maQuyTrinh)[0];
                                                return object ? object.tenQuyTrinh : "";
                                            }
                                        })()}
                                    </td>

                                    <td className='man-det-td' style={{ width: 200 }}>
                                        {(() => {
                                            if (productList !== null) {
                                                var object = productList.filter(p => p.maSanPham === llv.maSanPham)[0];
                                                return object ? object.tenSanPham : "";
                                            }
                                        })()}
                                    </td>
                                    <td className='man-det-td' >{llv.soLuong}</td>
                                    <td className='man-det-td' style={{ width: 100, color: '#FF3399' }}>{llv.ngayBatDau.slice(0, 10)}</td>
                                    <td className='man-det-td' style={{ width: 100, color: '#FF3399' }}>{llv.ngayKetThuc.slice(0, 10)}</td>
                                    <td className='man-det-td' ></td>
                                    <td className='man-det-td' style={{ color: '#18A2B8', fontWeight: 'bold' }}>{llv.nguoiChiuTrachNhiem}</td>
                                    <td className='man-det-td' ><div
                                        className='man-det-td'
                                        style={{
                                            backgroundColor:
                                                llv.trangThai === "Ready"
                                                    ? "#18A2B8"
                                                    : llv.trangThai === "Inprogress"
                                                        ? "#FFFF66"
                                                        : llv.trangThai === "Block"
                                                            ? "#BB0000"
                                                            : "transparent", // Màu mặc định nếu không khớp
                                            color: "white", // Đổi màu chữ để dễ đọc hơn
                                            fontWeight: "bold", // Làm nổi bật chữ
                                            textAlign: "center", // Căn giữa nội dung
                                            width: 50
                                        }}
                                    >
                                        {llv.trangThai}
                                    </div>
                                    </td>

                                </tr>
                            )
                        })
                    }
                    <div className='add-workorder'>Add work order</div>
                </tbody>
            </table>
        </div>
    )
}

export default ManfacturingDetail