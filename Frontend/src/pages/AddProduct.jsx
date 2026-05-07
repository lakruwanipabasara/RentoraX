import React, { useState } from 'react';
import axios from 'axios';

export default function AddProduct() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    deposit: '',
    rating: '',
    image: ''
  });

  const API_BASE_URL = "http://localhost:8086";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Max file size is 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        image: reader.result
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        deposit: Number(form.deposit),
        rating: Number(form.rating || 0),
        image: form.image
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/items`,
        productData
      );

      if (response.data.success) {
        alert(response.data.message);

        setForm({
          title: '',
          description: '',
          price: '',
          deposit: '',
          rating: '',
          image: ''
        });
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error("Add Product Error:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FCFC] py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">

        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Add Product
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Admin can add rental products here
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 min-h-28"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price per day"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            required
          />

          <input
            type="number"
            name="deposit"
            placeholder="Deposit"
            value={form.deposit}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            required
          />

          <input
            type="number"
            step="0.1"
            name="rating"
            placeholder="Rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              required
            />

            {form.image && (
              <div className="mt-4 w-40 h-40 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={form.image}
                  alt="Product Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-3 rounded-xl font-bold hover:bg-teal-800 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}