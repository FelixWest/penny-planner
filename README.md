# Penny Planner

**Penny Planner** is a full-stack web application for tracking financial transactions. The frontend is built with React, while the backend uses FastAPI and SQLite.

## Features

- **Add Transactions**: Record transaction details (amount, category, description, date).
- **View Transactions**: Display transactions in a sortable table.
- **Sort Transactions**: Organize transactions by date or category.
- **Delete Transactions**: Remove individual transactions or clear all at once.
- **Total Amount**: Automatically calculate and display the total.

## Technologies Used

### Frontend:

- React
- React DatePicker
- Axios
- Bootstrap

### Backend:

- FastAPI
- SQLAlchemy
- SQLite

### Other:

- CORS Middleware

## Installation and Setup

### Prerequisites

- Node.js and npm
- Python 3.x

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/penny-planner.git
   cd penny-planner/backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the database:
   ```bash
   python -m database
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd penny-planner/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000`.

## Usage

1. Open the app in your browser at `http://localhost:3000`.
2. Add, view, sort, or delete transactions via the interface.

## API Endpoints

### Transactions

- **GET /transactions/**: Retrieve all transactions.
- **POST /transactions/**: Add a transaction.  
  Request Body:
  ```json
  {
    "amount": 100.0,
    "category": "Groceries",
    "description": "Weekly shopping",
    "date": "2024-12-01"
  }
  ```
- **DELETE /transactions/{id}**: Remove a transaction by ID.
- **DELETE /transactions/**: Clear all transactions.

## Folder Structure

```
penny-planner
├── backend
│   ├── main.py        # FastAPI application
│   ├── models.py      # SQLAlchemy models
│   ├── database.py    # Database setup
├── frontend
│   ├── src
│       ├── App.js     # Main React component
│       ├── api.js     # API requests with Axios
│       ├── App.css    # Custom styles
```

## Future Enhancements

- Authentication for secure access.
- Spending analytics dashboard.
- CSV/Excel export functionality.
- Integration with budgeting tools.

## Contributing

Contributions are welcome! Fork the repo and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
