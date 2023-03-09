# user-backend-api

</br>

## Configuration file setup :

</br>

#### File name

```
innovorder-test/.env.dev
```

</br>

#### Configuration example

```env
## postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_PASSWORD=postgres
POSTGRES_USERNAME=postgres
POSTGRES_DB=innovorder

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

## Start

</br>

### Command

```
$> make
```

</br>

### Result

```
$> docker-compose --env-file .env.dev up --build
$> Creating network "innovorder-test_innovorder_network" with driver "bridge"
$> Creating volume "innovorder-test_postgres_db" with default driver
$> Pulling postgres (postgres:)...
$> latest: Pulling from library/postgres
$> 3f9582a2cbe7: Already exists
$> 0d9d08fc1a1a: Pull complete
$> ecae4ccb4d1b: Pull complete
...
...
...
$> backend     | [Nest] 38  - 03/09/2023, 3:33:49 PM     LOG [RoutesResolver] FoodController {/api/v1.0/food}: +0ms
$> backend     | [Nest] 38  - 03/09/2023, 3:33:49 PM     LOG [RouterExplorer] Mapped {/api/v1.0/food/:barcode, GET} route +1ms
$> backend     | [Nest] 38  - 03/09/2023, 3:33:49 PM     LOG [NestApplication] Nest application successfully started +8ms
$> backend     | [Nest] 38  - 03/09/2023, 3:33:49 PM VERBOSE [ServerListening] Api Server : [http://localhost:8080]
```

---

##

</br>
</br>

## Swagger

</br>

### Swagger url

```
localhost:[PORT]/api
```

---

</br>
</br>

## Unit test

</br>

### Command

```
$> dokcer exec -it backend bash
root@.../app# npm run test:cov
```

### or

```
$> docker exec -it backend sh -c "npm run test:cov"
```

</br>

### Result

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |
 auth              |     100 |      100 |     100 |     100 |
  auth.service.ts  |     100 |      100 |     100 |     100 |
 food              |     100 |      100 |     100 |     100 |
  food.service.ts  |     100 |      100 |     100 |     100 |
 redis             |     100 |      100 |     100 |     100 |
  redis.service.ts |     100 |      100 |     100 |     100 |
 users             |     100 |      100 |     100 |     100 |
  users.service.ts |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
```

---

</br>
</br>

## e2e test

### Command

```
$> dokcer exec -it backend bash
root@.../app# npm run test:e2e
```

### or

```
$> docker exec -it backend sh -c "npm run test:e2e"
```

### Result
