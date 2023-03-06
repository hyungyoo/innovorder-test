ENV_FILE=--env-file .env.dev

.PHONY: dev
dev :
	docker-compose ${ENV_FILE} up --build

.PHONY: fclean
fclean :
	docker-compose ${ENV_FILE} down
	docker container prune --force 
	docker image prune --force --all
	docker network prune --force 
	docker volume prune --force 

.PHONY: re
re : fclean dev

.PHONY: frontend
frontend :
	docker restart frontend

.PHONY: backend
backend :
	docker restart backend

.PHONY: nginx
nginx : 
	docker restart nginx

.PHONY: down
down :
	docker-compose down

.PHONY: sclean
sclean: 
	docker system prune -a -f

.PHONY: backend-dev
backend-dev :
	cd backend && npm run start:dev

.PHONY: backend-test-cov
backend-test-cov :
	cd backend && npm run test:cov

.PHONY: backend-test-e2e
backend-test-e2e :
	cd backend && npm run test:e2e