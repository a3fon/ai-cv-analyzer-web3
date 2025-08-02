# AI-Powered Resume Screener

This is a full-stack web application that uses Google's Gemini AI to analyze a candidate's resume against a job description. It provides a match score, identifies missing keywords, and suggests improvements, making the screening process faster and more insightful.

The application is built with a React frontend and a Python (Flask) backend.

## Features

-   **Interactive UI:** A clean and modern user interface for uploading documents.
-   **File Parsing:** Supports both PDF and DOCX resume formats.
-   **AI-Powered Analysis:** Leverages the Gemini API for a nuanced, context-aware analysis instead of simple keyword matching.
-   **Actionable Feedback:** Provides a match score (0-100), lists top missing keywords, and offers concrete suggestions for resume improvement.
-   **Configurable AI:** Easily switch between different Gemini models (e.g., `gemini-1.5-flash`, `gemini-1.5-pro`) via an environment variable.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Python** (version 3.8 or newer)
-   **Node.js** (LTS version recommended) and **npm**

## Setup Instructions

Follow these steps carefully to set up and run the project locally.

### 1. Get Your Google Gemini API Key (it's free for testing and limited use!)

You need an API key to allow the application to communicate with the AI model.

1.  Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Sign in with your Google account.
3.  Click **"Create API key"**.
4.  Copy the generated key and save it somewhere safe. You will need it for the backend setup.

### 2. Backend Setup (Python Server)

The backend is responsible for all file processing and communication with the Gemini API.

1.  **Navigate to the `backend` directory:**
    ```bash
    cd path/to/your/project/backend
    ```

2.  **Create and activate a virtual environment:** (This is highly recommended to keep project dependencies separate).
    ```bash
    # Create the environment
    python -m venv venv

    # Activate it on Windows
    venv\Scripts\activate

    # Activate it on macOS/Linux
    source venv/bin/activate
    ```
    You should see `(.venv)` at the beginning of your terminal prompt.

3.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure the API Key:** Open the `backend/app.py` file in your code editor. Find the following line near the top:
    ```python
    FALLBACK_API_KEY = "PASTE_YOUR_API_KEY_HERE"
    ```
    Replace `"PASTE_YOUR_API_KEY_HERE"` with the actual Gemini API key you copied earlier.

### 3. Frontend Setup (React App)

The frontend provides the user interface in your web browser.

1.  **Open a new terminal.** (Keep your backend terminal open).

2.  **Navigate to the `frontend` directory:**
    ```bash
    cd path/to/your/project/frontend
    ```

3.  **Install the required Node.js packages:**
    ```bash
    npm install
    ```
    This command reads the `package.json` file and installs all necessary libraries for the user interface.

## Running the Application

To run the app, you need to have both the backend and frontend servers running simultaneously.

1.  **Start the Backend Server:**
    -   In your **backend** terminal (with the virtual environment activated), run:
        ```bash
        flask run
        ```
    -   The server will start, typically on `http://127.0.0.1:5000`. Leave this terminal running.

2.  **Start the Frontend Server:**
    -   In your **frontend** terminal, run:
        ```bash
        npm start
        ```
    -   This will automatically open a new tab in your web browser at `http://localhost:3000`.

You can now use the application!

## Configuration

### Changing the AI Model

By default, the application uses the fast and efficient `gemini-1.5-flash` model. You can switch to a more powerful model like `gemini-1.5-pro` by setting an environment variable **before** you run the backend.

-   In your backend terminal, before running `flask run`, execute one of the following commands:
