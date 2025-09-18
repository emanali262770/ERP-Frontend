import React, { useState } from "react";

const OpeningBalance = () => {
  const categories = ["Clothing", "Electronics", "Grocery"];

  const itemTypes = [
    { type: "Type 1", items: ["Item A", "Item B", "Item C"] }, 
    { type: "Type 2", items: Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`) }, 
    { type: "Type 3", items: Array.from({ length: 10 }, (_, i) => `Product ${i + 1}`) }, 
    { type: "Type 4", items: Array.from({ length: 30 }, (_, i) => `Material ${i + 1}`) }, 
  ];

  const [form, setForm] = useState({
    category: "",
    itemType: "",
    itemName: "",
  });

  const selectedType = itemTypes.find((t) => t.type === form.itemType);

  // Static 25 Records
  const [records, setRecords] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      sr: i + 1,
      code: `ITM${String(i + 1).padStart(3, "0")}`,
      type: i % 2 === 0 ? "Type 1" : "Type 2",
      item: i % 2 === 0 ? `Nike Shoes ${i + 1}` : `Adidas Shoes ${i + 1}`,
      purchase: 5 + i,
      sales: 2 + (i % 5),
      stock: 20 + i,
    }))
  );

  // Track editing state per cell
  const [editing, setEditing] = useState({});

  const handleChange = (index, field, value) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
  };

  const handleBlur = (index, field) => {
    setEditing((prev) => ({ ...prev, [`${index}-${field}`]: false }));
  };

  const handleFocus = (index, field) => {
    setEditing((prev) => ({ ...prev, [`${index}-${field}`]: true }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-800">Opening Balance</h1>

      {/* Form */}
    <div className="border rounded-lg shadow bg-white p-6 w-full">
  <div className="grid grid-cols-3 gap-6 w-full">
    {/* Category */}
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-1">Category</label>
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="">Select Category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* Item Type */}
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-1">Item Type</label>
      <select
        value={form.itemType}
        onChange={(e) => setForm({ ...form, itemType: e.target.value, itemName: "" })}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="">Select Item Type</option>
        {itemTypes.map((type, idx) => (
          <option key={idx} value={type.type}>
            {type.type}
          </option>
        ))}
      </select>
    </div>

    {/* Item Name (only if items > 20) */}
    {selectedType && selectedType.items.length > 20 ? (
      <div className="w-full">
        <label className="block text-gray-700 font-medium mb-1">Item Name</label>
        <select
          value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">Select Item Name</option>
          {selectedType.items.map((name, idx) => (
            <option key={idx} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    ) : (
      <div className="w-full" /> // empty column placeholder
    )}
  </div>
</div>


      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Sr</th>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Item</th>
              <th className="px-4 py-2 border">Purchase</th>
              <th className="px-4 py-2 border">Sales</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={rec.code} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{rec.sr}</td>
                <td className="px-4 py-2 border">{rec.code}</td>
                <td className="px-4 py-2 border">{rec.type}</td>
                <td className="px-4 py-2 border">{rec.item}</td>

                {/* Purchase */}
                <td className="px-4 py-2 border">
                  {editing[`${index}-purchase`] ? (
                    <input
                      type="number"
                      value={rec.purchase}
                      onChange={(e) => handleChange(index, "purchase", e.target.value)}
                      onBlur={() => handleBlur(index, "purchase")}
                      autoFocus
                      className="w-20 border rounded p-1"
                    />
                  ) : (
                    <span
                      onClick={() => handleFocus(index, "purchase")}
                      className="cursor-pointer"
                    >
                      {rec.purchase}
                    </span>
                  )}
                </td>

                {/* Sales */}
                <td className="px-4 py-2 border">
                  {editing[`${index}-sales`] ? (
                    <input
                      type="number"
                      value={rec.sales}
                      onChange={(e) => handleChange(index, "sales", e.target.value)}
                      onBlur={() => handleBlur(index, "sales")}
                      autoFocus
                      className="w-20 border rounded p-1"
                    />
                  ) : (
                    <span
                      onClick={() => handleFocus(index, "sales")}
                      className="cursor-pointer"
                    >
                      {rec.sales}
                    </span>
                  )}
                </td>

                {/* Stock */}
                <td className="px-4 py-2 border">
                  {editing[`${index}-stock`] ? (
                    <input
                      type="number"
                      value={rec.stock}
                      onChange={(e) => handleChange(index, "stock", e.target.value)}
                      onBlur={() => handleBlur(index, "stock")}
                      autoFocus
                      className="w-20 border rounded p-1"
                    />
                  ) : (
                    <span
                      onClick={() => handleFocus(index, "stock")}
                      className="cursor-pointer"
                    >
                      {rec.stock}
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 border">
                  <button className="px-3 py-1 bg-newPrimary text-white rounded">
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpeningBalance;
