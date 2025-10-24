// 'use client';

// import { useState, ChangeEvent, FormEvent } from 'react';
// import { Search, Edit, Link as LinkIcon, Trash2, Plus } from 'lucide-react';

// interface FormData {
//   productName: string;
//   description: string;
//   price: string;
//   discountedPrice: string;
//   discountType: string;
//   salePrice: string;
//   taxIncluded: boolean;
//   expirationStart: string;
//   expirationEnd: string;
//   stockQuantity: string;
//   stockStatus: string;
//   unlimited: boolean;
//   highlightProduct: boolean;
//   productCategory: string;
//   productTag: string;
//   selectedColor: string;
// }

// export default function AddProductForm() {
//   const [formData, setFormData] = useState<FormData>({
//     productName: 'iPhone 15',
//     description: 'The iPhone 15 delivers cutting-edge performance with the A16 Bionic chip, an impressive Super Retina XDR display, advanced dual-camera system, and exceptional battery life, all encased in stunning aerospace-grade aluminum.',
//     price: '$999.89',
//     discountedPrice: '$99',
//     discountType: 'Optional',
//     salePrice: '$900.89',
//     taxIncluded: true,
//     expirationStart: '',
//     expirationEnd: '',
//     stockQuantity: 'Unlimited',
//     stockStatus: 'In Stock',
//     unlimited: true,
//     highlightProduct: false,
//     productCategory: '',
//     productTag: '',
//     selectedColor: ''
//   });

//   const [images, setImages] = useState([
//     '/api/placeholder/100/100',
//     '/api/placeholder/100/100',
//     '/api/placeholder/100/100'
//   ]);

//   const colors: string[] = ['#C8E6C9', '#F8BBD0', '#BBDEFB', '#FFF9C4', '#424242'];

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   const handleImageUpload = (): void => {
//     console.log('Upload image');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         Header
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search product for add"
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
//               Publish Product
//             </button>
//             <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
//               Save to draft
//             </button>
//             <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           {/* Left Column - Form */}
//           <div className="col-span-2 space-y-6">
//             {/* Basic Details */}
//             <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.productName}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, productName: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Description
//                 </label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
//                   rows={4}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//                 <div className="flex gap-2 mt-2">
//                   <button className="p-1 hover:bg-gray-100 rounded">
//                     <Edit className="w-4 h-4" />
//                   </button>
//                   <button className="p-1 hover:bg-gray-100 rounded">
//                     <LinkIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Pricing */}
//             {/* Pricing */}
// <div className="bg-white rounded-lg p-6 shadow-sm">
//   <h2 className="text-lg font-semibold mb-4">Pricing</h2>

//   {/* Product Price & Tax */}
//   <div className="grid grid-cols-2 gap-4 mb-4">
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Product Price
//       </label>
//       <input
//         type="text"
//         value={formData.price}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setFormData({ ...formData, price: e.target.value })
//         }
//         placeholder="$999.89"
//         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Tax Included
//       </label>
//       <div className="space-y-2">
//         <label className="flex items-center">
//           <input
//             type="radio"
//             checked={formData.taxIncluded === true}
//             onChange={() => setFormData({ ...formData, taxIncluded: true })}
//             className="mr-2"
//           />
//           <span className="text-sm">Yes</span>
//         </label>
//         <label className="flex items-center">
//           <input
//             type="radio"
//             checked={formData.taxIncluded === false}
//             onChange={() => setFormData({ ...formData, taxIncluded: false })}
//             className="mr-2"
//           />
//           <span className="text-sm">No</span>
//         </label>
//       </div>
//     </div>
//   </div>

//   {/* Discounted Price & Sale Price */}
//   <div className="grid grid-cols-2 gap-4 mb-4">
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Discounted Price (Optional)
//       </label>
//       <input
//         type="text"
//         value={formData.discountedPrice}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setFormData({ ...formData, discountedPrice: e.target.value })
//         }
//         placeholder="$99"
//         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Sale Price
//       </label>
//       <input
//         type="text"
//         value={formData.salePrice}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setFormData({ ...formData, salePrice: e.target.value })
//         }
//         placeholder="$900.89"
//         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//       />
//     </div>
//   </div>

//   {/* Expiration Dates */}
//   <div className="grid grid-cols-2 gap-4">
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Expiration Start
//       </label>
//       <input
//         type="date"
//         value={formData.expirationStart}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setFormData({ ...formData, expirationStart: e.target.value })
//         }
//         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Expiration End
//       </label>
//       <input
//         type="date"
//         value={formData.expirationEnd}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setFormData({ ...formData, expirationEnd: e.target.value })
//         }
//         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//       />
//     </div>
//   </div>
// </div>


//             {/* Inventory */}
//             <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">Inventory</h2>
              
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock Quantity
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.stockQuantity}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                     disabled={formData.unlimited}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock Status
//                   </label>
//                   <select
//                     value={formData.stockStatus}
//                     onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({...formData, stockStatus: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option>In Stock</option>
//                     <option>Out of Stock</option>
//                     <option>Low Stock</option>
//                   </select>
//                 </div>
//               </div>

//               <label className="flex items-center gap-2 mb-3">
//                 <input
//                   type="checkbox"
//                   checked={formData.unlimited}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, unlimited: e.target.checked})}
//                   className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
//                 />
//                 <span className="text-sm font-medium">Unlimited</span>
//               </label>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.highlightProduct}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, highlightProduct: e.target.checked})}
//                   className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
//                 />
//                 <span className="text-sm">Highlight this product in a featured section.</span>
//               </label>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-center gap-3">
//               <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
//                 Save to draft
//               </button>
//               <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
//                 Publish Product
//               </button>
//             </div>
//           </div>

