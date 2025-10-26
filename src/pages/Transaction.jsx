function Transaction({ onClose, onSuccess, existingData }) {
  const expenseCategories = ["Food & Dining", "Shopping", "Housing", "Transportation", "Vehicle", "Life & Entertainment", "Communication, PC", "Financial Expenses", "Investments", "Others"];
  const incomeCategories = ["Salary", "Free Lance", "Investments", "Others"];

  const today = new Date();

  const [transactionAmount, setTransactionAmount] = useState(existingData?.amount || "");
  const [transactionType, setTransactionType] = useState(existingData?.type || "expense");
  const [category, setCategory] = useState(existingData?.category || "");
  const [description, setDescription] = useState(existingData?.description || "");
  const [date, setDate] = useState(
    existingData ? existingData.date.split("T")[0] : today.toISOString().split("T")[0]
  );

  useEffect(() => {
    if (!existingData) setCategory("");
  }, [transactionType, existingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingData) {
        await axios.put(`/update-transaction/${existingData._id}`, {
          type: transactionType,
          category,
          amount: transactionAmount,
          description,
          date,
        });
      } else {
        await axios.post("/add-transaction", {
          type: transactionType,
          category,
          amount: transactionAmount,
          description,
          date,
        });
      }

      setTransactionAmount("");
      setTransactionType("expense");
      setCategory("");
      setDate(today.toISOString().split("T")[0]);
      setDescription("");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end backdrop-blur-sm">
      <div className="w-full max-w-md bg-white shadow-2xl h-full transform transition-transform duration-300 ease-in-out">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 sm:p-6 h-full overflow-y-auto">
          {/* Close button */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              {existingData ? "Edit Transaction" : "Add Transaction"}
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Enter the details for your income or expense.
          </p>

          {/* Transaction Type */}
          <div>
            <label className="font-medium text-gray-700 text-sm">Transaction Type</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="expense"
                  checked={transactionType === "expense"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Expense</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="income"
                  checked={transactionType === "income"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Income</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="transactionAmount" className="font-medium text-gray-700 text-sm">Amount (₹)</label>
            <input
              type="number"
              id="transactionAmount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none mt-1"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="font-medium text-gray-700 text-sm">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none mt-1"
            >
              <option value="" disabled>Select a category</option>
              {(transactionType === "expense" ? expenseCategories : incomeCategories).map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="mydate" className="font-medium text-gray-700 text-sm">Date</label>
            <input
              type="date"
              id="mydate"
              value={date}
              max={today.toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="font-medium text-gray-700 text-sm">Description (Optional)</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Groceries from D-mart"
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none mt-1"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-3 rounded-md mt-4 hover:bg-purple-600 transition duration-200 text-sm font-medium"
          >
            {existingData ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Transaction;