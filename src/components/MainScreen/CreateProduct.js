import './CreateProduct.css'
import defaultImage from '../../assets/images/default.png';
import { useNavigate } from "react-router-dom";
const CreateProduct = () => {
    const navigate = useNavigate();

    const backProductScreen = () => {
        navigate('/products')
    }

    const saveAndGoProductScreen = () => {
        navigate('/products')
    }

    return (
        <div>
            <div className="header">Create Products</div>
            <button className='create-product-back-button' onClick={() => backProductScreen()}>Back</button>
            <div className='create-product-content'>
                <div className='create-product-detail-product'>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Product Name</div>
                        <input className='create-product-input' />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Product Type</div>
                        <input className='create-product-input' />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>BoM</div>
                        <input className='create-product-input' />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Price</div>
                        <input className='create-product-input' />
                    </div>
                    <div className='create-product-detail-row'>
                        <div className='create-product-label'>Cost</div>
                        <input className='create-product-input' />
                    </div>

                    <div className='create-product-description'>
                        <div className='create-product-label'>Description</div>
                        <input className='create-product-input' style={{ marginTop: 30, width: 584 }} />
                    </div>
                </div>

                <div className='product-detail-image'>
                    <img src={defaultImage} className='product-detail-img' width={400} height={400}/>
                    <button className='product-detail-chooseimg-button'>Choose Image</button>
                    <button className='create-product-save-button' onClick={() => saveAndGoProductScreen()}>Save</button>
                </div>
            </div>
            
        </div>
    )
}

export default CreateProduct