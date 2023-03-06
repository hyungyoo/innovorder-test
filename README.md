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
API_VERSION=

## jwt
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRATION_TIME=
JWT_REFRESH_EXPIRATION_TIME=

## redis
REDIS_HOST=
REDIS_PORT=
```

## Redis

1. 보안을 위한 access token들의 black list
   - set 이용
   - AccessTokenStrategy에서 validator에서 확인?
        - 미들웨어에서할수있는데 넘어와야한다.
        - jwt-access에서만 확인가능해서 좋음 
   - 또는 미들웨어에서확인
        - 제일앞에서 확인가능함
        - 분기가 너무많음
2. look aside cache - food API (파레토의 법칙)
   - key value 이용

데이터하나에 두개의 인스턴스를 사용
