# 🚀ScreenPulse API REST  

This backend application, built with Node.js and Express, serves as the REST API for the [ScreenPulse-frontApp](https://github.com/EduGese/ScreenPulse-frontApp). It utilizes TypeScript to ensure strong and robust typing, ensuring code reliability and maintainability.

## Introduction
ScreenPulse REST API acts as the backend server for the ScreenPulse-frontApp application, providing endpoints for user authentication, data management, and integration with external APIs such as OMDB.

## Installation
To install and set up the project locally, follow these steps:
1. Clone the repository: `git clone [repository URL]`
2. Navigate to the project directory: `cd [project directory]`
3. Install dependencies: `npm install`
4. Set up environment variables: Create a `.env` file and specify the required variables.
5. Start the server: `npm start`

## Usage
Once the server is running, you can make requests to the provided endpoints to perform various operations such as user authentication, data retrieval, and favorites management.

## ✨Features 
- **Authentication:** User registration and login for authentication and authorization.
- **Data Protection and Security:** Ensures secure password hashing and authentication.
- **OMDB API Integration:** Retrieve movie, series, and video game information from the OMDB API.
- **Favorites Management:** CRUD operations to manage user favorites in the database.

## 🛠️Technologies & Libraries Used 
- **Node.js:** Server-side JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **Dotenv:** Library for managing environment variables.
- **Bcryptjs:** Library for secure password hashing.
- **Mongoose:** MongoDB object modeling tool.
- **MongoDB Atlas:** Cloud-based database service.
- **Axios:** Promise-based HTTP client for making requests to servers.
- **Render:** Hosting service.
- **Swagger UI:** Interactive API documentation and testing tool.

## API documentation
[Swagger UI](https://edugese.github.io/ScreenPulse-backend-Api/)

## ⚙️ Quality Assurance Workflow 

[![Lint Validation](https://github.com/EduGese/ScreenPulse-backend-Api/actions/workflows/lint.yml/badge.svg)](https://github.com/EduGese/ScreenPulse-backend-Api/actions)

This project implements a professional two-level code validation and deployment flow:

### 1. Local validation with Husky

- **Pre-commit:** Runs `lint-staged` to ensure only staged files that pass ESLint rules can be committed.
- **Pre-push:** Runs a global lint on the entire project before pushing. If errors are found, the push is blocked.
- This guarantees that only clean, consistent code can be pushed to the remote repository.

### 2. Remote validation with GitHub Actions

- Every push or pull request to the `prod` branch automatically triggers a lint workflow in GitHub Actions.
- If lint fails, the check turns red and code cannot be merged into production.
- This ensures code quality even if local hooks are bypassed.

### 3. Branch protection

- The `prod` branch is protected in GitHub.
- Merges are only allowed if the lint check passes.
- Pull requests are recommended for all changes, ensuring peer review and quality control.

#### Example GitHub Actions Workflow



##🔧 Configuration 
Configuration settings, including database URLs and CORS client URLs, are centralized in a `.env` file. This approach simplifies the management of environment variables and enhances the modularity of the codebase.

## 🧩Modular Structure 
The application is structured into separate modules for core functionalities, such as users, API integration, and favorites management. Each module consists of independent controllers, routes, and services, promoting clear separation of concerns and efficient code organization.

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please fork the repository, make your changes, and submit a pull request. Be sure to follow the project's coding standards and guidelines.

## License
This project is licensed under the [MIT License](#).
