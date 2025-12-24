import React, { useState, useEffect } from 'react';
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  FiCalendar, 
  FiUser,
  FiPackage,
  FiHash,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX
} from "react-icons/fi";
import CommanHeader from "../../../components/CommanHeader";

const ProductInstalled = () => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    slaType: 'Annual',
    installationDate: '',
    serialNo: ''
  });

  // Dummy data for installed products
  const [installedProducts, setInstalledProducts] = useState([
    {
      id: 1,
      customer: "John Doe - ABC Corp",
      product: "Laptop Pro",
      slaType: "Annual",
      installationDate: "2024-01-15",
      serialNo: "SN001-LP2024",
      status: "Active"
    },
    {
      id: 2,
      customer: "Jane Smith - XYZ Ltd",
      product: "Smartphone X",
      slaType: "Per Visit",
      installationDate: "2024-01-16",
      serialNo: "SN002-SX2024",
      status: "Active"
    },
    {
      id: 3,
      customer: "Robert Johnson - Tech Solutions",
      product: "Server Rack",
      slaType: "Annual",
      installationDate: "2024-01-17",
      serialNo: "SN003-SR2024",
      status: "Inactive"
    },
    {
      id: 4,
      customer: "Emily Davis - Innovate Inc",
      product: "Software License",
      slaType: "Annual",
      installationDate: "2024-01-18",
      serialNo: "SN004-SL2024",
      status: "Active"
    }
  ]);

  // Dummy customers for dropdown
  const dummyCustomers = [
    { id: 1, name: "John Doe - ABC Corp" },
    { id: 2, name: "Jane Smith - XYZ Ltd" },
    { id: 3, name: "Robert Johnson - Tech Solutions" },
    { id: 4, name: "Emily Davis - Innovate Inc" },
    { id: 5, name: "Michael Brown - Global Tech" }
  ];

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.customer || !formData.product || !formData.serialNo || !formData.installationDate) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isEditMode) {
      // Update existing product
      setInstalledProducts(prev => 
        prev.map(product => 
          product.id === editId 
            ? { ...product, ...formData }
            : product
        )
      );
      toast.success("Product updated successfully!");
    } else {
      // Add new product
      const newProduct = {
        id: installedProducts.length + 1,
        ...formData,
        status: "Active"
      };
      setInstalledProducts(prev => [newProduct, ...prev]);
      toast.success("Product installed successfully!");
    }

    // Reset form and close
    resetForm();
    setShowForm(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      customer: '',
      product: '',
      slaType: 'Annual',
      installationDate: '',
      serialNo: ''
    });
    setIsEditMode(false);
    setEditId(null);
  };

  // Handle edit
  const handleEdit = (product) => {
    setFormData({
      customer: product.customer,
      product: product.product,
      slaType: product.slaType,
      installationDate: product.installationDate,
      serialNo: product.serialNo
    });
    setIsEditMode(true);
    setEditId(product.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          setInstalledProducts(prev => prev.filter(product => product.id !== id));
          swalWithTailwindButtons.fire(
            "Deleted!",
            "Product deleted successfully.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Product is safe 🙂",
            "error"
          );
        }
      });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination calculations
  const totalItems = installedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = installedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <HashLoader
            height="150"
            width="150"
            radius={1}
            color="#84CF16"
          />
          <p className="mt-4 text-gray-600">Loading installed products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommanHeader/>
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiPackage className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Products Installed</h1>
            <p className="text-gray-500 text-sm">Manage installed products and SLA information</p>
          </div>
        </div>
        
        {/* Add New Product Button */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-newPrimary hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <FiPlus className="w-5 h-5" />
          Add New Installation
        </button>
      </div>

      {/* Main Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1400px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr_2fr_1fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>Customer</div>
              <div>Product</div>
              <div>SLA Type</div>
              <div>Installation Date</div>
              <div>Serial No</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
              {currentItems.map((product, index) => (
                <div
                  key={product.id}
                  className={`grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr_2fr_1fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* Customer */}
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-3 h-3 text-gray-400" />
                      <span className="truncate">{product.customer}</span>
                    </div>
                  </div>

                  {/* Product */}
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiPackage className="w-3 h-3 text-gray-400" />
                      {product.product}
                    </div>
                  </div>

                  {/* SLA Type */}
                  <div className="text-sm">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      product.slaType === 'Annual' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {product.slaType === 'Annual' ? (
                        <FiCheckCircle className="w-3 h-3" />
                      ) : (
                        <FiCalendar className="w-3 h-3" />
                      )}
                      {product.slaType}
                    </span>
                  </div>

                  {/* Installation Date */}
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-3 h-3 text-gray-400" />
                      {formatDate(product.installationDate)}
                    </div>
                  </div>

                  {/* Serial No */}
                  <div className="text-sm font-mono text-gray-900">
                    <div className="flex items-center gap-2">
                      <FiHash className="w-3 h-3 text-gray-400" />
                      {product.serialNo}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                      title="Edit"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-600/70 backdrop-blur-sm"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            {/* Header */}
            <div className="sticky top-0 bg-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiPackage className="w-6 h-6 text-newPrimary" />
                  <div>
                    <h2 className="text-xl font-bold text-newPrimary">
                      {isEditMode ? 'Edit Installation' : 'Add New Installation'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEditMode ? 'Update product installation details' : 'Enter new product installation details'}
                    </p>
                  </div>
                </div>
                <button
                  className="p-1 hover:bg-white/20 bg-white/10 rounded-lg transition-all group"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <FiX className="w-5 h-5 text-newPrimary" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary focus:border-newPrimary outline-none transition"
                      required
                    >
                      <option value="">Select Customer</option>
                      {dummyCustomers.map(customer => (
                        <option key={customer.id} value={customer.name}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary focus:border-newPrimary outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* SLA Type Radio Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SLA Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="slaType"
                        value="Annual"
                        checked={formData.slaType === 'Annual'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-newPrimary focus:ring-newPrimary border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Annual</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="slaType"
                        value="Per Visit"
                        checked={formData.slaType === 'Per Visit'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-newPrimary focus:ring-newPrimary border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Per Visit</span>
                    </label>
                  </div>
                </div>

                {/* Installation Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installation Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="installationDate"
                      value={formData.installationDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary focus:border-newPrimary outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Serial No Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial No <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="serialNo"
                      value={formData.serialNo}
                      onChange={handleInputChange}
                      placeholder="Enter serial number"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary focus:border-newPrimary outline-none transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                
                <button
                  type="submit"
                  className="flex-1 bg-newPrimary hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FiSave className="w-4 h-4" />
                  {isEditMode ? 'Update Installation' : 'Save Installation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInstalled;