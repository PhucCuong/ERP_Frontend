import './CreateProduct.css'
import { IoMdArrowBack } from "react-icons/io";
import defaultImage from '../../assets/images/default.png';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
const CreateProduct = () => {
    // các biến lưu giá trị các input
    const [images, setImages] = useState([])
    const [productName, setProductName] = useState('')
    const [productType, setProductType] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [unit, setUnit] = useState('')

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const backProductScreen = () => {
        navigate('/products')
    }

    // const saveAndGoProductScreen = () => {
    //     navigate('/products')
    // }

    const handleImageChange = (e) => {
        const uploadFiles = Array.from(e.target.files);
        setImages(uploadFiles)
    }

    const renderImageList = () => {
        if (!images || images.length === 0) {
            return (
                <img src={defaultImage} className='product-detail-img' width={400} height={400} style={{objectFit: 'contain'}}/>
            )
        } else {
            return (
                <div style={{ width: 400, overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex' }}>
                    {
                        images.map(f => (
                            <div>
                                <img src={URL.createObjectURL(f)} width={400} height={400} style={{objectFit: 'contain'}}/>
                            </div>
                        ))
                    }
                </div>
            )
        }
    }

    // xử lí nhập product name
    const handleProductName = (e) => {
        setProductName(e.target.value)
    }

    const handleProductType = (e) => {
        setProductType(e.target.value)
    }

    const handleProductPrice = (e) => {
        setPrice(e.target.value)
    }

    const handleProductDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleProductUnit = (e) => {
        setUnit(e.target.value)
    }

    // hàm convert hình ảnh sang dạng base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // Lấy phần base64 sau dấu phẩy
            reader.onerror = (error) => reject(error);
        });
    };

    const addProduct = async () => {
        setLoading(true);
        var maSanPham = ''
        try {
            //  1. Gửi API tạo sản phẩm
            const productResponse = await axios.post("https://localhost:7135/api/SanPhamx", {
                tenSanPham: productName,
                donViTinh: unit,
                nhomSanPham: productType,
                giaBan: price,
                moTa: description,
                maVach: "SP" + (Math.random() * 4).toString()
            });
    
            maSanPham = productResponse.data.maSanPham; // Lấy ID sản phẩm từ response
            console.log("Sản phẩm đã tạo:", maSanPham);
    
            //  2. Kiểm tra nếu không có ảnh thì rollback
            if (images.length === 0) {
                await axios.delete(`https://localhost:7135/api/SanPhamx/${maSanPham}`);
                notify_error("Vui lòng chọn ít nhất một ảnh! Sản phẩm đã bị xóa.");
                return;
            }
    
            //  3. Upload từng ảnh lên server
            for (const image of images) {
                const base64String = await convertToBase64(image);
    
                const payload = {
                    maSanPham: maSanPham, // Sử dụng ID sản phẩm thật
                    imgUrl: base64String, // Ảnh dạng Base64
                };
    
                await axios.post("https://localhost:7135/api/SanPhamImgs/UploadImageBase64", payload, {
                    headers: { "Content-Type": "application/json" },
                });
            }
    
            //  4. Nếu tất cả thành công
            notify_success("Thêm sản phẩm và ảnh thành công!");
        } catch (error) {
            console.error("Lỗi:", error);
    
            //  5. Nếu có lỗi, rollback sản phẩm
            if (error.response && error.response.status !== 404) {
                await axios.delete(`https://localhost:7135/api/SanPhamx/${maSanPham}`);
            }
    
            notify_error("Thêm sản phẩm thất bại! Đã rollback.");
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };
    

    const notify_success = (message) => toast.info(message, {
        type: "success"
    });

    const notify_error = (message) => toast.info(message, {
        type: "error"
    });

    return (
        <div>
            <div className="header">Create Products</div>
            <button className='create-product-back-button' onClick={() => backProductScreen()}>
                <IoMdArrowBack />
            </button>
            <div className='create-product-content'>
                <div className='create-product-detail-product'>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Product Name</div>
                        <input className='create-product-input' onChange={e => handleProductName(e)} />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Product Type</div>
                        <input className='create-product-input' onChange={e => handleProductType(e)} />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Unit</div>
                        <input className='create-product-input' onChange={e => handleProductUnit(e)} />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Price</div>
                        <input className='create-product-input' onChange={e => handleProductPrice(e)} />
                    </div>
                    <div className='create-product-description'>
                        <div className='create-product-label'>Description</div>
                        <input className='create-product-input' style={{ marginTop: 30, width: 584 }} onChange={e => handleProductDescription(e)} />
                    </div>
                </div>

                <div className='product-detail-image'>
                    {renderImageList()}
                    <input
                        className='product-detail-chooseimg-button'
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={handleImageChange}
                    />
                    <button className='create-product-save-button' onClick={() => addProduct()}>Save</button>
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

export default CreateProduct