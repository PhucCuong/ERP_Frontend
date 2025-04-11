import './CreateProduct.css';
import { IoMdArrowBack } from "react-icons/io";
import defaultImage from '../../assets/images/default.png';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';

const CreateProduct = () => {
    // các biến lưu giá trị các input
    const [images, setImages] = useState([]);
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const backProductScreen = () => {
        navigate('/products');
    };

    const handleImageChange = (e) => {
        const uploadFiles = Array.from(e.target.files);
        setImages(uploadFiles);
    };

    const renderImageList = () => {
        if (!images || images.length === 0) {
            return <img src={defaultImage} className='product-detail-img' width={400} height={400} style={{ objectFit: 'contain' }} />;
        } else {
            return (
                <div style={{ width: 400, overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex' }}>
                    {images.map(f => (
                        <div key={f.name}>
                            <img src={URL.createObjectURL(f)} width={400} height={400} style={{ objectFit: 'contain' }} />
                        </div>
                    ))}
                </div>
            );
        }
    };

    const handleProductName = (e) => setProductName(e.target.value);
    const handleProductType = (e) => setProductType(e.target.value);
    const handleProductPrice = (e) => setPrice(e.target.value);
    const handleProductDescription = (e) => setDescription(e.target.value);
    const handleProductUnit = (e) => setUnit(e.target.value);

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
        let maSanPham = '';
        try {
            const productResponse = await axios.post("https://localhost:7135/api/SanPhamx", {
                tenSanPham: productName,
                donViTinh: unit,
                nhomSanPham: productType,
                giaBan: price,
                moTa: description,
                maVach: "SP" + (Math.random() * 4).toString(),
            });

            maSanPham = productResponse.data.maSanPham;

            if (images.length === 0) {
                await axios.delete(`https://localhost:7135/api/SanPhamx/${maSanPham}`);
                notify_error("Vui lòng chọn ít nhất một ảnh! Sản phẩm đã bị xóa.");
                return;
            }

            for (const image of images) {
                const base64String = await convertToBase64(image);

                const payload = {
                    maSanPham: maSanPham,
                    imgUrl: base64String,
                };

                await axios.post("https://localhost:7135/api/SanPhamImgs/UploadImageBase64", payload, {
                    headers: { "Content-Type": "application/json" },
                });
            }

            notify_success("Thêm sản phẩm và ảnh thành công!");
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                await axios.delete(`https://localhost:7135/api/SanPhamx/${maSanPham}`);
            }
            notify_error("Thêm sản phẩm thất bại! Đã rollback.");
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const notify_success = (message) => toast.info(message, { type: "success" });
    const notify_error = (message) => toast.info(message, { type: "error" });

    return (
        <div>
            <div className="header">Create Products</div>
            <button className='create-product-back-button' onClick={backProductScreen}>
                <IoMdArrowBack />
            </button>
            <div className='create-product-content'>
                <div className='create-product-detail-product'>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Product Name</div>
                        <input className='create-product-input' value={productName} onChange={handleProductName} />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Product Type</div>
                        <input className='create-product-input' value={productType} onChange={handleProductType} />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Unit</div>
                        <input className='create-product-input' value={unit} onChange={handleProductUnit} />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Price</div>
                        <input className='create-product-input' value={price} onChange={handleProductPrice} />
                    </div>
                    <div className='create-product-description'>
                        <div className='create-product-label'>Description</div>
                        <textarea className='create-product-textarea' value={description} onChange={handleProductDescription}></textarea>
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
                    <button className='create-product-save-button' onClick={addProduct}>Save</button>
                </div>
            </div>
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="grow" variant="primary" />
                </div>
            )}
            <ToastContainer theme="colored" />
        </div>
    );
};

export default CreateProduct;
