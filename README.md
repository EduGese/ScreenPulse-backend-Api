# 🚀 ScreenPulse API REST  

[![Lint and Test Validation](https://github.com/EduGese/ScreenPulse-backend-Api/actions/workflows/lint.yml/badge.svg)](https://github.com/EduGese/ScreenPulse-backend-Api/actions)
[![Swagger UI](https://img.shields.io/badge/API%20Docs-Swagger-blue?logo=swagger)](https://edugese.github.io/ScreenPulse-backend-Api/)

This backend application, built with Node.js and Express, serves as the REST API for the [ScreenPulse-frontApp](https://github.com/EduGese/ScreenPulse-frontApp). It utilizes TypeScript to ensure strong and robust typing, ensuring code reliability and maintainability.

## Introduction
ScreenPulse REST API acts as the backend server for the ScreenPulse-frontApp application, providing endpoints for user authentication, data management, and integration with external APIs such as OMDB.

## 📦 Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account or local MongoDB instance

### Quick Start

1. **Clone the repository**
```bash
 git clone https://github.com/EduGese/ScreenPulse-backend-Api.git

```
```bash
cd ScreenPulse-backend-Api
```
2. **Install dependencies**
```bash
npm install
```
3. **Set up environment variables**  
Create a `.env` file in the root directory. This file is required to configure the application's environment-specific settings such as database credentials, API keys, server ports, and security tokens. Without these, the application will not run correctly.

> _Refer to the [Configuration](#-configuration) section below for all required variables and example settings._

---

##### Notes on `.env` and `.env.production` files

- `.env` is used for local development settings.
- `.env.production` can be used to specify production-specific environment variables if you manage different configurations for development and production environments.
- Ensure both files are created and properly configured if your deployment or local setup requires it.
- These files should **never** be committed to version control to protect sensitive information.

4. **Start the development server**
```bash
npm run dev
```

## 📜 Available Scripts

- `npm run test` – Run all unit tests using Jest.
- `npm run test:watch` – Run tests in watch mode for active development.
- `npm run dev` – Start the development server with hot reloading (Nodemon + ts-node).
- `npm start` – Start the production server using the compiled JavaScript code.
- `npm run build` – Compile the TypeScript source code to the `dist` directory.
- `npm run build_run` – Compile the project and immediately start the server using the compiled output.
- `npm run prod` – Run the server in production mode (sets `NODE_ENV=production`).
- `npm run lint` – Run ESLint and automatically fix linting errors in the `src` folder.
- `npm run format` – Format all source files in `src` using Prettier.
- `npm run format:check` – Check file formatting with Prettier (does not modify files).
- `npm run prepare` – Install Husky hooks for Git pre-commit and pre-push validation.

## 🚀 Usage

After starting the server, you can quickly test the API with:
- Register a user:
```bash
curl -X 'POST' \
  'http://localhost:9000/api/user/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "P@ssw0rd"
}'
```

- Get a movie search
```bash
curl -X 'GET' \
  'http://localhost:9000/api/omdb?title=robocop&type=movie' \
  -H 'accept: application/json'
```

## ✨ Features 
- **Authentication:** User registration and login for authentication and authorization.
- **Data Protection and Security:** Ensures secure password hashing and authentication.
- **OMDB API Integration:** Retrieve movie, series, and video game information from the OMDB API.
- **Favorites Management:** CRUD operations to manage user favorites in the database.

## 🛠️ Technologies & Libraries Used 
- **Node.js:** Server-side JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **Dotenv:** Library for managing environment variables.
- **Bcryptjs:** Library for secure password hashing.
- **Mongoose:** MongoDB object modeling tool.
- **MongoDB Atlas:** Cloud-based database service.
- **Axios:** Promise-based HTTP client for making requests to servers.
- **Render:** Hosting service.
- **Swagger UI:** Interactive API documentation and testing tool.
- **Jest:** Unit testing framework for JavaScript and TypeScript


## 📦 See Also

- [ScreenPulse Frontend App](https://github.com/EduGese/ScreenPulse-frontApp) — Angular web client for this API.


## ⚙️ Quality Assurance & Unit Testing Workflow

[![Lint and Test Validation](https://github.com/EduGese/ScreenPulse-backend-Api/actions/workflows/lint.yml/badge.svg)](https://github.com/EduGese/ScreenPulse-backend-Api/actions)

This project implements a robust two-level code and test validation flow for maximum reliability:

### 1. Local validation with Husky

- **Pre-commit:** Runs `lint-staged` to ensure only staged files passing ESLint rules may be committed.
- **Pre-push:** Runs both full-project lint and Jest unit tests before pushing. If either fails, the push is blocked.
- This guarantees that only clean, well-tested, consistent code can reach the remote repository.

### 2. Automated Lint and Tests with GitHub Actions

- Every push or pull request to the `prod` branch triggers a workflow that runs both lint and all unit tests with Jest in a Linux environment through GitHub Actions.
- Only if all linting passes and all unit tests succeed does GitHub report a green check.
- Branch protection is enforced: only PRs that pass lint and testing are mergeable into `prod`.
- This provides a second line of defense—quality is ensured even if local hooks are skipped.

#### Example GitHub Actions Workflow
```yaml
name: Lint and Test Validation

on:
  push:
    branches: [prod]
  pull_request:
    branches: [prod]

jobs:
  lint_and_test:
    name: Lint and Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Run ESLint
        run: npm run lint
      - name: Run Jest unit tests
        run: npm test

```
### 3. Unit Test Suite

Automated unit tests verify business logic for critical modules; coverage is checked as part of the workflow.
- Unit tests are written using [Jest](https://jestjs.io/).
- Test files are located alongside your source code, following the pattern `*.spec.ts`.
- You can run all tests locally with `npm test`.
- CI and production builds will fail if any unit test does not pass, ensuring only reliable code is deployed.

## 📏 Development Conventions

- **Commits:** Conventional Commits (e.g., `feat:`, `fix:`, `chore:`) for clarity and automated versioning.
- **Testing:** Unit tests use `*.spec.ts` and are organized by module.
- **Branching & PRs:** Feature branches and Pull Requests are used for all substantial changes; all changes must pass CI checks.
- **Deployments:** Production code is only merged to `prod` after all status checks succeed.

## 🔧 Configuration 
Configuration settings—including database credentials, API keys, and CORS client URLs—are centralized in environment files (.env for development, .env.production for production). This approach ensures secure, portable, and maintainable environment management.

**Example `.env` file:**
```env
# --- Node environment mode ---
NODE_ENV=development        # 'development', 'production', or 'test'

# --- MongoDB Atlas connection ---
MONGODB_USER=yourUser           # Atlas database user
MONGODB_PASSWORD=yourPassword   # Atlas database password
MONGODB_CLUSTER=clusterId       # Atlas cluster identifier
MONGODB_COLLECTION=collectionName  # Main database name

# --- Port ---
PORT=9000                      # Express server port

# --- Client URLs for CORS (per environment) ---
CLIENT_URL_DEV=http://localhost:4200      # Local frontend for development
CLIENT_URL_PROD=https://yourdomain.com    # URL of deployed frontend (production)
CLIENT_URL_TEST=http://localhost:4200
GITHUB_CLIENT_URL=https://edugese.github.io # Static client for GitHub Pages

# --- External services (OMDB) ---
OMDB_APIKEY=your-omdb-key      # OMDB API Key
OMDB_URL=http://www.omdbapi.com/

# --- Security ---
TOKEN_SECRET=your-jwt-secret   # JWT signing key
API_KEY=your-custom-api-key    # API key for integrations or extra auth


```

## 🗄️ Database Connection: MongoDB Atlas & Local
> _See the [Configuration](#-configuration) section above for required environment variables._

This project uses [MongoDB Atlas](https://www.mongodb.com/atlas) — MongoDB's cloud database service — as the primary data store. The connection is managed via [Mongoose](https://mongoosejs.com/) and all configuration details are externalized in environment files (.env/*.env.production) for maximum flexibility and security.

### How it works

- **All database credentials and settings** are defined as environment variables (see the section "Configuration" in this README).
- The connection string is built dynamically in `src/config/config.ts`, using the user, password, cluster name, and database/collection:

```env
mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/<DB>?retryWrites=true&w=majority
```

- On startup, the app tries to connect to this MongoDB Atlas cluster using `mongoose.connect(config.mongo.url)`. On failure, errors are logged and the server does not start.

### Switching to another database (e.g., local MongoDB)

You can easily connect the app to a different MongoDB instance (such as a local install) by overriding the corresponding environment variables:

1. **Comment or remove** the Atlas-related variables in your `.env`.
2. Add:
   
```env
MONGODB_URI=mongodb://localhost:27017/your-local-db
```
3. In `src/config/config.ts`, adapt the code to prioritize this variable if defined:
```ts
// Example override logic
const MONGODB_URL = process.env.MONGODB_URI || mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/${MONGODB_COLLECTION}?retryWrites=true&w=majority;
```
So, if you define MONGODB_URI, that value will be used; otherwise, the system will use the Atlas URI.
4. **Restart your app**. The database connection will point to the local MongoDB instance.

> **Best practice:** Always use environment variables for all confidential connection data and never hardcode passwords, tokens, or URIs in source files. Document all configuration steps clearly for team collaboration and maintanability.

### Atlas vs. Local: When to use each

- **MongoDB Atlas (default):** Use for production deployments, staging, and shared environments. Advantages: backups, security, scalability.
- **Local MongoDB:** Use for initial dev or quick testing when you have MongoDB locally installed and running (`mongod`).

### Tips & Troubleshooting

- Make sure your IP is whitelisted in Atlas when connecting from a new location.
- If running locally, ensure MongoDB is started (`brew services start mongodb` en Mac, o `sudo systemctl start mongod` en Linux).
- Rotate secrets regularly and use separate users for dev and prod.

## 🧩 Modular Structure 
The project follows a modular and layered architecture to ensure scalability, maintainability, and clarity. Below is an overview of the main directories and their responsibilities:

```
app.ts
│
├── config/
│   └── config.ts
├── errors/
│   └── apiError.ts
├── interfaces/
│   ├── description.interface.ts
│   ├── favorites.interface.ts
│   ├── omdb.interface.ts
│   └── user.interface.ts
├── middlewares/
│   ├── cors.ts, cors.spec.ts
│   ├── errorHandler.ts, errorHandler.spec.ts
│   ├── swaggerAuth.ts, swaggerAuth.spec.ts
│   └── validate.ts
├── models/
│   ├── description.ts
│   ├── favorites.ts
│   └── user.ts
├── modules/
│   ├── index.ts
│   ├── favorites/
│   │   ├── favorites.controller.ts, favorites.controller.spec.ts
│   │   ├── favorites.routes.ts
│   │   ├── favorites.service.ts, favorites.service.spec.ts
│   │   └── index.ts
│   ├── omdb/
│   │   ├── omdb.controller.ts, omdb.controller.spec.ts
│   │   ├── omdb.routes.ts
│   │   ├── omdb.service.ts, omdb.service.spec.ts
│   │   └── index.ts
│   └── user/
│       ├── user.controller.ts, user.controller.spec.ts
│       ├── user.routes.ts
│       ├── user.service.ts, user.service.spec.ts
│       └── index.ts
├── scripts/
│   └── generate-swagger-json.ts
├── utils/
│   └── swagger/
│       ├── swagger.ts
│       ├── parameters/
│       │   ├── favorites.parameters.ts
│       │   └── omdb.parameters.ts
│       └── shemas/
│           ├── favorites.schema.ts
│           ├── global.schemas.ts
│           ├── omdb.schemas.ts
│           └── user.schemas.ts
└── validators/
    ├── favoritesValidator.ts
    ├── omdbValidators.ts
    └── userValidators.ts
```

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please fork the repository, make your changes, and submit a pull request. Be sure to follow the project's coding standards and guidelines.

## License
This project is licensed under the [MIT License](#).
