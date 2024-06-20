# API Documentation for '/users'

## Base URL

All endpoints can be accessed via the following base URLs:

```
https://express-api-aexgdrshda-et.a.run.app
```

## Endpoint

### 1. **Register User**

- **URL**

  ```
  /users/register
  ```

- **Method**

  ```
  POST
  ```

- **Request Body**

  ```
  name: [string],
  email: [string],
  password: [string],
  confirmPassword: [string],
  phone: [string],
  mitra: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully create user!",
    "registerResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "email": "xxx@gmail.com",
      "name": "Unknown",
      "phone": "+6281234567890",
      "roles": "mitra"
    }
  }
  ```

### 2. **Login User**

- **URL**

  ```
  /users/login
  ```

- **Method**

  ```
  POST
  ```

- **Request Body**

  ```
  email: [string],
  password: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully login!",
    "loginResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "email": "xxx@gmail.com",
      "name": "Unknown",
      "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
  ```

### 3. **Profile User**

- **URL**

  ```
  /users/profile/:id
  ```

- **Method**

  ```
  GET
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get user!",
    "profileResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "Unknown",
      "email": "xxx@gmail.com",
      "phone": "+6281234567890",
      "address": "Indonesia",
      "mitra": "PT Mencari Cinta Sejati",
      "roles": "mitra"
    }
  }
  ```

### 4. **Update User**

- **URL**

  ```
  /users/update/:id
  ```

- **Method**

  ```
  PUT
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Request Body**

  ```
  name: [string],
  address: [string],
  mitra: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully update user!",
    "updateResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "Unknown",
      "email": "xxx@gmail.com",
      "phone": "+6281234567890",
      "address": "Indonesia",
      "mitra": "PT Mencari Jodoh",
      "roles": "mitra"
    }
  }
  ```

### 5. **Change Password**

- **URL**

  ```
  /users/change-password/:id
  ```

- **Method**

  ```
  PUT
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Request Body**

  ```
  oldPassword: [string],
  newPassword: [string],
  confirmPassword: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully change password!"
  }
  ```

### 6. **Send Reset Password**

- **URL**

  ```
  /users/send-reset-password
  ```

- **Method**

  ```
  POST
  ```

- **Request Body**

  ```
  email: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully send reset password pin!"
  }
  ```

### 7. **Reset Password**

- **URL**

  ```
  /users/reset-password
  ```

- **Method**

  ```
  PUT
  ```

- **Request Body**

  ```
  email: [string],
  pin: [number],
  Password: [string],
  confirmPassword: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully reset password!"
  }
  ```

### 8. **Refresh Token**

- **URL**

  ```
  /users/refresh-token/:id
  ```

- **Method**

  ```
  GET
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Token refreshed!",
    "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
  ```

### 9. **Logout User**

- **URL**

  ```
  /users/logout/:id
  ```

- **Method**

  ```
  GET
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully logout!"
  }
  ```

# API Documentation for '/articles'

## Base URL

All endpoints can be accessed via the following base URLs:

```
https://express-api-aexgdrshda-et.a.run.app
```

## Endpoint

### 1. **All Article**

- **URL**

  ```
  /articles
  ```

- **Method**

  ```
  GET
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get articles!",
    "articleResults": [
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "title": "xxxx",
        "content": "xxxx xxxx xxxx xxxx",
        "author": "xx",
        "image": "https://storage.googleapis.com/trashhub.appspot.com/articles/black.png-xxxxxxxxxxxxx",
        "date": "2024-01-01"
      },
      ...
    ]
  }
  ```

### 2. **Newest Article**

- **URL**

  ```
  /articles/news/:value
  ```

- **Method**

  ```
  GET
  ```

- **URL Parameters**

  ```
  value: [integer]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get articles!",
    "articleResults": [
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "title": "xxxx",
        "content": "xxxx xxxx xxxx xxxx",
        "author": "xx",
        "image": "https://storage.googleapis.com/trashhub.appspot.com/articles/black.png-xxxxxxxxxxxxx",
        "date": "2024-01-01"
      },
      ...
    ]
  }
  ```

### 3. **Search Article**

- **URL**

  ```
  /articles/search/:title
  ```

- **Method**

  ```
  GET
  ```

- **URL Parameters**

  ```
  title: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get articles!",
    "articleResults": [
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "title": "xxxx",
        "content": "xxxx xxxx xxxx xxxx",
        "author": "xx",
        "image": "https://storage.googleapis.com/trashhub.appspot.com/articles/black.png-xxxxxxxxxxxxx",
        "date": "2024-01-01"
      },
      ...
    ]
  }
  ```

### 4. **Detail Article**

- **URL**

  ```
  /articles/detail/:id
  ```

- **Method**

  ```
  GET
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get article!",
    "articleResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "title": "xxxx",
      "content": "xxxx xxxx xxxx xxxx",
      "author": "xx",
      "image": "https://storage.googleapis.com/trashhub.appspot.com/articles/black.png-xxxxxxxxxxxxx",
      "date": "2024-01-01"
    }
  }
  ```

