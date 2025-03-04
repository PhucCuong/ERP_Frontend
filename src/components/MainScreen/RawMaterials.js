import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';


import './RawMaterials.css'
const RawMaterials = () => {

    // const navigate = useNavigate();

    const [materialsList, setMaterialsList] = useState([])

    useEffect(() => {
        callApiGetMaterials()
    }, [])


    const callApiGetMaterials = () => {
        axios.get('https://localhost:7135/api/NguyenVatLieux')
            .then(response => {
                setMaterialsList(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

    }

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
        </div>
    )
}

export default RawMaterials