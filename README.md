Event Management System

A full-stack Event Management System built using React, Node.js, Express, and MongoDB.
Admins can create multiple profiles and manage events across different users and timezones.

Features

Create and manage profiles

Create, edit, and view events for each profile

Timezone support using moment-timezone

Tracks update logs for event changes

User-friendly interface built with React Select and React DatePicker

Tech Stack

Frontend: React, Axios, React-Select, React-DatePicker, Moment-Timezone
Backend: Node.js, Express.js, MongoDB, Mongoose
Styling: CSS

Setup Instructions
1. Clone the repository
git clone https://github.com/yourusername/event-management-system.git
cd event-management-system

2. Install dependencies
Backend
cd server
npm install

Frontend
cd client
npm install

3. Add environment variables

Create a .env file in the server directory:

PORT=5000
MONGO_URI=<your_mongodb_connection_string>

4. Run the project
Backend
npm start

Frontend
npm run dev

Folder Structure
project/
├── client/         # React frontend
├── server/         # Node.js + Express backend
└── README.md
