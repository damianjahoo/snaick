# REST API Plan

## 1. Resources

| Resource | Database Table | Description |
|----------|----------------|-------------|
| Users | `users` | User accounts managed by Supabase Auth |
| Snacks | `snacks` | Snack recommendations with nutritional information |
| Favorites | `user_favourites` | Junction table connecting users with their favorite snacks |

## 2. Endpoints

### Authentication

Authentication will be handled directly by Supabase Auth client-side, so no explicit API endpoints are needed. The Supabase client SDK will be used for:
- User registration
- User login
- Password reset
- Session management
- Logout

### Snacks

#### Generate Snack Recommendation

- **Method**: POST
- **Path**: `/api/snacks/generate`
- **Description**: Generates a personalized snack recommendation based on user preferences
- **Request Body**:
  ```json
  {
    "meals_eaten": string,
    "snack_type": "słodka" | "słona" | "lekka" | "sycąca",
    "location": "praca" | "dom" | "sklep" | "poza domem",
    "goal": "utrzymanie" | "redukcja" | "przyrost",
    "preferred_diet": "standard" | "wegetariańska" | "wegańska" | "bezglutenowa",
    "dietary_restrictions": string[],
    "caloric_limit": number | null
  }
  ```
- **Response**:
  ```json
  {
    "id": number,
    "title": string,
    "description": string,
    "ingredients": string,
    "instructions": string,
    "snack_type": string,
    "location": string,
    "goal": string,
    "preferred_diet": string,
    "kcal": number,
    "protein": number,
    "fat": number,
    "carbohydrates": number,
    "fibre": number,
    "created_at": string
  }
  ```
- **Success Code**: 200 OK
- **Error Codes**:
  - 400 Bad Request - Invalid preferences format
  - 401 Unauthorized - User not authenticated
  - 500 Internal Server Error - LLM generation error

#### Get All Snacks (Admin Only)

- **Method**: GET
- **Path**: `/api/snacks`
- **Description**: Retrieves all snacks in the database
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 20)
  - `snack_type`: string (optional)
  - `location`: string (optional)
  - `goal`: string (optional)
  - `preferred_diet`: string (optional)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": number,
        "title": string,
        "description": string,
        "kcal": number,
        "created_at": string
      }
    ],
    "meta": {
      "total": number,
      "page": number,
      "limit": number,
      "has_more": boolean
    }
  }
  ```
- **Success Code**: 200 OK
- **Error Codes**:
  - 401 Unauthorized - User not authenticated
  - 403 Forbidden - User not authorized

#### Get Snack Details

- **Method**: GET
- **Path**: `/api/snacks/{id}`
- **Description**: Retrieves detailed information about a specific snack
- **Response**:
  ```json
  {
    "id": number,
    "title": string,
    "description": string,
    "ingredients": string,
    "instructions": string,
    "snack_type": string,
    "location": string,
    "goal": string,
    "preferred_diet": string,
    "kcal": number,
    "protein": number,
    "fat": number,
    "carbohydrates": number,
    "fibre": number,
    "created_at": string
  }
  ```
- **Success Code**: 200 OK
- **Error Codes**:
  - 404 Not Found - Snack not found

### Favorites

#### Get User's Favorite Snacks

- **Method**: GET
- **Path**: `/api/favorites`
- **Description**: Retrieves all favorite snacks for the authenticated user
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 20)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": number,
        "snack_id": number,
        "title": string,
        "description": string,
        "kcal": number,
        "added_at": string
      }
    ],
    "meta": {
      "total": number,
      "page": number,
      "limit": number,
      "has_more": boolean
    }
  }
  ```
- **Success Code**: 200 OK
- **Error Codes**:
  - 401 Unauthorized - User not authenticated

#### Get Favorite Snack Details

- **Method**: GET
- **Path**: `/api/favorites/{id}`
- **Description**: Retrieves detailed information about a specific favorite snack
- **Response**:
  ```json
  {
    "id": number,
    "snack_id": number,
    "user_id": number,
    "added_at": string,
    "snack": {
      "id": number,
      "title": string,
      "description": string,
      "ingredients": string,
      "instructions": string,
      "snack_type": string,
      "location": string,
      "goal": string,
      "preferred_diet": string,
      "kcal": number,
      "protein": number,
      "fat": number,
      "carbohydrates": number,
      "fibre": number,
      "created_at": string
    }
  }
  ```
- **Success Code**: 200 OK
- **Error Codes**:
  - 401 Unauthorized - User not authenticated
  - 404 Not Found - Favorite not found

#### Add Snack to Favorites

- **Method**: POST
- **Path**: `/api/favorites`
- **Description**: Adds a snack to the user's favorites
- **Request Body**:
  ```json
  {
    "snack_id": number
  }
  ```
- **Response**:
  ```json
  {
    "id": number,
    "user_id": number,
    "snack_id": number,
    "added_at": string
  }
  ```
- **Success Code**: 201 Created
- **Error Codes**:
  - 400 Bad Request - Invalid snack ID
  - 401 Unauthorized - User not authenticated
  - 409 Conflict - Snack already in favorites

#### Remove Snack from Favorites

- **Method**: DELETE
- **Path**: `/api/favorites/{id}`
- **Description**: Removes a snack from the user's favorites
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **Success Code**: 200 OK
- **Error Codes**:
  - 401 Unauthorized - User not authenticated
  - 404 Not Found - Favorite not found

## 3. Authentication and Authorization

The application will leverage Supabase's built-in authentication and authorization features:

1. **Authentication**:
   - User registration and login will be handled by Supabase Auth
   - JWT tokens will be used for API authentication
   - The Supabase client SDK will manage tokens and sessions

2. **Authorization**:
   - Row Level Security (RLS) policies will be implemented in the database
   - User-specific data access will be restricted using RLS
   - API endpoints will check for valid authentication before processing requests

3. **Security Implementation**:
   - All API endpoints (except public ones) will verify the JWT token
   - User favorites will only be accessible to the user who created them
   - Passwords are stored as hashes, never in plain text
   - HTTPS will be used for all API communications

## 4. Validation and Business Logic

### Validation Rules

#### Snack Generation
- `snack_type` must be one of: 'słodka', 'słona', 'lekka', 'sycąca'
- `location` must be one of: 'praca', 'dom', 'sklep', 'poza domem'
- `goal` must be one of: 'utrzymanie', 'redukcja', 'przyrost'
- `preferred_diet` must be one of: 'standard', 'wegetariańska', 'wegańska', 'bezglutenowa'
- If provided, `caloric_limit` must be a positive number

#### Snack Data
- `kcal`, `protein`, `fat`, `carbohydrates`, `fibre` must be non-negative numbers
- `title` is required and cannot be empty
- All enum fields must contain valid values as defined in the database schema

#### Favorites
- `snack_id` must reference an existing snack
- A user cannot add the same snack to favorites twice

### Business Logic Implementation

1. **Snack Generation Flow**:
   - The API receives user preferences via POST request
   - It validates all input data
   - The validated data is sent to the LLM service (Openrouter.ai)
   - The LLM generates a personalized snack recommendation
   - The API stores the generated snack in the database
   - The snack data is returned to the client

2. **Favorites Management**:
   - When adding to favorites, the system checks if the snack is already in the user's favorites
   - Favorites are always associated with the authenticated user
   - Removing a favorite permanently deletes the record from the database
   - Favorites listing is paginated for better performance

3. **Rate Limiting and Performance**:
   - The API will implement rate limiting for the snack generation endpoint to prevent abuse
   - Caching will be used where appropriate to improve performance
   - Database queries will use indexes for optimal performance 