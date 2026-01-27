import React, { useState, useEffect } from "react";
import axios from "../axios";
import toast from 'react-hot-toast';

function Transaction({ onClose, onSuccess, existingData }) {

  const expenseCategories = ["Food & Dining", "Shopping", "Housing", "Transportation", "Vehicle", "Life & Entertainment", "Communication, PC", "Financial Expenses", "Investments", "Others"];
  const incomeCategories = ["Salary", "Free Lance", "Investments", "Others"];

  const today = new Date();

  const [transactionAmount, setTransactionAmount] = useState(existingData?.amount || "");
  const [transactionType, setTransactionType] = useState(existingData?.type || "expense");
  const [category, setCategory] = useState(existingData?.category || "");
  const [description, setDescription] = useState(existingData?.description || "");
  const [date, setDate] = useState(
    existingData ? existingData.date.split("T")[0] : "" || today.toISOString().split("T")[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

  useEffect(() => {
    if (!existingData) {
      setCategory("");
      setCustomCategory("");
      setShowCustomCategoryInput(false);
    } else {
      const categories = transactionType === "expense" ? expenseCategories : incomeCategories;
      const isCustomCategory = !categories.includes(existingData.category);
      if (isCustomCategory) {
        setCustomCategory(existingData.category);
        setCategory("Others");
        setShowCustomCategoryInput(true);
      }
    }
  }, [transactionType, existingData]);

  useEffect(() => {
    // When category changes to "Others", show custom input
    if (category === "Others") {
      setShowCustomCategoryInput(true);
      // If customCategory already has a value from editing, keep it
      if (!customCategory && existingData?.category) {
        const categories = transactionType === "expense" ? expenseCategories : incomeCategories;
        if (!categories.includes(existingData.category)) {
          setCustomCategory(existingData.category);
        }
      }
    } else {
      setShowCustomCategoryInput(false);
      // Clear custom category when switching away from "Others"
      if (category !== existingData?.category) {
        setCustomCategory("");
      }
    }
  }, [category, transactionType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalCategory = category;
      if (category === "Others" && customCategory.trim() !== "") {
        finalCategory = customCategory.trim();
      }

      if (category === "Others" && (!customCategory || customCategory.trim() === "")) {
        toast.error('Please enter a custom category name');
        return;
      }

      if (existingData) {
        await axios.put(`/update-transaction/${existingData._id}`, {
          type: transactionType,
          category: finalCategory,
          amount: transactionAmount,
          description,
          date,
        });
      } else {
        await axios.post("/add-transaction", {
          type: transactionType,
          category: finalCategory,
          amount: transactionAmount,
          description,
          date,
        });
      }

      setTransactionAmount("");
      setTransactionType("expense");
      setCategory("");
      setCustomCategory("");
      setCustomCategory("");
      setShowCustomCategoryInput(false);
      setDate(today.toISOString().split("T")[0]);
      setDescription("");
      toast.success(existingData ? 'Transaction updated!' : 'Transaction added!');
      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error('Failed to save transaction');
    }
  };
  
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 backdrop-blur-sm ${
        onClose ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`w-full max-w-md bg-white shadow-2xl h-full transform transition-transform duration-500 ease-in-out 
          ${onClose ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 h-full overflow-y-auto">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 self-end text-xl"
          >
            ✕
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            {existingData ? "Edit Transaction" : "Add New Transaction"}
          </h1>
          <h3 className="text-gray-500 text-sm mb-4">
            Enter the details for your new income or expense.
          </h3>

          {/* Transaction Type */}
          <label className="font-medium text-gray-700">Transaction Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="expense"
                value="expense"
                checked={transactionType === "expense"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <span>Expense</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="income"
                value="income"
                checked={transactionType === "income"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <span>Income</span>
            </label>
          </div>

          {/* Amount */}
          <label htmlFor="transactionAmount" className="font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="transactionAmount"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            placeholder="Enter amount"
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />

          {/* Category */}
          <label htmlFor="category" className="font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          >
            <option value="" disabled>Select a category</option>
            {(transactionType === "expense" ? expenseCategories : incomeCategories).map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>

          {showCustomCategoryInput && (
            <div className="mt-2">
              <label htmlFor="customCategory" className="font-medium text-gray-700">
                Custom Category Name
              </label>
              <input
                type="text"
                id="customCategory"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter your custom category"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required={category === "Others"}
              />
              <p className="text-xs text-gray-500 mt-1">
                Please enter a name for your custom category
              </p>
            </div>
          )}

          {/* Date */}
          <label htmlFor="mydate" className="font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="mydate"
            value={date}
            max={today.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Description */}
          <label htmlFor="description" className="font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Groceries from D-mart"
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="bg-purple-500 text-white text-sm bg-purple-500 px-4 py-2 border-0 rounded-md hover:bg-white hover:text-purple-500 transition duration-200 cursor-pointer hover:border-2 hover:border-purple-500"
          >
            {existingData ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Transaction;