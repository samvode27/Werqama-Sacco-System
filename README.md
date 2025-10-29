# WERQAMA SACCO – Saving & Loan Management System

WERQAMA SACCO is a MERN Stack (MongoDB, Express, React, Node.js) web application designed to manage member savings, loans, contributions, and financial records efficiently.
It’s ideal for small to medium Savings and Credit Cooperatives (SACCOs).

# Install Node.js and npm
1. Go to Node.js official website(https://nodejs.org/en/download/)

2. Download the LTS (Long-Term Support) version (recommended).

3. Run the installer:
     Accept the license agreement
     Keep default installation path
     Ensure “Add to PATH” is checked

4. Once installed, verify:
     node -v(see version numbers)
     npm -v(see version numbers)

# Install MongoDB
     Visit(https://www.mongodb.com/try/download/community)
     Create a free cluster.
     Add a database user and whitelist your IP.
     Copy your connection string(mongodb+srv://werqama_user:2003aug22@cluster0.u3ij6sh.mongodb.net/werqama_sacco?retryWrites=true&w=majority&appName=Cluster0)

# Project Structure
WERQAMA-SACCO/
│
├── backend/   
│   ├── 
│   ├──
│   ├── .env
├── frontend/  
│   ├── 
│   ├── 
│   └── .env
│
└── README.md

# Create a .env file inside backend/
PORT=8080
MONGO_URI=mongodb+srv://werqama_user:2003aug22@cluster0.u3ij6sh.mongodb.net/werqama_sacco?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=2003aug22
NODE_ENV=development
EMAIL_USER=setarigesamuel@gmail.com
EMAIL_PASS=mgjgwswueijswmhs
CHAPA_PUBLIC_KEY=CHAPUBK_TEST-RaJ4Y9MS3OHlZNQdhUC9jY4YhayZO5wd
CHAPA_SECRET_KEY=CHASECK_TEST-FCr5aqz37hV98jqQ9cDdnsKR6wQNpuwj
FRONTEND_URL=https://localhost:3000
BASE_URL=http://localhost:8080
FAYDA_BASE_URL=https://fayda-auth.vercel.app
FAYDA_API_KEY=2787be9a35145cdf855285fcf351f12bf9cbae82f046e528d664692e3d0f6d71

# Installation Guide

1. Clone the Repository
git clone https://github.com/samvode27/Werqama-Sacco-System.git
cd WERQAMA-SACCO

2. Setup Backend
cd backend
npm install

3. Setup Frontend (Open another terminal)
cd frontend
npm install

Your application should now be running:

# Technologies Used
Layer                        Stack
Frontend                     React.js, Axios, TailwindCSS, BootstrpaCSS
Backend                      Node.js, Express.js
Database                     MongoDB, Mongoose
Authentication               JWT (JSON Web Tokens), FYDA(Ethiopian Nationnal Id) Authentication
Deployment                   MongoDB Atlas

# License
This project is licensed under the MIT License – feel free to use and modify it.

# Author
Developed by Samuel Setarge – MERN Stack Developer
GitHub: https://github.com/samvode27
Email: setarigesamuel@gmail.com
