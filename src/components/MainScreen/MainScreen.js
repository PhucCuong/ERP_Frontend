import { Route, Routes, Navigate } from 'react-router-dom'
import './MainScreen.css'
import Bom from './Bom'
import Products from './Products'
import Manfacturingorders from './Manfacturingorders'
import Workorders from './Workorders'
import Unbuildorders from './Unbuildorders'
import Scrap from './Scrap'
import Productionprocess from './Productionprocess'
import Workcenters from './Workcenters'
import Reportings from './Reportings'
const MainScreen = () => {
    return (
        <div className='mainscreen_container'>
            <Routes>
                <Route path="/" element={<Navigate to="/bom" />} />

                <Route path="/bom" element={<Bom />} />
                <Route path="/products" element={<Products />} />
                <Route path="/manfacturingorders" element={<Manfacturingorders />} />
                <Route path="/workorders" element={<Workorders />} />
                <Route path="/unbuildorders" element={<Unbuildorders />} />
                <Route path="/scrap" element={<Scrap />} />
                <Route path="/productionprocess" element={<Productionprocess />} />
                <Route path="/workcenters" element={<Workcenters />} />
                <Route path="/reportings" element={<Reportings />} />
            </Routes>
        </div>
    )
}

export default MainScreen