//           {/* Right Column - Images & Categories */}
//           {/* <div className="space-y-6"> */}
//             {/* Upload Product Image */}
//             {/* <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">Upload Product Image</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Image
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <img 
//                     src="/api/placeholder/150/200" 
//                     alt="Product"
//                     className="mx-auto mb-3 rounded-lg"
//                   />
//                   <div className="flex justify-center gap-2">
//                     <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                     <span className="text-sm text-gray-500">Remove</span>
//                     <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
//                       <Edit className="w-4 h-4" />
//                     </button>
//                     <span className="text-sm text-gray-500">Replace</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-3 mb-4">
//                 {images.map((img, idx) => (
//                   <div key={idx} className="border border-gray-300 rounded-lg p-2">
//                     <img src={img} alt={`Product ${idx + 1}`} className="w-full rounded" />
//                   </div>
//                 ))}
//               </div>

//               <button 
//                 onClick={handleImageUpload}
//                 className="w-full border-2 border-dashed border-green-500 rounded-lg py-8 flex flex-col items-center justify-center hover:bg-green-50 transition-colors"
//               >
//                 <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
//                   <Plus className="w-6 h-6 text-white" />
//                 </div>
//                 <span className="text-green-500 font-medium">Add Image</span>
//               </button>
//             </div> */}

//             {/* Categories */}
//             {/* <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h2 className="text-lg font-semibold mb-4">Categories</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Categories
//                 </label>
//                 <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
//                   <option>Select your product</option>
//                   <option>Electronics</option>
//                   <option>Clothing</option>
//                   <option>Home & Garden</option>
//                 </select>
//               </div> */}

//               {/* <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Tag
//                 </label>
//                 <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
//                   <option>Select your product</option>
//                   <option>New</option>
//                   <option>Featured</option>
//                   <option>Sale</option>
//                 </select>
//               </div> */}

//               {/* <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select your color
//                 </label>
//                 <div className="flex gap-2">
//                   {colors.map((color, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setFormData({...formData, selectedColor: color})}
//                       className={`w-10 h-10 rounded border-2 ${
//                         formData.selectedColor === color ? 'border-gray-800' : 'border-gray-300'
//                       }`}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))}
//                 </div>
//               </div> */}
//             {/* </div> */}
//           {/* </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Search, Edit, Link as LinkIcon, Trash2, Plus } from 'lucide-react';

interface FormData {
  productName: string;
  description: string;
  price: string;
  discountedPrice: string;
  discountType: string;
  salePrice: string;
  taxIncluded: boolean;
  expirationStart: string;
  expirationEnd: string;
  stockQuantity: string;
  stockStatus: string;
  unlimited: boolean;
  highlightProduct: boolean;
  productCategory: string;
  productTag: string;
  selectedColor: string;
}

export default function AddProductForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: 'iPhone 15',
    description:
      'The iPhone 15 delivers cutting-edge performance with the A16 Bionic chip, an impressive Super Retina XDR display, advanced dual-camera system, and exceptional battery life, all encased in stunning aerospace-grade aluminum.',
    price: '$999.89',
    discountedPrice: '$99',
    discountType: 'Optional',
    salePrice: '$900.89',
    taxIncluded: true,
    expirationStart: '',
    expirationEnd: '',
    stockQuantity: 'Unlimited',
    stockStatus: 'In Stock',
    unlimited: true,
    highlightProduct: false,
    productCategory: '',
    productTag: '',
    selectedColor: '',
  });

  const [images, setImages] = useState([
    '/api/placeholder/100/100',
    '/api/placeholder/100/100',
    '/api/placeholder/100/100',
  ]);

  const colors: string[] = ['#C8E6C9', '#F8BBD0', '#BBDEFB', '#FFF9C4', '#424242'];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleImageUpload = (): void => {
    console.log('Upload image');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="col-span-2 space-y-6">
            {/* Basic Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Basic Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex gap-2 mt-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Pricing</h2>

              {/* Product Price & Tax */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="$999.89"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Included
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.taxIncluded === true}
                        onChange={() => setFormData({ ...formData, taxIncluded: true })}
                        className="mr-2"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.taxIncluded === false}
                        onChange={() => setFormData({ ...formData, taxIncluded: false })}
                        className="mr-2"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Discounted Price & Sale Price */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discounted Price (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.discountedPrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, discountedPrice: e.target.value })
                    }
                    placeholder="$99"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price
                  </label>
                  <input
                    type="text"
                    value={formData.salePrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, salePrice: e.target.value })
                    }
                    placeholder="$900.89"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Expiration Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Start
                  </label>
                  <input
                    type="date"
                    value={formData.expirationStart}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, expirationStart: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration End
                  </label>
                  <input
                    type="date"
                    value={formData.expirationEnd}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, expirationEnd: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Inventory</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="text"
                    value={formData.stockQuantity}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={formData.unlimited}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFormData({ ...formData, stockStatus: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                    <option>Low Stock</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.unlimited}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, unlimited: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                />
                <span className="text-sm font-medium">Unlimited</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.highlightProduct}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, highlightProduct: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                />
                <span className="text-sm">
                  Highlight this product in a featured section.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Save to draft
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
                Publish Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
