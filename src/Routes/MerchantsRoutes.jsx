import React from 'react'
import { Routes, Route } from "react-router-dom";
import Merchants from '../Pages/Merchants/Merchants';
import MerchantDetailPage from '../Pages/Merchants/MerchantDetailPage'


function MerchantsRoutes() {
  return (
    <Routes>
      <Route path="/merchants" element={<Merchants />} />
      <Route path="/merchants/:id" element={<MerchantDetailPage />} />
    </Routes>
  )
}

export default MerchantsRoutes;