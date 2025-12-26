import Footer from '@/components/Footer';
import ShopList from '@/components/shoplist';
import React from 'react'

function ShopPage() {
  return (
      <div className='bg-white'>
      <div className="page-wrap min-h-screen">
        <ShopList />
      </div>
      <Footer/>
      </div>
      
    );
}

export default ShopPage