# ScreenPulse REST API 🚀

This backend application, built with Node.js and Express, serves as the REST API for the ScreenPulse-frontApp https://github.com/EduGese/ScreenPulse-frontApp. It utilizes TypeScript to ensure strong and robust typing, ensuring code reliability and maintainability.

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

## Features ✨
- **Authentication:** User registration and login for authentication and authorization.
- **Data Protection and Security:** Ensures secure password hashing and authentication.
- **OMDB API Integration:** Retrieve movie, series, and video game information from the OMDB API.
- **Favorites Management:** CRUD operations to manage user favorites in the database.

## Technologies & Libraries Used 🛠️
- **Node.js:** Server-side JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **Dotenv:** Library for managing environment variables.
- **Bcryptjs:** Library for secure password hashing.
- **Mongoose:** MongoDB object modeling tool.
- **MongoDB Atlas:** Cloud-based database service.
- **Axios:** Promise-based HTTP client for making requests to servers.
- **Render:** Hosting service.

## API documentaion

### User EndPoints

#### Login
Authenticates a user.

```http
    POST /api/user/login

```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User email |
| `password` | `string` | **Required**. User password |

#### Register
Registers a new user.
```http
    POST /api/user/register
```

| Field | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userName`      | `string` | **Required**. Username |
| `email` | `string` | **Required**. User email |
| `password` | `string` | **Required**. User password |


### OMDB EndPoints
#### Get All Movies from OMDB API
Retrieves all movies from the OMDB API.

```http
      POST /api/omdb

```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `s` | `string` | **Required**. Search term |
| `type` | `string` | Type of media (movie, series, episode) |
| `y` | `string` | Type of media (movie, series, episode) |


#### Get Movie info
Retrieves detailed information about a specific movie from the OMDB API.

```http
        GET /api/omdb/:id

```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. OMDB ID of the movie|



### Favorites EndPoints
#### Create Favorite
Creates a new favorite.

```http
        POST /api/favorites/:id

```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. User ID |


#### Get All Favorites
Retrieves all favorites of a user.

```http
          GET /api/favorites/:id

```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. User ID |

#### Delete Favorite
Deletes a favorite by ID.

```http
            DELETE /api/favorites/:id/:userId

```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Required. ID of the favorite |
| `userId` | `string` | **Required**. User ID |

#### Update Favorite
Updates a favorite's description.

```http
              PUT /api/favorites/:id/:userId

```

| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Required. ID of the favorite |
| `userId` | `string` | **Required**. User ID |
| `description` | `string` | **Required**. New description for the favorite |

## Configuration 🔧
Configuration settings, including database URLs and CORS client URLs, are centralized in a `.env` file. This approach simplifies the management of environment variables and enhances the modularity of the codebase.

## Modular Structure 🧩
The application is structured into separate modules for core functionalities, such as users, API integration, and favorites management. Each module consists of independent controllers, routes, and services, promoting clear separation of concerns and efficient code organization.

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please fork the repository, make your changes, and submit a pull request. Be sure to follow the project's coding standards and guidelines.

## License
This project is licensed under the [MIT License](#).
