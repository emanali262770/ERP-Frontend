import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import CommanHeader from "../../components/CommanHeader";
import { SquarePen, Trash2 } from "lucide-react";
import TableSkeleton from "./Skeleton";

const ShelveLocation = () => {
  const [shelveLocationList, setShelveLocationList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [shelfName, setShelfName] = useState("");
  const [section, setSection] = useState("");
  // const [currentStockCount, setCurrentStockCount] = useState("");
  const [description, setDescription] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/shelves`;

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



  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}`);
      setShelveLocationList(res.data); // store actual categories array
      console.log("Location  ", res.data);
    } catch (error) {
      console.error("Failed to fetch Supplier", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);




  // Handlers
  const handleAddShelveLocation = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setShelfName("");
    // setSection("");
    // setCurrentStockCount("");
    setDescription("");
  };

  // Save or Update Shelve Location
  const handleSave = async () => {
    const formData = {
      shelfNameCode: shelfName,
      description,
    };
    console.log("Form data", formData);
    
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
     
        toast.success("✅ Shelve Location updated successfully");
      } else {
        const res = await axios.post(
          API_URL,
          formData,
          {
            headers
          }
        );
        
        toast.success("✅ Shelve Location added successfully");
      }
      fetchLocation()
      // Reset form
      setShelfName("");
      // setSection("");
      // setCurrentStockCount("");
      setDescription("");
      setIsSliderOpen(false);
      setIsEdit(false);
      setEditId(null);
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} shelve location failed`);
    }
  };

  // Edit Shelve Location
  const handleEdit = (shelveLocation) => {
    setIsEdit(true);
    setEditId(shelveLocation._id);
    setShelfName(shelveLocation.shelfName);
    // setSection(shelveLocation.section);
    // setCurrentStockCount(shelveLocation.currentStockCount.toString());
    setDescription(shelveLocation.description);
    setIsSliderOpen(true);
  };

  // Delete Shelve Location
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
            setShelveLocationList(shelveLocationList.filter((s) => s._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Shelve Location deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete shelve location.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Shelve Location is safe 🙂",
            "error"
          );
        }
      });
  };

  // // Show loading spinner
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
      {/* Coomon header */}
      <CommanHeader/>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">
            Shelve Locations List
          </h1>
          <p className="text-gray-500 text-sm">Manage your shelve location details</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
          onClick={handleAddShelveLocation}
        >
          + Add Shelve Location
        </button>
      </div>

      {/* Shelve Location Table */}
     <div className="rounded-xl  border border-gray-200 overflow-hidden">
  <div className="overflow-x-auto">
    <div className="min-w-[600px]">
      
      {/* ✅ Table Header - styled like previous tables */}
      <div className="hidden lg:grid grid-cols-[1fr_2fr_auto] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
        <div>Shelf Name / Code</div>
        <div>Description</div>
        {userInfo?.isAdmin && <div className="text-right">Actions</div>}
      </div>

      {/* ✅ Table Body */}
      <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {loading ? (
    // Skeleton shown while loading
   <TableSkeleton 
  rows={shelveLocationList.length } 
  cols={userInfo?.isAdmin ? 3 : 6} 
  className="lg:grid-cols-[1fr_2fr_auto]"
/>
  ):shelveLocationList.length === 0 ? (
          <div className="text-center py-4 text-gray-500 bg-white">
            No shelves found.
          </div>
        ) : (
          shelveLocationList.map((shelveLocation) => (
            <div
              key={shelveLocation._id}
              className="grid grid-cols-[1fr_2fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
            >
              {/* Shelf Name / Code */}
              <div className="font-medium text-gray-900">
                {shelveLocation.shelfNameCode}
              </div>

              {/* Description */}
              <div className="text-gray-600">{shelveLocation.description}</div>

              {/* Actions */}
              {userInfo?.isAdmin && (
                <div className="flex justify-end">
                  <div className="relative group">
                   
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(shelveLocation)}
                        className="w-full text-left py-1 text-sm  text-blue-600 flex items-center gap-2"
                      >
                        <SquarePen size={18}/>
                      </button>
                      <button
                        onClick={() => handleDelete(shelveLocation._id)}
                        className="w-full text-left py-1 text-sm  text-red-500 flex items-center gap-2"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
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
                {isEdit ? "Update Shelve Location" : "Add a New Shelve Location"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsSliderOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                  setShelfName("");
                  // setSection("");
                  // setCurrentStockCount("");
                  setDescription("");
                }}
              >
                ×
              </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
              {/* Shelf Name / Code */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Shelf Name / Code <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={shelfName}
                  required
                  onChange={(e) => setShelfName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Section */}
              {/* <div>
                <label className="block text-gray-700 font-medium">
                  Section <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={section}
                  required
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div> */}

              {/* Current Stock Count */}
              {/* <div>
                <label className="block text-gray-700 font-medium">
                  Current Stock Count <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="number"
                  value={currentStockCount}
                  required
                  onChange={(e) => setCurrentStockCount(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div> */}

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Description <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Save Button */}
              <button
                className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 w-full"
                onClick={handleSave}
              >
                Save Shelve Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelveLocation;