# user-backend-api

## For env file : .env.dev

```env
## postgres
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_PASSWORD=
POSTGRES_USERNAME=
POSTGRES_DB=

## backend
APP_PORT=
BACKEND_PORT=

## jwt
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRATION_TIME=
JWT_REFRESH_EXPIRATION_TIME=
```

## Redis

1. 보안을 위한 access token들의 black list
2. look aside cache - food API (파레토의 법칙)
