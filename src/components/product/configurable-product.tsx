"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, RefreshCcw, X, Image as ImageIcon } from "lucide-react";

export default function ProductImageAndCategories() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [variant, setVariant] = useState({
    size: "",
    fabric: "",
    qty: "",
    price: ""
  });

  // Browse/upload for main image
  const handleBrowseMain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMainImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  // Replace for main image
  const handleReplaceMain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMainImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  // Add additional image thumbnail
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length) {
      setImages(prev => [...prev, ...Array.from(fileList).map(file => URL.createObjectURL(file))]);
    }
    e.target.value = '';
  };

  // Remove a thumbnail
  const removeThumbnail = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="border rounded-xl p-6 bg-white space-y-8 max-w-xl">
      {/* Upload Product Image */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Upload Product Image</h3>
        <Label className="block text-sm font-semibold text-primary mb-2">Product Image</Label>
        <div className="border rounded-lg p-4 bg-white relative" style={{ minHeight: 232 }}>
          {/* Main image display or placeholder */}
          <div className="flex justify-center items-center h-[170px]">
            {mainImage ? (
              <Image
                src={mainImage}
                alt="Main Product"
                width={180}
                height={170}
                className="object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 gap-2">
                <ImageIcon size={36} />
                <span>No image</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <label>
              <Button size="sm" variant="outline" className="flex gap-2 items-center"><ImageIcon size={16} />Browse</Button>
              <Input type="file" accept="image/*" className="hidden" onChange={handleBrowseMain} />
            </label>
            <label>
              <Button size="sm" variant="secondary" className="flex gap-2 items-center"><RefreshCcw size={16} />Replace</Button>
              <Input type="file" accept="image/*" className="hidden" onChange={handleReplaceMain} />
            </label>
          </div>
        </div>
        {/* Thumbnails/Additional images */}
        <div className="flex items-center gap-4 mt-4">
          {images.map((img, idx) => (
            <div className="relative w-20 h-20 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center" key={idx}>
              <Image src={img} alt={`Product image ${idx+1}`} width={80} height={80} className="object-cover rounded" />
              <button
                className="absolute top-1 right-1 z-10 p-1 bg-white rounded-full border"
                type="button"
                onClick={() => removeThumbnail(idx)}>
                <X size={16} className="text-gray-600" />
              </button>
            </div>
          ))}
          {/* Add Image dashed box */}
          <label className="w-20 h-20 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 text-center">
            <Plus size={24} className="text-green-600" />
            <span className="text-xs text-gray-500 mt-2">Add Image</span>
            <Input type="file" accept="image/*" multiple className="hidden" onChange={handleAddImage} />
          </label>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="mb-4">
          <Label className="block mb-1">Main Category</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category1">Category 1</SelectItem>
              <SelectItem value="category2">Category 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label className="block mb-1">Sub Category</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tag1">Sub category 1</SelectItem>
              <SelectItem value="tag2">Sub category 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Variant fields */}
      <div>
        <Button className="mb-2 bg-gray-700 text-white px-4 py-2">
          Add a variant
        </Button>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="block mb-1">Size</Label>
              <Input
                type="text"
                placeholder="Size"
                value={variant.size}
                onChange={e => setVariant(v => ({ ...v, size: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label className="block mb-1">Fabric</Label>
              <Input
                type="text"
                placeholder="Fabric"
                value={variant.fabric}
                onChange={e => setVariant(v => ({ ...v, fabric: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="block mb-1">Quantity</Label>
              <Input
                type="number"
                placeholder="Qty"
                value={variant.qty}
                onChange={e => setVariant(v => ({ ...v, qty: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label className="block mb-1">Price</Label>
              <Input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={e => setVariant(v => ({ ...v, price: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Color picker */}
      <div className="mb-4 mt-2">
        <Label className="block mb-1">Select your color</Label>
        <div className="flex gap-2 mt-2">
          <button className="w-7 h-7 rounded border bg-red-200"></button>
          <button className="w-7 h-7 rounded border bg-gray-200"></button>
          <button className="w-7 h-7 rounded border bg-green-200"></button>
          <button className="w-7 h-7 rounded border bg-yellow-200"></button>
          <button className="w-7 h-7 rounded border bg-black"></button>
        </div>
      </div>
    </div>
  );
}
