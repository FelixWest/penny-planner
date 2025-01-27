import "./App.css";
import React, { useState, useEffect } from "react";
import api from "./api";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { enGB } from "date-fns/locale"; // in order to get the date displayed like this DD/MM/YYYY
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [categorySortOrder, setCategorySortOrder] = useState("a-z");
  const [isCategorySort, setIsCategorySort] = useState(false);

  // Fetch transactions from the backend and update state
  const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    setTransactions(response.data);
  };

  useEffect(() => {
    // Fetch transactions when the component mounts
    fetchTransactions();
  }, []);

  const handleInputChange = (event) => {
    let value = event.target.value;

    if (event.target.name === "amount" && (isNaN(value) || value <= 0)) {
      value = ""; // Prevent invalid or non-positive values
    }

    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date || "", // Store the Date object directly
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check for missing or invalid fields
    if (!formData.amount || !formData.category || !formData.date) {
      setErrorMessage(
        "1 or more fields lack required information. Make sure you have entered a valid Amount, picked a Category, and a Date."
      );
      return;
    }

    // Reset error message if all fields are valid
    setErrorMessage("");

    // Ensure date is properly formatted
    const formattedData = {
      ...formData,
      date: formData.date ? formData.date : null, // Leave as null or string (already formatted as YYYY-MM-DD)
    };

    await api.post("/transactions/", formattedData); // Use the formatted data for submission
    fetchTransactions();
    setFormData({
      amount: "",
      category: "",
      description: "",
      date: "", // Reset date field
    });
  };

  // Handle deleting an individual transaction
  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    ); // Update state to reflect the deletion
  };

  // Handle deleting all transactions
  const deleteAllTransactions = async () => {
    await api.delete("/transactions/");
    setTransactions([]); // Clear all transactions from the state
  };

  // Sorting logic: Date or Category
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (isCategorySort) {
      // Sorting by category (A-Z or Z-A)
      if (categorySortOrder === "a-z") {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
      } else if (categorySortOrder === "z-a") {
        if (a.category > b.category) return -1;
        if (a.category < b.category) return 1;
        return 0;
      }
    } else {
      // Sorting by date (newest or oldest)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (sortOrder === "newest") {
        return dateB - dateA; // Newest first
      } else if (sortOrder === "oldest") {
        return dateA - dateB; // Oldest first
      }
    }
    return 0; // Default return
  });

  // Calculate total amount (sum of all transaction amounts)
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + parseFloat(transaction.amount || 0),
    0
  );

  return (
    <div>
      <nav className="navbar navbar-dark custom-navbar">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Penny Planner
          </a>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              onChange={handleInputChange}
              value={formData.amount}
              placeholder="--Enter a value greater than 0" // Add placeholder text
              min="1" // Ensure only positive values
            />
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className="form-control"
              id="category"
              name="category"
              onChange={handleInputChange}
              value={formData.category}
            >
              <option value="" disabled hidden>
                --Select a category
              </option>

              <option value="Clothing">Clothing</option>
              <option value="DebtRepayment">Debt Repayment</option>
              <option value="DiningOut">Dining Out</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Groceries">Groceries</option>
              <option value="Housing">Housing</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
              <option value="Transportation">Transportation</option>
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={handleInputChange}
              placeholder="--Optional" // Add placeholder text
              value={formData.description}
            />
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <DatePicker
              selected={formData.date ? new Date(formData.date) : null}
              onChange={handleDateChange}
              className="form-control"
              dateFormat="dd/MM/yyyy" // Display as DD/MM/YYYY
              locale={enGB} // Ensure parsing/formatting uses DD/MM/YYYY
              placeholderText="--Select a date" // Add placeholder text
              onKeyDown={(e) => e.preventDefault()} // Block any manual typing via the keyboard to prevent users form adding invalid dates
              onFocus={(e) => e.target.blur()} // Disable manual input but keep the date picker functional
            ></DatePicker>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        {/* Display sort buttons if more than one transaction */}
        {transactions.length > 1 && (
          <div className="my-3">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsCategorySort(false); // Sort by date first
                setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
              }}
            >
              Sort by Date {sortOrder === "newest" ? "(Newest)" : "(Oldest)"}
            </button>
            <button
              className="btn btn-secondary ms-2"
              onClick={() => {
                setIsCategorySort(true); // Sort by category first
                setCategorySortOrder(
                  categorySortOrder === "a-z" ? "z-a" : "a-z"
                );
              }}
            >
              Sort by Category {categorySortOrder === "a-z" ? "(A-Z)" : "(Z-A)"}
            </button>
          </div>
        )}

        {/* Display total amount */}
        {transactions.length > 0 && (
          <div className="my-3">
            <strong>Total Amount: </strong>
            {Math.round(totalAmount)}
          </div>
        )}

        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{Math.round(transaction.amount)}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>
                  {transaction.date
                    ? new Date(transaction.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : ""}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Show 'Delete All' button if more than 1 transaction exist */}
        {transactions.length >= 2 && (
          <button className="btn btn-danger" onClick={deleteAllTransactions}>
            Delete All Transactions
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
