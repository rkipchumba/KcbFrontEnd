# KCB Task Frontend - Rodgers Kipchumba

## Overview
This is a React + TypeScript front-end application for the  User Management Service.  
It connects to a mock REST API (`https://69147c603746c71fe0487070.mockapi.io/api/users`) for CRUD operations.

## Features
- JWT-based  authentication
- Create, Read, Update, Delete users
- Search users by username
- Responsive design

## Setup / Run Locally
1. Clone the repo:
```bash
git https://github.com/rkipchumba/rodgers-kipchumba-app
cd rodgers-kipchumba-app
```

## Install dependencies:
- `npm install`

## Run development server:
- `npm run dev`


## Endpoints:
- GET `/users → List all users`

- POST `/users → Create new user`

- PUT `/users/:id → Update a user`

- DELETE `/users/:id → Delete a user`


## Authentication:

- This app simulates JWT authentication.

- On login, the app stores a token in localStorage using the key jwt_token.

- User info is also stored in localStorage under user_info.