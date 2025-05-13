import React from 'react';
import './DashBoard.css';
import dashboardImage from '../../assets/images/DashBoard.png';

const DashBoard = () => {
    return (
        <div className="dashboard" style={{ width: '100%', height: '100vh', backgroundColor: '#fff', flex: 1}}>
            <div
                style={{fontSize: 40, fontWeight: 'bold', color : '#3E58CE'}}
            >WELCOME BACK!</div>
            <img 
                src={dashboardImage}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                alt="Dashboard" 
            />
        </div>
    );
};

export default DashBoard;
