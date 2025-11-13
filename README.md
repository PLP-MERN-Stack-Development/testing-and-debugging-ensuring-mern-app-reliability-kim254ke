# MERN Todo Application

A full-stack Todo application built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates a complete CRUD (Create, Read, Update, Delete) workflow with a focus on modern development practices and comprehensive end-to-end testing.

## Features

-   ✅ Add new todos with title, description, and priority.
-   📝 View a list of all todos.
-   ✅ Mark todos as complete/incomplete.
-   🔍 Filter todos by status (All, Active, Completed).
-   ✏️ Edit existing todo details.
-   🗑️ Delete todos.
-   🔄 Data persistence across page reloads.
-   ♿ Accessible UI with ARIA labels and keyboard navigation.
-   🧪 Comprehensive E2E test suite using Cypress.

## Tech Stack

-   **Frontend:** React, CSS
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB
-   **Testing:** Cypress (for End-to-End testing)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
-   [Node.js and npm](https://nodejs.org/en/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
-   A code editor like [VS Code](https://code.visualstudio.com/)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    Install dependencies for both the backend and the frontend.
    ```bash
    # Install backend dependencies
    npm install

    # Install frontend dependencies
    cd client
    npm install
    cd ..
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string and other secrets.
    ```
    MONGO_URI=mongodb://localhost:27017/tododb
    PORT=5000
    ```

## Running the Application

To run the application, you need to start both the backend server and the frontend development server.

1.  **Start the Backend Server:**
    In your terminal, from the root directory, run:
    ```bash
    npm run server
    ```
    The backend API will be running on `http://localhost:5000`.

2.  **Start the Frontend Application:**
    Open a **new terminal** and from the root directory, run:
    ```bash
    npm run client
    ```
    The frontend application will open in your browser at `http://localhost:3000`.

## Running the Tests

This project uses Cypress for End-to-End (E2E) testing to ensure the application works as expected from a user's perspective.

**Important:** Before running tests, make sure both your backend and frontend servers are running as described above.

### Option 1: Interactive Mode (Recommended for Development)

This opens the Cypress Test Runner UI, which allows you to see the tests run in real-time, debug failures, and interact with the application.

```bash
npx cypress open

**This runs all tests from the command line without opening a browser window. It's faster and ideal for automated environments.

# Run all E2E tests
npx cypress run

Run only the todo test suite
npx cypress run --spec "cypress/e2e/todo.cy.js"