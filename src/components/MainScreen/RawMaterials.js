import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';


import './RawMaterials.css'
const RawMaterials = () => {

    // const navigate = useNavigate();

    const [materialsList, setMaterialsList] = useState([])

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 300);
        callApiGetMaterials()
    }, [])


    const callApiGetMaterials = async () => {
        // axios.get('https://localhost:7135/api/NguyenVatLieux')
        //     .then(response => {
        //         setMaterialsList(response.data)
        //     })
        //     .catch(error => {
        //         console.error('Lỗi:', error);
        //     });
        try {
            const response = await axios.get("https://localhost:7135/api/NguyenVatLieux");
            setMaterialsList(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
                notify(error.message);
            } else if (error.response && error.response.status === 401) {
                notify(error.message);
            } else {
                console.log("Lỗi kết nối đến server:", error.message);
                notify("Lỗi kết nối đến server:", error.message);
            }
        }
    }

    const notify = (message) => toast.info(message, {
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