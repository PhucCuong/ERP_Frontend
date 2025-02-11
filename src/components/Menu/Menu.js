import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { SiMaterialdesignicons } from "react-icons/si";
import { MdProductionQuantityLimits } from "react-icons/md";
import { GrPlan } from "react-icons/gr";
import { GrUserWorker } from "react-icons/gr";
import { MdInsertPageBreak } from "react-icons/md";
import { IoTrashBinOutline } from "react-icons/io5";
import { AiOutlineRetweet } from "react-icons/ai";
import { RiBuilding2Fill } from "react-icons/ri";
import { BsReception4 } from "react-icons/bs";
import './Menu.css';

const Menu = () => {

    const [page, setPage] = useState('bom')
    // const [pageNumber, setPageNumber] = useState(0)

    useEffect(() => {
        console.log(page)
    }, [page])

    return (
        <div className="menu_container">
            <div className='user'>
                < img src='https://thumbs.dreamstime.com/b/user-sign-icon-person-symbol-human-avatar-rich-man-84519083.jpg'
                    alt="Example Image"
                    width="100"
                    height="100"
                    style={{
                        borderRadius: '50%'
                    }}
                />
                <div>
                    <p className='name'>Bill Gates</p>
                    <p className='position'>Admin</p>
                </div>
            </div>
            <div className='line'></div>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <NavLink
                    onClick={() => setPage('bom')}
                    to="/bom"
                    className='btn'
                    style={{
                        backgroundColor: page === 'bom' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'bom' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <SiMaterialdesignicons/>&emsp;
                    Bill of meterial
                </NavLink>
                <NavLink
                    onClick={() => setPage('products')}
                    to="/products"
                    className='btn'
                    style={{
                        backgroundColor: page === 'products' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'products' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <MdProductionQuantityLimits/>&emsp;
                    Products
                </NavLink>
                <NavLink
                    onClick={() => setPage('manfacturingorders')}
                    to="/manfacturingorders"
                    className='btn'
                    style={{
                        backgroundColor: page === 'manfacturingorders' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'manfacturingorders' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <GrPlan />&emsp;
                    Manfacturing orders
                </NavLink>
                <NavLink
                    onClick={() => setPage('workorders')}
                    to="/workorders"
                    className='btn'
                    style={{
                        backgroundColor: page === 'workorders' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'workorders' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}

                >
                    <GrUserWorker/>&emsp;
                    Work orders
                </NavLink>
                <NavLink
                    onClick={() => setPage('unbuildorders')}
                    to="/unbuildorders"
                    className='btn'
                    style={{
                        backgroundColor: page === 'unbuildorders' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'unbuildorders' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <MdInsertPageBreak/>&emsp;
                    Unbuild orders
                </NavLink>
                <NavLink
                    onClick={() => setPage('scrap')}
                    to="/scrap"
                    className='btn'
                    style={{
                        backgroundColor: page === 'scrap' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'scrap' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <IoTrashBinOutline/>&emsp;
                    Scrap
                </NavLink>
                <NavLink
                    onClick={() => setPage('productionprocess')}
                    to="/productionprocess"
                    className='btn'
                    style={{
                        backgroundColor: page === 'productionprocess' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'productionprocess' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <AiOutlineRetweet/>&emsp;
                    Production process
                </NavLink>
                <NavLink
                    onClick={() => setPage('workcenters')}
                    to="/workcenters"
                    className='btn'
                    style={{
                        backgroundColor: page === 'workcenters' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'workcenters' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <RiBuilding2Fill/>&emsp;
                    Work centers
                </NavLink>
                <NavLink
                    onClick={() => setPage('reportings')}
                    to="/reportings"
                    className='btn'
                    style={{
                        backgroundColor: page === 'reportings' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'reportings' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <BsReception4/>&emsp;
                    Reportings
                </NavLink>
            </div>
        </div>
    );
};


export default Menu