# API Documentation for '/pickup'

## Base URL

All endpoints can be accessed via the following base URLs:

```
https://express-api-aexgdrshda-et.a.run.app
```

## Endpoint

### 1. **Create Pickup**

- **URL**

  ```
  /pickup/create
  ```

- **Method**

  ```
  POST
  ```

- **Headers**

  ```
  Content-Type: multipart/form-data
  Authorization: Bearer <token>
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get articles!",
    "articleResults": [
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "title": "xxxx",
        "content": "xxxx xxxx xxxx xxxx",
        "author": "xx",
        "image": "https://storage.googleapis.com/trashhub.appspot.com/articles/black.png-xxxxxxxxxxxxx",
        "date": "2024-01-01"
      },
      ...
    ]
  }
  ```

### 2. **All Pickup**

- **URL**

  ```
  /pickup
  ```

- **Method**

  ```
  GET
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get pickup!",
    "pickupResult": [
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "photo": "https://storage.googleapis.com/trashhub.appspot.com/pickups/black.png-xxxxxxxxxxxxx",
        "weight": "10 Kg",
        "lat": "1",
        "lon": "1",
        "description": "Sampah Organik",
        "pickup_date": "",
        "pickup_time": "",
        "status": "pending",
        "notifUser": "unread",
        "notifMitra": "unread",
        "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "mitraId": ""
      },
      ...
    ]
  }
  ```

### 3. **Detail Pickup**

- **URL**

  ```
  /pickup/detail/:id
  ```

- **Method**

  ```
  GET
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get pickup!",
    "pickupResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "photo": "https://storage.googleapis.com/trashhub.appspot.com/pickups/black.png-xxxxxxxxxxxxx",
      "weight": "10 Kg",
      "lat": "1",
      "lon": "1",
      "description": "Sampah Organik",
      "pickup_date": "2024-06-13",
      "pickup_time": "10:00:00",
      "status": "accepted",
      "notifUser": "read",
      "notifMitra": "read",
      "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "mitraId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  }
  ```

### 4. **Accept Pickup**

- **URL**

  ```
  /pickup/accept/:id
  ```

- **Method**

  ```
  PUT
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Request Body**

  ```
  pickup_date: [date],
  pickup_time: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully accept pickup!"
  }
  ```

### 5. **Reject Pickup**

- **URL**

  ```
  /pickup/reject/:id
  ```

- **Method**

  ```
  PUT
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully reject pickup!"
  }
  ```

### 6. **Delete Pickup**

- **URL**

  ```
  /pickup/delete/:id
  ```

- **Method**

  ```
  DELETE
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully delete pickup!"
  }
  ```

# API Documentation for '/predict'

## Base URL

All endpoints can be accessed via the following base URLs:

```
https://express-api-aexgdrshda-et.a.run.app
```

## Endpoint

### 1. **Create Predict**

- **URL**

  ```
  /predict/create
  ```

- **Method**

  ```
  POST
  ```

- **Headers**

  ```
  Content-Type: multipart/form-data
  Authorization: Bearer <token>
  ```

- **Request Body**

  ```
  image: [file]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Model is predicted successfully",
    "predictionResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "result": "battery",
      "suggestion": "Please dispose of battery in the regular trash bin.",
      "explanation": "battery is not recyclable.",
      "recyclePercentage": 0,
      "imageUrl": "https://storage.googleapis.com/trashhub.appspot.com/predictions/image.jpg-xxxxxxxxxxxxx",
      "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "createdAt": "2024-06-15 12:49:49"
    }
  }
  ```

### 2. **All Predict**

- **URL**

  ```
  /predict
  ```

- **Method**

  ```
  GET
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get predictions!",
    "predictionResults": [
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "result": "trash",
        "suggestion": "Please dispose of trash in the regular trash bin.",
        "explanation": "trash is not recyclable.",
        "recyclePercentage": 0,
        "imageUrl": "https://storage.googleapis.com/trashhub.appspot.com/predictions/image.jpg-xxxxxxxxxxxxx",
        "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "createdAt": "2024-06-15 13:19:19"
      },
      ...
    ]
  }
  ```

### 3. **Detail Predict**

- **URL**

  ```
  /predict/detail/:id
  ```

- **Method**

  ```
  GET
  ```

- **Headers**

  ```
  Authorization: Bearer <token>
  ```

- **URL Parameters**

  ```
  id: [string]
  ```

- **Response**
  ```json
  {
    "error": false,
    "message": "Successfully get prediction",
    "predictionResult": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "result": "battery",
      "suggestion": "Please dispose of battery in the regular trash bin.",
      "explanation": "battery is not recyclable.",
      "recyclePercentage": 0,
      "imageUrl": "https://storage.googleapis.com/trashhub.appspot.com/predictions/battery7.jpg-xxxxxxxxxxxxx",
      "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "createdAt": "2024-06-15 12:49:49"
    }
  }
  ```

---

Dengan dokumentasi di atas, pengguna dapat memahami bagaimana cara menggunakan API saya, termasuk endpoint yang tersedia, Method yang digunakan, serta format respons yang dihasilkan.
