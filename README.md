# StockSuggest

StockSuggest is an intelligent investment platform that allows users to make informed decisions based on available data. It provides a robust technology stack with a **Django REST Framework backend** and a **React.js frontend**, creating a scalable, secure, and interactive platform.  

User security is ensured through **JWT authentication** with role-based access for different user types. Additionally, StockSuggest provides **historical returns, volatility, and other essential company metrics**, such as market capitalization, with AI integration for smarter investment insights.

---

## 1. Features

- **User Management & Security:** Safe registration, login, and role-based access using JWT authentication.  
- **Stock Data Analysis:** Historical stock data with 100-day and 200-day moving averages calculated from a decade of past prices.  
- **Prediction Engine:** LSTM deep learning models provide stock trading recommendations (long-term, short-term, intraday).  
- **Event Analysis:** Explore historical market events and analyze their impact on stock movement.  
- **Data Visualization:** Interactive charts and graphs for stock trends, volatility, and daily returns to simplify complex financial data.  
- **Company Insights:** Displays information including current stock price and market capitalization.

---
## 2. Tools and Technologies Used

### Backend Framework – Django REST Framework (DRF)
The backend of SuggestStock is developed using **Django REST Framework (DRF)**, which provides a robust and scalable framework for building RESTful APIs. DRF handles stock data processing, API endpoints, and ensures smooth communication between the frontend and backend. It is chosen for its reliability, modularity, and ability to handle complex data operations.

### Frontend Framework – React.js
The frontend is developed using **React.js** to deliver a responsive and interactive user experience. Its module-based architecture enables modular development and real-time refreshes, making it ideal for rendering dynamic dashboards and visualizing stock analyses.

### Authentication – JSON Web Token (JWT)
To maintain security and role-based access, the system uses **JWT-based authentication**. JWT validates user identities and generates secure tokens for authenticated sessions, ensuring safe access control based on user roles.

### Machine Learning Model – LSTM
SuggestStock uses **Long Short-Term Memory (LSTM) networks** to predict future stock trends from historical data. LSTM is well-suited for time-series data as it captures long-term dependencies in stock prices, providing higher accuracy than standard models.

### Libraries and Frameworks
- **TensorFlow & Keras:** Build and run machine learning models.  
- **NumPy & Pandas:** Data processing and manipulation.  
- **Scikit-learn:** Model evaluation using metrics such as MSE, RMSE, and R² for reliable validation.

### Visualization – Matplotlib
**Matplotlib** is used for interactive and insightful visualizations, including stock price trends, daily return distributions, and volatility indicators.

### Database – MySQL
The database layer is implemented using **MySQL** (depending on deployment requirements). It stores user details, stock records, historical datasets, and prediction outputs. A relational database ensures data consistency, integrity, and efficient querying.

---
## 3. Installation
### 1. Clone the repository
in command-line interface
git clone https://github.com/yourusername/StockSuggest.git
cd StockSuggest
### 2. Set up the backend (Django REST Framework)
#### 1. Create a virtual environment:
python -m venv env
#### 2. Activate the environment:
Windows: env\Scripts\activate'

Linux/Mac: source env/bin/activate
#### 3. Install dependencies:
pip install -r requirements.txt
#### 4. Apply database migrations:
python manage.py migrate
#### 5. Run the backend server:
python manage.py runserver

### 3. Set up the frontend (React.js)

#### 1. Navigate to frontend folder:

cd frontend-react

#### 2. Install dependencies:

npm install

#### 3. Start the React development server:

npm start

#### 4. Access the Application

Open your browser at:

http://localhost:3000


The SuggestStock dashboard should be fully functional.

## 4. Usage

Register and log in as a user.

Explore stock trends, historical data, and predictions.

Use interactive charts and dashboards to make investment decisions.

Analyze historical market events and company metrics for insights.

## 5. Contributing

Fork the repository

Create a new branch: git checkout -b feature-name

Make your changes

Commit: git commit -m "Add feature"

Push: git push origin feature-name

Create a Pull Request
