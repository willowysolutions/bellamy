"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

type Product = {
  id: string;
  name: string;
  price: string;
  offerPrice?: string;
  image: string;
  brand?: { name?: string; themePrimary?: string };
  description?: string;
  variantId?: string;
};

export default function LatestList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/latest-products", { cache: "no-store" });
        const data = await res.json();
        console.log("data fgrom latest",data)
        setProducts(data || []);
      } catch (e) {
        console.log(e)
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2">Loading Latest Products...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10 text-gray-500">No latest products found.</div>
    );
  }

  return (
    <section className="w-full">
      <div className="page-wrap">
        <h2 className="page-title">Latest Products</h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              offerPrice={product.offerPrice}
              image={product.image}
              brandName={product.brand?.name}
              brandThemePrimary={product.brand?.themePrimary}
              description={product.description}
              variantId={product.variantId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


// 'use client'
// import React, { useEffect } from 'react'

// function LatestList() {
//   const fetchProducts = async()=>{
//    try{
//      const res = await fetch("/api/latest-products", { cache: "no-store" });
//         const data = await res.json();
//         console.log("data fgrom latest",data)
//    }catch(err){
//     console.log(err, "error from latest")
//    }
//   }
//   useEffect(()=>{
// fetchProducts()
//   },[])
//   return (
//     <div>LatestList</div>
//   )
// }

// export default LatestList