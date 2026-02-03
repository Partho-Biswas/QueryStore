# QueryStore

QueryStore is a simple web application for saving and managing text-based queries or notes. It features a user authentication system and stores user-specific data securely in a cloud database.

---

## Architecture

This project is a full-stack application with the following components:

1.  **Frontend:** A client-side interface built with plain HTML, CSS, and JavaScript. It handles user input and interaction. All frontend files (`.html`, `.css`, `auth.js`, `app.js`) are static.
2.  **Backend:** A Node.js server built with the Express framework. This server provides a RESTful API for user authentication and data management. It connects to a MongoDB database to persist data.
3.  **Database:** A cloud-hosted MongoDB database managed via MongoDB Atlas. All user information is stored here.

---

## Local Development Setup

Follow these steps to set up and run the project on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your system.
*   A code editor (e.g., VS Code).

### 1. Install Dependencies

Open a terminal in the project root directory and run the following command to install the required Node.js packages:

```bash
npm install
```

### 2. Set Up MongoDB Atlas

This application requires a connection to a MongoDB Atlas database to function.

1.  **Create an Account:** Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  **Create a Free Cluster:** Follow the instructions to create a new "Shared" (M0) cluster. The default settings are sufficient.
3.  **Configure Access:**
    *   **Database User:** Under "Database Access", create a new database user with a secure password.
    *   **Network Access:** Under "Network Access", add a new IP address entry and select "Allow Access From Anywhere" (`0.0.0.0/0`).
4.  **Get Connection String:** From the "Database" view, click "Connect" -> "Drivers" and copy your unique connection string.

### 3. Configure Environment Variables

1.  Create a file named `.env` in the root of the project directory.
2.  Add the following line to the `.env` file, pasting your connection string and replacing `<password>` with your actual database user password:

    ```
    MONGO_URI=mongodb+srv://your_username:<password>@your_cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
3.  Ensure the `.gitignore` file contains a line for `.env` to prevent committing secrets to version control.

---

## Running the Application

To run the application, you must start the backend server.

### 1. Start the Backend Server

In your terminal, run the following command from the project root:

```bash
node server.js
```

You should see messages confirming that the server is running and successfully connected to MongoDB Atlas. The server will be listening on `http://localhost:3000`.

### 2. Launch the Frontend

Open the `auth.html` or `index.html` file in your web browser. The application will now be functional and will communicate with your local backend server.

---

## Deployment Notes

This is a full-stack application and requires a hosting environment that can run a Node.js server (e.g., Render, Vercel, Heroku). It cannot be deployed on a static-only host like GitHub Pages. When deploying, the `MONGO_URI` environment variable must be set in the hosting service's dashboard.
