import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import Barcode from "react-barcode";
import { SquarePen, Trash2 } from "lucide-react";
import TableSkeleton from "./Skeleton";


const ItemList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [itemUnitList, setItemUnitList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [shelvesList, setShelvesList] = useState([]);
  const [expiryOption, setExpiryOption] = useState("NoExpiry");
  const [expiryDay, setExpiryDay] = useState("");

  const [itemList, setItemList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [itemCategory, setItemCategory] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemName, setItemName] = useState("");
  const [details, setDetails] = useState("");
  const [manufacture, setManufacture] = useState("");
  const [supplier, setSupplier] = useState("");
  const [shelveLocation, setShelveLocation] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [perUnit, setPerUnit] = useState("");
  const [purchase, setPurchase] = useState("");
  const [sales, setSales] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [reorder, setReorder] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // --- Dummy Data ---

const [dummyItems, setDummyItems] = useState([]);

// Simulate API call
useEffect(() => {
  const timer = setTimeout(() => {
    setDummyItems([
      {
        _id: "1",
        itemType: { itemTypeName: "Beverages" },
        itemName: "Coca Cola 1L",
        purchase: 50,
        price: 80,
        stock: 120,
        labelBarcode: "BAR1234567890",
        itemImage: { url: "https://via.placeholder.com/50" },
      },
      {
        _id: "2",
        itemType: { itemTypeName: "Snacks" },
        itemName: "Lays Chips",
        purchase: 20,
        price: 40,
        stock: 300,
        labelBarcode: "BAR9876543210",
        itemImage: { url: "https://via.placeholder.com/50" },
      },
    ]);
    setLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);

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

  // Item Detals Fetch
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/item-details`
      );
      setItemList(res.data); // store actual categories array
      console.log("Item Details ", res.data);
    } catch (error) {
      console.error("Failed to fetch item details", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CategoryList Fetch
  const fetchCategoryList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/item-type/list`
      );
      setCategoryList(res.data); // store actual categories array
      console.log("Categories ", res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  // Item Unit List Fetch
  const fetchItemUnitList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/item-unit`
      );
      setItemUnitList(res.data); // store actual categories array
      console.log("Item Unit ", res.data);
    } catch (error) {
      console.error("Failed to fetch item unit", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchItemUnitList();
  }, [fetchItemUnitList]);

  // Manufacturer List Fetch
  const fetchManufacturerList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/manufacturers/list`
      );
      setManufacturerList(res.data); // store actual categories array
      console.log("Manufacturer ", res.data);
    } catch (error) {
      console.error("Failed to fetch Manufacturer", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchManufacturerList();
  }, [fetchManufacturerList]);

  // Supplier List Fetch
  const fetchSupplierList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/suppliers/list`
      );
      setSupplierList(res.data); // store actual categories array
      console.log("Supplier ", res.data);
    } catch (error) {
      console.error("Failed to fetch Supplier", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchSupplierList();
  }, [fetchSupplierList]);

  // Shelves List Fetch
  const fetchShelvesList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/shelves`
      );
      setShelvesList(res.data); // store actual categories array
      console.log("Shelves ", res.data);
    } catch (error) {
      console.error("Failed to fetch Shelves", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchShelvesList();
  }, [fetchShelvesList]);

  // Handlers
  const handleAddItem = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setItemCategory("");
    setItemType("");
    setItemName("");
    setDetails("");
    setManufacture("");
    setSupplier("");
    setShelveLocation("");
    setItemUnit("");
    setPerUnit("");
    setPurchase("");
    setSales("");
    setStock("");
    setPrice("");
    setBarcode("");
    setReorder("");
    setEnabled(true);
    setImage(null);
    setImagePreview(null);
  };

  // Save or Update Item
  const handleSave = async () => {
    // console.log("Item ", itemCategory);

    const formData = new FormData();

    formData.append("itemType", itemCategory);

    formData.append("itemName", itemName);
    formData.append("details", details);
    formData.append("manufacturer", manufacture);
    formData.append("supplier", supplier);
    formData.append("shelveLocation", shelveLocation);
    formData.append("itemUnit", itemUnit);
    formData.append("perUnit", parseInt(perUnit) || 0);
    formData.append("purchase", parseFloat(purchase) || 0);
    formData.append("price", parseFloat(sales) || 0);
    formData.append("stock", parseInt(stock) || 0);
    formData.append("labelBarcode", barcode);
    formData.append("reorder", parseInt(reorder) || 0);
    formData.append("isEnable", enabled);

    if (image) {
      formData.append("itemImage", image); // ✅ append actual file, not preview
    }

    console.log("Form Data", [...formData.entries()]);

    try {
      const headers = {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/item-details/${editId}`,
          formData,
          { headers }
        );
        toast.success("Item Details Updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/item-details`,
          formData,
          { headers }
        );
        toast.success("Item Details Added successfully");
      }

      reState();
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Item Unit failed`);
    }
  };

  // Set All States Null
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setItemCategory("");
    setItemType("");
    setManufacture("");
    setItemName("");
    setDetails("");
    setSupplier("");
    setShelveLocation("");
    setItemUnit("");
    setPerUnit("");
    setPurchase("");
    setSales("");
    setStock("");
    setPrice("");
    setBarcode("");
    setReorder("");
    setEnabled(false);
    setImagePreview("");
    setImage(null);
  };
  // Edit Item
  const handleEdit = (item) => {
    console.log("Item", item);

    setIsEdit(true);
    setEditId(item._id);

    // Dropdowns ke liye _id set karo
    setItemCategory(item?.itemCategory?._id || "");
    setManufacture(item?.manufacturer?._id || "");
    setSupplier(item?.supplier?._id || "");
    setShelveLocation(item?.shelveLocation?._id || "");
    setItemUnit(item?.itemUnit?._id || "");

    // Normal fields
    setItemName(item.itemName || "");
    setDetails(item.details || "");
    setPerUnit(item.perUnit ? item.perUnit.toString() : "");
    setPurchase(item.purchase ? item.purchase.toString() : "");
    setSales(item.sales ? item.sales.toString() : "");
    setStock(item.stock ? item.stock.toString() : "");
    setPrice(item.price ? item.price.toString() : "");
    setBarcode(item.labelBarcode || "");
    setReorder(item.reorder ? item.reorder.toString() : "");

    // Enable/Disable
    setEnabled(item.isEnable !== undefined ? item.isEnable : true);

    // Image
    setImagePreview(item?.itemImage?.url || "");
    setImage(null);

    setIsSliderOpen(true);
  };

  // Delete Item
  const handleDelete = async (id) => {
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
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/item-details/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`, // if you’re using auth
                },
              }
            );
            setItemList(itemList.filter((item) => item._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Item deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete item.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "Item is safe 🙂", "error");
        }
      });
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Image
  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  // Capitalize First Letter
  function capitalizeFirstLetter(value) {
    if (!value) return "";
    const str = String(value); // ensure it's a string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Show loading spinner
  // if (loading) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <HashLoader height="150" width="150" radius={1} color="#84CF16" />
  //       </div>
  //     </div>
  //   );
  // }
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Items List</h1>
          
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark"
          onClick={handleAddItem}
        >
          + Add Item
        </button>
      </div>

      {/* Item Table */}
    <div className="rounded-xl shadow border border-gray-200 w-full overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-[1000px] w-full text-sm text-left border-collapse">
      {/* Table Header */}
      <thead className="sticky top-0 bg-gray-100 z-10 text-xs font-semibold text-gray-600 uppercase">
        <tr>
          <th className="px-6 py-3 text-left">Item Category</th>
          <th className="px-6 py-3 text-left">Item Name</th>
          <th className="px-6 py-3 text-left">Purchase</th>
          <th className="px-6 py-3 text-left">Sales</th>
          <th className="px-6 py-3 text-left">Stock</th>
          <th className="px-6 py-3 text-left">Barcode</th>
          {userInfo?.isAdmin && (
            <th className="px-6 py-3 text-right">Actions</th>
          )}
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
  {loading ? (
    // Skeleton shown while loading
    <TableSkeleton rows={5} cols={userInfo?.isAdmin ? 7 : 6} />
  ) : (
    dummyItems.map((item, index) => (
      <tr
        key={item._id}
        className={`border-b border-gray-200 hover:bg-gray-50 ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
      >
        <td className="px-6 py-3 flex items-center gap-3">
          <img
            src={item.itemImage?.url}
            alt="Product Icon"
            className="w-7 h-7 object-cover rounded-full"
          />
          <span className="font-medium text-gray-900">
            {item?.itemType?.itemTypeName}
          </span>
        </td>
        <td className="px-6 py-3 text-gray-600">{item.itemName}</td>
        <td className="px-6 py-3 font-semibold text-gray-600">{item.purchase}</td>
        <td className="px-6 py-3 font-semibold text-gray-600">{item.price}</td>
        <td className="px-6 py-3 font-semibold text-gray-600">{item.stock}</td>
        <td className="px-6 py-3 font-semibold text-gray-600">
          {item.labelBarcode.slice(0, 12)}
        </td>
        {userInfo?.isAdmin && (
          <td className="px-6 py-3 text-right">
            <button className="text-blue-500 hover:underline mr-3">
              <SquarePen size={18} />
            </button>
            <button className="text-red-500 hover:underline">
              <Trash2 size={18} />
            </button>
          </td>
        )}
      </tr>
    ))
  )}
</tbody>

    </table>
  </div>
</div>



      {/* Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div
            ref={sliderRef}
            className="w-1/3 bg-white p-6 h-full overflow-y-auto shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Item" : "Add a New Item"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => {
                  setIsSliderOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                  setItemCategory("");
                  setItemName("");
                  setDetails("");
                  setManufacture("");
                  setSupplier("");
                  setShelveLocation("");
                  setItemUnit("");
                  setPerUnit("");
                  setPurchase("");
                  setSales("");
                  setStock("");
                  setPrice("");
                  setBarcode("");
                  setReorder("");
                  setEnabled(true);
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
              {/* Item Category */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Item Category <span className="text-newPrimary">*</span>
                </label>
                <select
                  value={itemCategory}
                  required
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categoryList.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.itemTypeName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Item Type <span className="text-newPrimary">*</span>
                </label>
                <select
                  value={itemType}
                  required
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Item Type</option>
                  {/* {categoryList.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.itemTypeName}
                    </option>
                  ))} */}
                  <option value="">tyep1</option>
                  <option value="">tyep2</option>
                  <option value="">tyep3</option>
                </select>
              </div>

              {/* Manufacture */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Manufacture <span className="text-newPrimary">*</span>
                </label>
                <select
                  value={manufacture}
                  required
                  onChange={(e) => setManufacture(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Manufacture</option>
                  {manufacturerList.map((manufacture) => (
                    <option key={manufacture._id} value={manufacture._id}>
                      {manufacture.manufacturerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Supplier <span className="text-newPrimary">*</span>
                </label>
                <select
                  value={supplier}
                  required
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Supplier</option>
                  {supplierList.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.supplierName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shelve Location */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Shelve Location <span className="text-newPrimary">*</span>
                </label>
                <select
                  value={shelveLocation}
                  required
                  onChange={(e) => setShelveLocation(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Location</option>
                  {shelvesList.map((shelves) => (
                    <option key={shelves._id} value={shelves._id}>
                      {shelves.shelfNameCode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Item Name <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={itemName}
                  required
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Item Unit */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Item Unit <span className="text-newPrimary">*</span>
                </label>
                <select
                  value={itemUnit}
                  required
                  onChange={(e) => setItemUnit(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Unit</option>
                  {itemUnitList.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.unitName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Per Unit */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Per Unit
                </label>
                <input
                  type="number"
                  value={perUnit}
                  onChange={(e) => setPerUnit(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Purchase */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Purchase <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="number"
                  value={purchase}
                  required
                  onChange={(e) => setPurchase(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Sales */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Sales <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="number"
                  value={sales}
                  required
                  onChange={(e) => setSales(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Stock <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="number"
                  value={stock}
                  required
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Reorder */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Reorder
                </label>
                <input
                  type="number"
                  value={reorder}
                  onChange={(e) => setReorder(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Secandory Barcode */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Secondary Barcode
                </label>
                <input
                  type="text"
                  value={barcode}
                  required
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. BAR1234567890" 
                   minLength={5}
  maxLength={20}  
                  onBlur={(e) => setBarcode(e.target.value)} // update on blur
                />

                {/* Show barcode only if input is not empty */}
                {barcode && (
                  <div className="mt-3">
                      <Barcode value={barcode} height={60} />  
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Expiry Day 
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="NoExpiry"
                      checked={expiryOption === "NoExpiry"}
                      onChange={(e) => setExpiryOption(e.target.value)}
                      className="form-radio"
                    />
                    No Expiry days
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="HasExpiry"
                      checked={expiryOption === "HasExpiry"}
                      onChange={(e) => setExpiryOption(e.target.value)}
                      className="form-radio"
                    />
                    Has Expiry days
                  </label>
                </div>
              </div>

              {/* Conditionally show expiry date field */}
              {expiryOption === "HasExpiry" && (
                <div className="mt-3">
              
                  <input
                    type="number"
                    value={expiryDay}
                    required
                    onChange={(e) => setExpiryDay(e.target.value)}
                    placeholder="Enter Expiry Days"
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Product Images <span className="text-newPrimary">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-newPrimary hover:text-newPrimary focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Image
                    </h3>
                    <div className="relative group w-48 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md border border-gray-200"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enable / Disable */}
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">
                  Enable / Disable
                </label>
                <button
                  type="button"
                  onClick={() => setEnabled(!enabled)}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    enabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      enabled ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Save Button */}
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-900 w-full"
                onClick={handleSave}
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
