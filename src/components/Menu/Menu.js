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
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import './Menu.css';

import { jwtDecode } from 'jwt-decode';

const Menu = () => {

    const [page, setPage] = useState('bom')
    const [user, setUser] = useState({})

    const bomRole = [
        'Admin',
        'Bộ phận kỹ thuật',
        'Bộ phận sản xuất',
    ]

    const materialRole = [
        'Admin',
        'Bộ phận kỹ thuật',
        'Bộ phận sản xuất',
    ]

    const productRole = [
        'Admin',
        'Bộ phận kỹ thuật',
        'Bộ phận kế hoạch',
        'Bộ phận kiểm tra chất lượng',
        'Bộ phận sản xuất',
        'Bộ phận bán hàng',
        'Bộ phận kho'
    ]

    const manfacturingOrderRole = [
        'Admin',
        'Bộ phận kế hoạch',
        'Bộ phận sản xuất',
        'Bộ phận kiểm tra chất lượng',
    ]

    const workOrderRole = [
        'Admin',
        'Bộ phận kế hoạch',
        'Bộ phận sản xuất',
        'Bộ phận kiểm tra chất lượng',
    ]

    const unbuiltOrderRole = [
        'Admin',
        'Bộ phận kế hoạch',
        'Bộ phận sản xuất',
        'Bộ phận kiểm tra chất lượng',
    ]

    const scrapRole = [
        'Admin',
        'Bộ phận kế hoạch',
        'Bộ phận kiểm tra chất lượng',
        'Bộ phận kho'
    ]

    const productionProcessRole = [
        'Admin',
        'Bộ phận kỹ thuật',
        'Bộ phận sản xuất'
    ]

    const workCenterRole = [
        'Admin',
        'Bộ phận kỹ thuật',
        'Bộ phận sản xuất'
    ]

    const reportRole = [
        'Admin',
        'Bộ phận kế hoạch',
    ]
    useEffect(() => {
        const token = localStorage.getItem("userToken")
        if (!token) return null

        try {
            const decoded = jwtDecode(token);
            let info = {
                user_name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"],
            };

            setUser(info); // In ra để kiểm tra
        } catch (error) {
            console.error("Token không hợp lệ", error);
        }
    }, [])

        ;
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
                    <p className='name'>{user.name}</p>
                    <p className='position'>{user.role}</p>
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
                {bomRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('bom')}
                        to="/bom"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'bom' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'bom' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}
                    >
                        <SiMaterialdesignicons />&emsp;
                        Bill of meterial
                    </NavLink>
                )}

                {materialRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('raw-materials')}
                        to="/raw-materials"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'raw-materials' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'raw-materials' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}
                    >
                        <AiOutlineDeploymentUnit />&emsp;
                        Raw Materials
                    </NavLink>
                )}

                {productRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('products')}
                        to="/products"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'products' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'products' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}
                    >
                        <MdProductionQuantityLimits />&emsp;
                        Products
                    </NavLink>
                )}

                {manfacturingOrderRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('manfacturingorders')}
                        to="/manfacturingorders"
                        className='btn-menu'
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
                )}

                {workOrderRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('workorders')}
                        to="/workorders"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'workorders' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'workorders' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}

                    >
                        <GrUserWorker />&emsp;
                        Work orders
                    </NavLink>
                )}

                {unbuiltOrderRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('unbuildorders')}
                        to="/unbuildorders"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'unbuildorders' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'unbuildorders' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}
                    >
                        <MdInsertPageBreak />&emsp;
                        Unbuild orders
                    </NavLink>
                )}

                {scrapRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('scrap')}
                        to="/scrap"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'scrap' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'scrap' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}
                    >
                        <IoTrashBinOutline />&emsp;
                        Scrap
                    </NavLink>
                )}

                {productionProcessRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('productionprocess')}
                        to="/productionprocess"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'productionprocess' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'productionprocess' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}
                    >
                        <AiOutlineRetweet />&emsp;
                        Production process
                    </NavLink>
                )}

                {workCenterRole.includes(user.role) && (
                    <NavLink
                        onClick={() => setPage('workcenters')}
                        to="/workcenters"
                        className='btn-menu'
                        style={{
                            backgroundColor: page === 'workcenters' ? '#E4E7F2' : '#3E58CE',
                            color: page === 'workcenters' ? '#3348A9' : '#ffffff',
                            fontSize: 18,
                            textDecoration: 'none',
                        }}
                    >
                        <RiBuilding2Fill />&emsp;
                        Work centers
                    </NavLink>
                )}
                <NavLink
                    onClick={() => setPage('reportings')}
                    to="/reportings"
                    className='btn-menu'
                    style={{
                        backgroundColor: page === 'reportings' ? '#E4E7F2' : '#3E58CE',
                        color: page === 'reportings' ? '#3348A9' : '#ffffff',
                        fontSize: 18,
                        textDecoration: 'none',
                    }}
                >
                    <BsReception4 />&emsp;
                    Reportings
                </NavLink>
            </div>
        </div>
    );
};


export default Menu

