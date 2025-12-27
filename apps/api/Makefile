.PHONY: check-env build up down logs rebuild clean status shell test

check-env:
	@if [ ! -f .env ]; then \
		echo "❌ Error: .env file not found!"; \
		cp .env.example .env; \
		echo "✅ Created .env file. Please update it."; \
		exit 1; \
	fi
	@echo "✅ .env file exists"

gen-secrets:
	@echo "🔐 JWT_SECRET=$$(openssl rand -base64 32)"

build: check-env
	cd ../.. && docker build -f apps/api/Dockerfile -t mbti-api:latest .

up: check-env
	docker compose up -d
	@echo "✅ Services started!"

down:
	docker compose down

logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

rebuild:
	docker compose down
	docker rmi mbti-api:latest 2>/dev/null || true
	$(MAKE) build
	docker compose up -d --force-recreate

clean:
	docker compose down -v
	docker rmi mbti-api:latest 2>/dev/null || true
	docker system prune -f

status:
	docker compose ps

shell:
	docker compose exec api sh

test:
	@curl -f http://localhost/api/health && echo "\n✅ OK" || echo "\n❌ FAIL"