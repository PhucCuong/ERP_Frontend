import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { SiMaterialdesignicons } from 'react-icons/si';
import { MdProductionQuantityLimits, MdInsertPageBreak } from 'react-icons/md';
import { GrPlan, GrUserWorker } from 'react-icons/gr';
import { IoTrashBinOutline } from 'react-icons/io5';
import { AiOutlineRetweet, AiOutlineDeploymentUnit } from 'react-icons/ai';
import { RiBuilding2Fill } from 'react-icons/ri';
import { BsReception4 } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';

import { FaWarehouse } from 'react-icons/fa';
import './Menu.css';
import { jwtDecode } from 'jwt-decode';

const Menu = ({ setUserName }) => {
    const [page, setPage] = useState('');
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false); // Toggle dropdown
    const [openWarehouse, setOpenWarehouse] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);
    const allowedRoles = {
        bom: ['Admin', 'Bộ phận kỹ thuật', 'Bộ phận sản xuất'],
        material: ['Admin', 'Bộ phận kỹ thuật', 'Bộ phận sản xuất'],
        product: ['Admin', 'Bộ phận kỹ thuật', 'Bộ phận kế hoạch', 'Bộ phận kiểm tra chất lượng', 'Bộ phận sản xuất', 'Bộ phận bán hàng', 'Bộ phận kho'],
        manufacturing: ['Admin', 'Bộ phận kế hoạch', 'Bộ phận sản xuất', 'Bộ phận kiểm tra chất lượng'],
        workOrder: ['Admin', 'Bộ phận kế hoạch', 'Bộ phận sản xuất', 'Bộ phận kiểm tra chất lượng'],
        unbuild: ['Admin', 'Bộ phận kế hoạch', 'Bộ phận sản xuất', 'Bộ phận kiểm tra chất lượng'],
        scrap: ['Admin', 'Bộ phận kế hoạch', 'Bộ phận kiểm tra chất lượng', 'Bộ phận kho'],
        process: ['Admin', 'Bộ phận kỹ thuật', 'Bộ phận sản xuất'],
        workCenter: ['Admin', 'Bộ phận kỹ thuật', 'Bộ phận sản xuất'],
        report: ['Admin', 'Bộ phận kế hoạch'],
        tonkho: ['Admin', 'Bộ phận kho'],
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) return;
        try {
            const decoded = jwtDecode(token);
            const info = {
                user_name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"],
            };
            setUser(info); // In ra để kiểm tra
            setUserName(info.name)
        } catch (error) {
            console.error("Token không hợp lệ", error);
        }
    }, []);

    const renderNavLink = (to, label, icon, key) => (
        <NavLink
            onClick={() => setPage(key)}
            to={to}
            className='btn-menu'
            style={{
                backgroundColor: page === key ? '#E4E7F2' : '#3E58CE',
                color: page === key ? '#3348A9' : '#ffffff',
                fontSize: 18,
                textDecoration: 'none',
            }}
        >
            {icon}&emsp;{label}

        </NavLink>
    );

    return (
        <div className="menu_container">
            <div className='user'>
                <img
                    src='https://thumbs.dreamstime.com/b/user-sign-icon-person-symbol-human-avatar-rich-man-84519083.jpg'
                    alt="Avatar"
                    width="100"
                    height="100"
                    style={{ borderRadius: '50%' }}
                />
                <div>
                    <p className='name'>{user.name}</p>
                    <p className='position'>{user.role}</p>
                </div>
            </div>
            <div className='line'></div>

            <div className='btn-menu-group'>

                <div
                    onClick={() => setOpenCategory(!openCategory)}
                    className='btn-menu'
                    style={{
                        backgroundColor: '#3E58CE',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 18,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingRight: '16px'
                    }}
                >
                    <span>📁&emsp;Danh mục sản xuất</span>
                    <FaChevronDown
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: openCategory ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    />
                </div>
                {openCategory && (
                    <div className='submenu'>
                        {allowedRoles.material.includes(user.role) &&
                            renderNavLink('/raw-materials', 'Nguyên vật liệu', <AiOutlineDeploymentUnit />, 'raw-materials')}
                        {allowedRoles.product.includes(user.role) &&
                            renderNavLink('/products', 'Sản phẩm', <MdProductionQuantityLimits />, 'products')}
                        {allowedRoles.workCenter.includes(user.role) &&
                            renderNavLink('/workcenters', 'Nhà máy', <RiBuilding2Fill />, 'workcenters')}
                        {allowedRoles.workCenter.includes(user.role) &&
                            renderNavLink('/NhaCungCap', 'Nhà cung cấp', <RiBuilding2Fill />, 'NhaCungCap')}
                            {allowedRoles.workCenter.includes(user.role) &&
                            renderNavLink('/GiaoHang', 'Đơn hàng vật liệu', <RiBuilding2Fill />, 'NhaCungCap')}
                    </div>
                )}
                <div
                    onClick={() => setOpen(!open)}
                    className='btn-menu'
                    style={{
                        backgroundColor: '#3E58CE',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 18,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingRight: '16px'
                    }}
                >
                    <span>🏭&emsp;Hoạt động sản xuất</span>
                    <FaChevronDown
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    />
                </div>

                {open && (
                    <div className='submenu'>
                        {allowedRoles.bom.includes(user.role) &&
                            renderNavLink('/bom', 'Định mức nguyên vật liệu', <SiMaterialdesignicons />, 'bom')}
                        {allowedRoles.manufacturing.includes(user.role) &&
                            renderNavLink('/manfacturingorders', 'Kế hoạch sản xuất', <GrPlan />, 'manfacturingorders')}
                        {allowedRoles.workOrder.includes(user.role) &&
                            renderNavLink('/workorders', 'Lệnh sản xuất', <GrUserWorker />, 'workorders')}

                        {allowedRoles.scrap.includes(user.role) &&
                            renderNavLink('/quality', 'Kiểm tra chất lượng', <IoTrashBinOutline />, 'quality')}

                        {allowedRoles.unbuild.includes(user.role) &&
                            renderNavLink('/unbuildorders', 'Lệnh gỡ bỏ', <MdInsertPageBreak />, 'unbuildorders')}
                        {allowedRoles.process.includes(user.role) &&
                            renderNavLink('/productionprocess', 'Quy trình sản xuất', <AiOutlineRetweet />, 'productionprocess')}

                        {allowedRoles.report.includes(user.role) &&
                            renderNavLink('/reportings', 'Báo cáo sản xuất', <BsReception4 />, 'reportings')}
                    </div>
                )}
                <div
                    onClick={() => setOpenWarehouse(!openWarehouse)}
                    className='btn-menu'
                    style={{
                        backgroundColor: '#3E58CE',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: 18,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingRight: '16px',
                        marginTop: '5px'
                    }}
                >
                    <span><FaWarehouse style={{ marginRight: 10 }} />Kho</span>
                    <FaChevronDown
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: openWarehouse ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    />
                </div>

                {openWarehouse && (
                    <div className='submenu'>
                        {allowedRoles.tonkho.includes(user.role) &&
                            renderNavLink('/tonkho', 'Tồn kho vật liệu', <BsReception4 />, 'tonkho')}
                    </div>
                )}
            </div>

        </div>

    );
};

export default Menu;
