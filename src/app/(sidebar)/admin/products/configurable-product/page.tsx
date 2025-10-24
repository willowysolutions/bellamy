// import ProductImageAndCategories from "@/components/product/configurable-product";

// export default function AddConfigurableProductPage() {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Add Configurable Product</h1>
//       <ProductImageAndCategories />
//       {/* Later, add Basic fields or other shared components here */}
//     </div>
//   );
// }
import AddProductForm from "@/components/AddProductForm";
import ProductImageAndCategories from "@/components/product/configurable-product";

export default function AddConfigurableProductPage() {
  return (
    <div className="max-w-[1400px] mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>

        <div className="flex items-center gap-4">
          {/* Example search field & buttons (you can replace as needed) */}
          <input
            type="text"
            placeholder="Search product for add"
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
         
        </div>
      </div>

     {/* Main Content */}
<div className="grid grid-cols-[640px_1fr] gap-2 items-start">
  {/* Left column: Basic Details */}
  <div>
    <AddProductForm />
  </div>

  {/* Right column: Upload Product Image & Categories */}
  <div className="pt-10">
    <ProductImageAndCategories />
  </div>
</div>

    </div>
  );
}
