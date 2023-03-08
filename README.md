# user-backend-api

</br>

## Env file 설정 : .env.dev

```env
## postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_PASSWORD=postgres
POSTGRES_USERNAME=postgres
POSTGRES_DB=user

## backend (not required)
APP_PORT=8080
BACKEND_PORT=3000

## api version
API_VERSION=1.0

## jwt
JWT_ACCESS_SECRET=jwtaccesskey
JWT_REFRESH_SECRET=jwtrefreshkey
JWT_ACCESS_EXPIRATION_TIME=10m
JWT_REFRESH_EXPIRATION_TIME=1d

## redis
REDIS_HOST=redis
REDIS_PORT=6379
## (not required)
CACHE_TTL=600

## http Module (not required)
HTTP_TIMEOUT=5000
HTTP_MAX_REDIRECTS=5

## open food api
FOOD_API_URL=https://world.openfoodfacts.org/api/v0/product/
FOOD_API_EXTENSION=json
```

---

</br>
</br>

## Docker

- docker compose

</br>
</br>

---

## Makefile

- make
  ```
  docker-compose --env-file [file_path] up --build
  ```

---

##

</br>
</br>

## API swagger

```
localhost:[PORT]/api
```

---

</br>
</br>

## Redis

### 1. 두개의 인스턴스를 이용

- 하나의 인스턴스, 두개의 데이터베이스는 효율이 떨어짐

### 2. 자료구조

- 보안을 위한 access token들의 black list
  - key value 자료구조
- look aside cache - food API (파레토의 법칙)
  - hash 자료구조

---
