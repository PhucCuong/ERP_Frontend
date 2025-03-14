import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';


import './RawMaterials.css'
const RawMaterials = () => {

    const [materialsList, setMaterialsList] = useState([])

    const [loading, setLoading] = useState(false);

    const nameRef = useRef(null)
    const barcodeRef = useRef(null)
    const typeRef = useRef(null)
    const unitRef = useRef(null)
    const costsRef = useRef(null)
    const miniStockRef = useRef(null)
    const maxStockRef = useRef(null)
    const statusRef = useRef(null)

    useEffect(() => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 300);
        callApiGetMaterials()
    }, [])


    const callApiGetMaterials = async () => {
        try {
            const response = await axios.get("https://localhost:7135/api/NguyenVatLieux");
            setMaterialsList(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
                notify_error(error.message);
            } else if (error.response && error.response.status === 401) {
                notify_error(error.message);
            } else {
                console.log("Lỗi kết nối đến server:", error.message);
                notify_error("Lỗi kết nối đến server:", error.message);
            }
        }
    }

    // hàm thêm nguyên vật liệu
    const addMaterial = async () => {
        const nguyenvatlieu = {
            tenNguyenVatLieu: nameRef.current.value,
            maVach: 'NVL' + (Math.floor(Math.random() * 900) + 100).toString(),
            nhomNguyenVatLieu: typeRef.current.value,
            donViTinh: unitRef.current.value,
            giaNhap: costsRef.current.value,
            tonKhoToiThieu: miniStockRef.current.value,
            tonKhoToiDa: maxStockRef.current.value,
            trangThai: statusRef.current.value
        }

        await axios.post('https://localhost:7135/api/NguyenVatLieux', nguyenvatlieu)
            .then(response => {
                notify_success('Thêm thành công.')
                setLoading(true)
                setInterval(() => {
                    setLoading(false)
                }, 300);
                callApiGetMaterials()
            })
            .catch(error => {
                notify_error(error.message)
            })
    }

    const notify_success = (message) => toast.info(message, {
        type: "success"
    });

    const notify_error = (message) => toast.info(message, {
        type: "error"
    });

    return (
        <div className='materials-container'>
            <div className="materials-header">Raw Materials</div>
            <div className='body'>
                <div className='materials-list'>
                    <div className='product-title-row'>
                        <div className='materials-list-title materials-list-title-left'>Materials name</div>
                        <div className='materials-list-title materials-list-title-right'>Import price</div>
                    </div>
                    <div className='materials-list-columns'>
                        {
                            materialsList.map(item => (
                                <div className='materials-1-row'>
                                    <div>{item.tenNguyenVatLieu}</div>
                                    <div style={{ color: '#3E58CE' }}>{item.giaNhap}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='materials-detail'>
                    <div style={{ fontSize: 26, fontWeight: 'bold', color: '#3E58CE', marginTop: 20 }}>
                        Form add raw materials
                    </div>
                    <div style={{
                        display: 'flex',
                        height: '80%',
                        width: '90%',
                        margin: 'auto',
                        justifyContent: 'space-around',
                        paddingTop: 30,
                        flexDirection: 'column',
                        paddingBottom: 15,
                        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            height: '85%'
                        }}>
                            <div className='materials-detail-column'>
                                <div className='materials-detail-label'>Materials name</div>
                                <input className='materials-detail-input' ref={nameRef} />
                                <div className='materials-detail-label'>Barcode</div>
                                <input className='materials-detail-input' ref={barcodeRef} readOnly />
                                <div className='materials-detail-label'>Materials type</div>
                                <input className='materials-detail-input' ref={typeRef} />
                                <div className='materials-detail-label'>Unit</div>
                                <input className='materials-detail-input' ref={unitRef} />
                            </div>
                            <div className='materials-detail-column'>
                                <div className='materials-detail-label'>Costs</div>
                                <input className='materials-detail-input' ref={costsRef} />
                                <div className='materials-detail-label'>Minimum stock quantity</div>
                                <input className='materials-detail-input' ref={miniStockRef} />
                                <div className='materials-detail-label'>Maximum stock quantity</div>
                                <input className='materials-detail-input' ref={maxStockRef} />
                                <div className='materials-detail-label'>Status</div>
                                <input className='materials-detail-input' ref={statusRef} />
                            </div>
                        </div>
                        <button className='btn-add' onClick={() => addMaterial()}>Add Material</button>
                    </div>
                </div>
            </div>

            {loading && <Loading />} {/* Hiển thị Loading khi đang xử lý */}
            <ToastContainer theme="colored" />
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

export default RawMaterials