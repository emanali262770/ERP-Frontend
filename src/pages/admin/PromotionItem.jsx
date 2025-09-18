import React, { useState, useEffect, useCallback, useRef } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PromotionItem = () => {
    const [categories, setCategories] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔹 New States
    const [details, setDetails] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedPromotion, setSelectedPromotion] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedItemType, setSelectedItemType] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");

    const [categoryName, setCategoryName] = useState("");
    const [isEnable, setIsEnable] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const sliderRef = useRef(null);

    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/categories`;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Fetch categories
    const fetchCategoiresList = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`);
            setCategories(res.data);
            console.log("Categories  ", res.data);
        } catch (error) {
            console.error("Failed to fetch Supplier", error);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);
    useEffect(() => {
        fetchCategoiresList();
    }, [fetchCategoiresList]);

    // Slider animation
    useEffect(() => {
        if (isSliderOpen && sliderRef.current) {
            gsap.fromTo(
                sliderRef.current,
                { x: "100%", opacity: 0 },
                { x: "0%", opacity: 1, duration: 1.2, ease: "expo.out" }
            );
        }
    }, [isSliderOpen]);

    // Handlers
    const handleAddClick = () => {
        setEditingCategory(null);
        setCategoryName("");
        setDetails("");
        setStartDate("");
        setEndDate("");
        setSelectedPromotion("");
        setSelectedCategory("");
        setSelectedItemType("");
        setDiscountPrice("");
        setIsEnable(true);
        setIsSliderOpen(true);
    };

    const items = [
        { id: 1, name: "Nike", price: "$120" },
        { id: 2, name: "Adidas", price: "$100" },
        { id: 3, name: "Puma", price: "$90" },
        { id: 4, name: "Audi", price: "$50,000" },
        { id: 5, name: "BMW", price: "$60,000" },
        { id: 6, name: "Apple", price: "$1,200" },
        { id: 7, name: "Samsung", price: "$1,000" },
    ];

    const promotions = [
        {
            id: 1,
            promotion: "Summer Sale",
            category: "Clothing",
            itemType: "Shoes",
            items: [
                { name: "Nike", price: "$120" },
                { name: "Adidas", price: "$100" },
            ],
            discount: "20%",
            endDate: "2025-09-30",
        },
        {
            id: 2,
            promotion: "Electronics Offer",
            category: "Mobiles",
            itemType: "Smartphones",
            items: [
                { name: "Apple iPhone", price: "$1200" },
                { name: "Samsung Galaxy", price: "$1000" },
            ],
            discount: "15%",
            endDate: "2025-10-15",
        },
    ];



    const handleEditClick = (category) => {
        setEditingCategory(category);
        setCategoryName(category.categoryName);
        setIsEnable(category.isEnable);
        // If your backend provides these fields, prefill them here
        setDetails(category.details || "");
        setStartDate(category.startDate || "");
        setEndDate(category.endDate || "");
        setSelectedPromotion(category.selectedPromotion || "");
        setSelectedCategory(category.selectedCategory || "");
        setSelectedItemType(category.selectedItemType || "");
        setDiscountPrice(category.discountPrice || "");
        setIsSliderOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = categoryName.trim();

        if (!trimmedName) {
            toast.error("❌ Category name cannot be empty.");
            return;
        }

        setLoading(true);

        // 🔹 Full payload with new fields
        const payload = {
            categoryName: trimmedName,
            isEnable,
            details,
            startDate,
            endDate,
            selectedPromotion,
            selectedCategory,
            selectedItemType,
            discountPrice,
        };

        try {
            let res;
            if (editingCategory) {
                // 🔄 Update existing category
                res = await axios.put(
                    `${API_URL}/${editingCategory._id}`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${userInfo?.token}` },
                    }
                );

                setCategories(categories.map(c =>
                    c._id === editingCategory._id ? res.data : c
                ));
                toast.success("✅ Category updated!");
            } else {
                // ➕ Add new category
                res = await axios.post(API_URL, payload, {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                });

                setCategories([...categories, res.data]);
                toast.success("✅ Category added!");
            }

            // Reset form state
            setIsSliderOpen(false);
            setCategoryName("");
            setDetails("");
            setStartDate("");
            setEndDate("");
            setSelectedPromotion("");
            setSelectedCategory("");
            setSelectedItemType("");
            setDiscountPrice("");
            setIsEnable(true);
            setEditingCategory(null);
            fetchCategoiresList();
        } catch (error) {
            console.error(error);
            toast.error(`❌ Failed to ${editingCategory ? "update" : "add"} category.`);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEnable = async (category) => {
        // ... (no changes in your toggle function)
    };

    const handleDelete = async (categoryId) => {
        // ... (no changes in your delete function)
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <HashLoader height="150" width="150" radius={1} color="#84CF16" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="px-6 mx-auto">
                {/* Top bar */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-newPrimary">Promotion Items</h1>
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
                        onClick={handleAddClick}
                    >
                        + Add Promotion Items
                    </button>
                </div>

                {/* Table */}
                {/* Manufacturer Table */}
                <div className="rounded-xl shadow border border-gray-100">
                    <div className="table-container max-w-full overflow-x-auto ">
                        <div className="min-w-[1000px] max-w-[100%]">
                            {/* Table Headers */}
                            <div className="grid grid-cols-[150px_150px_150px_400px_140px_150px_210px] gap-2 bg-gray-50 py-2 px-3 text-xs font-medium text-gray-500 uppercase rounded-t-lg">
                                <div>Promotion</div>
                                <div>Category</div>
                                <div>Item Type</div>
                                <div>Item Names</div>
                                <div>Discount</div>
                                <div>End Date</div>
                                {userInfo?.isAdmin && <div className="text-center">Actions</div>}
                            </div>

                            {/* Promotion in Table */}
                            <div className="flex flex-col gap-2 mb-16">
                                {promotions.map((promo) => (
                                    <div
                                        key={promo.id}
                                        className="grid grid-cols-[150px_150px_150px_400px_140px_150px_210px] items-center gap-2 bg-white p-2 rounded-lg border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {promo.promotion}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {promo.category}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {promo.itemType}
                                        </div>
                                        <div>
                                            
                                            {promo.items.map((item, idx) => (
                                                <span key={idx} className="inline-block mr-4">
                                                    {item.name} ({item.price})
                                                </span>
                                            ))}
                                        </div>

                                        <div className="text-sm text-gray-500 truncate">
                                            {promo.discount}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {promo.endDate}
                                        </div>

                                        {userInfo?.isAdmin && (
                                            <div className="flex justify-center">
                                                <div className="relative group">
                                                    <button className="text-gray-400 hover:text-gray-600 text-xl">
                                                        ⋯
                                                    </button>
                                                    <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50 flex flex-col">
                                                        <button
                                                            onClick={() => handleEdit(promo)}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-newPrimary/10 text-newPrimary flex items-center gap-2"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(promo._id)}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 flex items-center gap-2"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                {isSliderOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
                        <div
                            ref={sliderRef}
                            className="w-full max-w-md bg-white p-4 h-full overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingCategory ? "Update Promotion" : "Add a New Promotion"}
                                </h2>
                                <button
                                    className="text-2xl text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        setCategoryName("");
                                        setDetails("");
                                        setStartDate("");
                                        setEndDate("");
                                        setSelectedPromotion("");
                                        setSelectedCategory("");
                                        setSelectedItemType("");
                                        setDiscountPrice("");
                                        setIsEnable(true);
                                        setEditingCategory(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Promotion on Item */}
                                <h3 className="text-lg font-semibold text-newPrimary mt-6 mb-2">
                                    Promotion on Item
                                </h3>

                                {/* Promotion Select */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Select Promotion</label>
                                    <select
                                        value={selectedPromotion}
                                        onChange={(e) => setSelectedPromotion(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                    >
                                        <option value="">-- Select Promotion --</option>
                                        <option value="promo1">Promotion 1</option>
                                        <option value="promo2">Promotion 2</option>
                                    </select>
                                </div>

                                {/* Category Select */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Select Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                    >
                                        <option value="">-- Select Category --</option>
                                        <option value="cat1">Category 1</option>
                                        <option value="cat2">Category 2</option>
                                    </select>
                                </div>

                                {/* Item Type Select */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Select Item Type</label>
                                    <select
                                        value={selectedItemType}
                                        onChange={(e) => setSelectedItemType(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                    >
                                        <option value="">-- Select Item Type --</option>
                                        <option value="type1">Type 1</option>
                                        <option value="type2">Type 2</option>
                                    </select>
                                </div>

                                {/* Item Name */}
                                <label className="block text-gray-700 font-medium mb-2">Select Item Name</label>
                                <div className="w-full border rounded-lg shadow p-4 max-h-60 overflow-y-auto">

                                    <ul className="space-y-3">
                                        {items.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex justify-between items-center border-b pb-2"
                                            >
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500">{item.price}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    value={item.id}
                                                    className="h-5 w-5 accent-blue-600 rounded-sm" // square checkbox
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Discount Price */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Discount Price</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter discount price"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-newPrimary text-white px-4 py-4 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-newPrimary/50"
                                >
                                    {loading ? "Saving..." : "Save Promotion"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionItem;
