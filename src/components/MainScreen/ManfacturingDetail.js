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

    // biến để lấy định mức nguyên vật liệu của MỘT sản phẩm đó
    const [components, setComponents] = useState([])
    console.log(components)
    // nhận tham số truyền vào
    const location = useLocation();
    const item = location.state?.item;
    //

    useEffect(() => {
        setProductId(item.maSanPham) 
        callApiGetBomList()
        callApiGetMaterials()
        setComponents([])
    }, [])

    useEffect(() => {
        if (bomList !== null && materials !== null) {
            var mergeData = []
            bomList.map((bom, index) => {
                if(bom.maSanPham === productId) {
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

    const workOrders = [
        {
            maKeHoach: 'KH1',
            maLenhLamViec: 'llv1',
            tenLenhLamViec: 'khoan ốc vít',
            trangThai: 'Inprogress',
            khuVucLamViec: 'Xưởng Làm Việc',
            thoiGianDuKien: '12:00',
            thoiGianThucTe: '14:00'
        },
        {
            maKeHoach: 'KH1',
            maLenhLamViec: 'llv2',
            tenLenhLamViec: 'Cắt gỗ',
            trangThai: 'Waiting',
            khuVucLamViec: 'Xưởng Gỗ',
            thoiGianDuKien: '23:00',
            thoiGianThucTe: '24:00'
        },
        {
            maKeHoach: 'KH1',
            maLenhLamViec: 'll32',
            tenLenhLamViec: 'Lắp Ráp',
            trangThai: 'Waiting',
            khuVucLamViec: 'Xưởng Lắp Ráp',
            thoiGianDuKien: '14:00',
            thoiGianThucTe: '16:00'
        },
        {
            maKeHoach: 'KH1',
            maLenhLamViec: 'llv4',
            tenLenhLamViec: 'Đóng Gói',
            trangThai: 'Waiting',
            khuVucLamViec: 'Xưởng Thành Phẩm',
            thoiGianDuKien: '45:00',
            thoiGianThucTe: '40:00'
        },
    ]

    const clickBackManfacturingOrders = () => {
        navigate('/manfacturingorders')
    }

    return (
        <div>
            <div className="header">View Manfacturing Order</div>
            <button className='manfacturing-detail-close-button' onClick={() => clickBackManfacturingOrders()}>
                <IoMdClose className='manfacturing-detail-close-icon' />
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
                        <div className='man-det-info-value green-color'>{item.ngayTao.slice(0,10)}</div>
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
                                <td className='man-det-td' style={{fontWeight: 600, color: '#3348A9'}}>{nvl.tenNguyenVatLieu}</td>
                                <td className='man-det-td' style={{fontSize: 22}}>{nvl.soLuong}</td>
                                <td className='man-det-td' style={{fontSize: 22}}>{nvl.donViTinh}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <table className='man-det-table'>
                <thead>
                    <tr className='man-det-table-title'>
                        <th className='man-det-th'>Work Orders</th>
                        <th className='man-det-th'>Work Center</th>
                        <th className='man-det-th'>Start Date</th>
                        <th className='man-det-th'>Expect Duration</th>
                        <th className='man-det-th'>Real Duration</th>
                        <th className='man-det-th'>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        workOrders.map((llv, index) => (
                            <tr style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#FFFFFF' }}>
                                <td className='man-det-td' >{llv.tenLenhLamViec}</td>
                                <td className='man-det-td' >{llv.khuVucLamViec}</td>
                                <td className='man-det-td' ></td>
                                <td className='man-det-td' >{llv.thoiGianDuKien}</td>
                                <td className='man-det-td' >{llv.thoiGianThucTe}</td>
                                <td className='man-det-td' >{llv.trangThai}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ManfacturingDetail