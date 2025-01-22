# Test task for DataLouna

## API:
### **GET** `/auth/check-auth`
### **POST** `/auth/register`
**Params:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```
### **POST** `/auth/login`
**Params:**
```json
{
    "email": "string",
    "password": "string"
}
```
### **POST** `/auth/logout`
### **POST** `/auth/change-password`
**Params:**
```json
{
    "oldPassword": "string",
    "newPassword": "string"
}
```
### **POST** `/products/purchase`
**Params:**
```json
{
    "productId": "number",
    "quantity": "number"
}
```
### **GET** `/products/`
### **GET** `/purchases/`
### **GET** `/skinport/items`

## INFRA
Create .env from .env.example. Use `npm ci`, `npm run build` and `npm run start` for building and starting project.
Use `docker-compose up` for creating redis and postgres containers.