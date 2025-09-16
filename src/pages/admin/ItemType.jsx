
import React, { useState, useCallback, useEffect, useRef } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const ItemType = () => {
  const [itemTypeList, setItemTypeList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [manufacturerName, setManufacturerName] = useState("");
  const [address, setAddress] = useState("");
  const [productsSupplied, setProductsSupplied] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true); // true for Active, false for Inactive
  const [gstNumber, setGstNumber] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

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

  // Static Data for Manufacturers

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/item-type`;

  // Handlers
  const handleAddManufacturer = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setManufacturerName("");
    setAddress("");
    setProductsSupplied("");
    setEmail("");
    setGstNumber("");
    setStatus(true);
    setItemCategory(""); 
  };

  const fetchItemtypeList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}`);
      setItemTypeList(res.data); // store actual categories array
      console.log("Item   ", res.data);
    } catch (error) {
      console.error("Failed to fetch Supplier", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchItemtypeList();
  }, [fetchItemtypeList,]);




  
  // CategoryList Fetch 
  
  const fetchCategoryList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories/list`);
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




  // Save or Update Manufacturer
  const handleSave = async () => {
    const formData = {
   categoryId: itemCategory,
   itemTypeName:manufacturerName
     
    };
    console.log("Form Data ", formData);
    


    try {
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (isEdit && editId) {
        // Simulate API update
        const res = await axios.put(
          `${API_URL}/${editId}`,
          formData,
          { headers }
        );
        
        fetchItemtypeList()
        toast.success("Item Type updated successfully");
      } else {
        // Simulate API create
        const res = await axios.post(
          API_URL,
          formData,
          {
            headers
          }
        );
        setItemTypeList([...itemTypeList, res.data]);
        toast.success("Item Type added successfully");
      }

      // Reset form
      setManufacturerName("");
      setAddress("");
      setProductsSupplied("");
      setEmail("");
      setGstNumber("");
      setStatus(true);
      setIsSliderOpen(false);
      setIsEdit(false);
      setEditId(null);
      fetchItemtypeList()      

    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Item type failed`);
    }
  };

  // Edit Manufacturer
  const handleEdit = (itemType) => {
    setIsEdit(true);
    setEditId(itemType._id);
    setItemCategory(itemType.category?._id || "");
    setManufacturerName(itemType.itemTypeName);
    setStatus(itemType.isEnable);
    setIsSliderOpen(true);
  };

  // Delete Manufacturer
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
            const { token } = userInfo || {};
            const headers = {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            };
            await axios.delete(`${API_URL}/${id}`, { headers });
            setItemTypeList(itemTypeList.filter((m) => m._id !== id));
            
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Manufacturer deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete manufacturer.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Manufacturer is safe 🙂",
            "error"
          );
        }
      });
  };

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
          <h1 className="text-2xl font-bold text-newPrimary">
            Item Type
          </h1>
          <p className="text-gray-500 text-sm">Manage your Item Type details</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark"
          onClick={handleAddManufacturer}
        >
          + Add Item Item
        </button>
      </div>

      {/* Manufacturer Table */}
      <div className="rounded-xl shadow p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="w-full">
            {/* Table Headers */}
            <div className="hidden lg:grid grid-cols-4 gap-4 bg-gray-50 py-3 px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div>Category Name</div>
              <div>Item Type</div>
            
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            {/* Manufacturers in Table */}
            <div className="mt-4 flex flex-col gap-[14px] pb-14">
              {itemTypeList?.map((Item) => (
                <div
                  key={Item._id}
                  className="px-8 grid grid-cols-4 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  {/* Item category Name */}
                  <div className="text-sm font-medium text-gray-900">
                    {Item?.category?.categoryName}
                  </div>

                  {/* Item Type name */}
                  <div className="text-sm text-gray-500">
                    {Item.itemTypeName}
                  </div>



                  {/* Actions */}
                  {userInfo?.isAdmin && (
                    <div className="flex justify-end">
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 text-xl">
                          ⋯
                        </button>
                        <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50 flex flex-col">
                          <button
                            onClick={() => handleEdit(Item)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-newPrimary/10 text-newPrimary flex items-center gap-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(Item._id)}
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
            className="w-1/3 bg-white p-6 h-full overflow-y-auto shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Item Type" : "Add a New Item Type"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsSliderOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md space-y-4">

                 {/* Item Category */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Item Category Id <span className="text-newPrimary">*</span>
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
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>


              {/* Unit Name */}
              <div>
                <label className="block text-gray-700 font-medium">
                Item Type<span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={manufacturerName}
                  required
                  onChange={(e) => setManufacturerName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>



              {/* Save Button */}
              <button
                className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 w-full"
                onClick={handleSave}
              >
                Save Item Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemType;

