
# Keycloak Authentication Service

This service integrates Spring Boot with Keycloak for OAuth2 authentication and authorization.

## Prerequisites

- Docker and Docker Compose
- Java 17+
- PostgreSQL
- Maven

## Setup Instructions

### 1. Start Keycloak

```bash
docker-compose up -d
```

Keycloak will be available at `http://localhost:8080`

### 2. Configure Keycloak Admin Console

1. Access Keycloak Admin Console: `http://localhost:8080`
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin`

### 3. Create Realm

1. Click on the dropdown at top left (says "master")
2. Click **"Create Realm"**
3. Name: `myrealm`
4. Click **"Create"**

### 4. Create Client

1. Go to **Clients** → **Create client**
2. **Client ID**: `backend`
3. Click **"Next"**
4. Enable:
   - **Client authentication**: ON
   - **Direct access grants**: ON
5. Click **"Save"**
6. Go to **Credentials** tab
7. Copy the **Client Secret** 

### 5. Create User

1. Go to **Users** → **Add user**
2. Fill in:
   - **Username**: `malika`
   - **Email**: `tajidimalika@gmail.com`
   - **First Name** : `malika`
   - **Last Name** : `tajidi`
   - **Email verified**: **ON**
   - **Enabled**: **ON**
3. Click **"Create"**

### 6. Set User Password

1. Go to **Credentials** tab
2. Click **"Set password"**
3. Enter password: `malika`
4. Set **"Temporary"** to **OFF**
5. Click **"Save"**

### 7. Assign Roles to User

1. Go to **Role mapping** tab
2. Click **"Assign role"**
3. Select roles: `admin` or `customer`
4. Click **"Assign"**

### 8. Configure Application Properties

Update `application.properties`:

```properties
spring.application.name=authentification_service
server.port=8081


# Keycloak
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/myrealm
```


## Testing

### Get Access Token

## Postman Configuration for Getting Access Token

### Method 1: Using Body (Recommended)

1. **Create New Request**
   - Method: `POST`
   - URL: `http://localhost:8080/realms/myrealm/protocol/openid-connect/token`

2. **Headers Tab**
   - Key: `Content-Type`
   - Value: `application/x-www-form-urlencoded`

3. **Body Tab**
   - Select: `x-www-form-urlencoded`
   - Add the following key-value pairs:

   | KEY | VALUE |
   |-----|-------|
   | grant_type | password |
   | client_id | backend |
   | client_secret | <secret key> |
   | username | tajidimalika@gmail.com |
   | password | malika |

4. **Click Send**

---

## Testing Protected Endpoints


### 1. Test Admin Endpoint (Token Required)

- **Method**: `GET`
- **URL**: `http://localhost:8081/admin/hello`
- **Headers**:
  - Key: `Authorization`
  - Value: `Bearer YOUR_ACCESS_TOKEN_HERE`
- **Expected Response**: `Hello ADMIN!`

### 2. Test Customer Endpoint (Token Required)

- **Method**: `GET`
- **URL**: `http://localhost:8081/customer/hello`
- **Headers**:
  - Key: `Authorization`
  - Value: `Bearer YOUR_ACCESS_TOKEN_HERE`

---

**Authorization Header:**
- Key: `Authorization`
- Value: `Bearer {{access_token}}`

This way, the token is automatically saved and reused across all your protected endpoint requests! 

## API Endpoints

| Endpoint | Access | Required Role |
|----------|--------|---------------|
| `/public/**` | Public | None |
| `/user/**` | Authenticated | Any authenticated user |
| `/admin/**` | Authenticated | `admin` role |
| `/customer/**` | Authenticated | `customer` role |

## Troubleshooting

### Error: "Account is not fully set up"

**Solution:**
1. Go to Keycloak Admin Console
2. Navigate to the user
3. **Credentials** tab: Ensure password is set and **Temporary** is **OFF**
4. **Details** tab: Ensure **Email verified** is **ON** and **Enabled** is **ON**
5. Clear any **Required user actions**
6. dont forget to add the first name and the last name of the user 

### Error: "Access Denied"

**Solution:**
- Verify the user has the required role assigned in **Role mapping** tab
- Check that roles are properly extracted in the JWT token

## Technologies Used

- Spring Boot 3.x
- Spring Security OAuth2 Resource Server
- Keycloak 25.0.0
- PostgreSQL
- Docker


note :
Assigner les Rôles dans Keycloak
Étape 1: Créer les Rôles

Ouvrez Keycloak Admin Console: http://localhost:8080
Sélectionnez votre realm: myrealm
Allez dans "Realm roles" 
Cliquez sur "Create role"
Créez ces rôles:

Role name: admin
Role name: customer



Étape 2: Assigner les Rôles à Votre Utilisateur

Allez dans "Users" 
Cherchez et cliquez sur malika
Allez dans l'onglet "Role mapping"
Cliquez sur "Assign role"
Filtrer par "Filter by realm roles"  very impo dont just search the name of role filter by realm roles first 
Cochez admin et customer
Cliquez sur "Assign"
