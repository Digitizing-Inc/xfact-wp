# ===========================================
# WordPress Template — Makefile
# ===========================================
# Usage: make <target>
# Run `make help` to see all available commands.

.DEFAULT_GOAL := help
COMPOSE := docker compose
WP_CONTAINER := wordpress

# -------------------------------------------
# Docker
# -------------------------------------------

.PHONY: up
up: ## Start all containers (detached)
	$(COMPOSE) up -d --build

.PHONY: down
down: ## Stop all containers
	$(COMPOSE) down

.PHONY: restart
restart: ## Restart all containers
	$(COMPOSE) restart

.PHONY: logs
logs: ## Follow container logs
	$(COMPOSE) logs -f

.PHONY: logs-wp
logs-wp: ## Follow WordPress container logs only
	$(COMPOSE) logs -f $(WP_CONTAINER)

.PHONY: ps
ps: ## Show running containers
	$(COMPOSE) ps

.PHONY: clean
clean: ## Stop containers and remove volumes (⚠️ destroys data)
	$(COMPOSE) down -v --remove-orphans

.PHONY: rebuild
rebuild: ## Force rebuild images and recreate containers
	$(COMPOSE) up -d --build --force-recreate

# -------------------------------------------
# WordPress
# -------------------------------------------

.PHONY: shell
shell: ## Open a bash shell in the WordPress container
	$(COMPOSE) exec $(WP_CONTAINER) bash

.PHONY: wp
wp: ## Run WP-CLI command (usage: make wp CMD="plugin list")
	$(COMPOSE) exec $(WP_CONTAINER) wp $(CMD)

.PHONY: setup
setup: ## Run the WordPress setup script (via WP-CLI sidecar)
	$(COMPOSE) run --rm wp-setup

# -------------------------------------------
# Database
# -------------------------------------------

.PHONY: db-export
db-export: ## Export database to ./backup.sql
	$(COMPOSE) exec $(WP_CONTAINER) wp db export /tmp/backup.sql
	$(COMPOSE) cp $(WP_CONTAINER):/tmp/backup.sql ./backup.sql
	@echo "✅ Database exported to ./backup.sql"

.PHONY: db-import
db-import: ## Import database from ./backup.sql
	$(COMPOSE) cp ./backup.sql $(WP_CONTAINER):/tmp/backup.sql
	$(COMPOSE) exec $(WP_CONTAINER) wp db import /tmp/backup.sql
	@echo "✅ Database imported from ./backup.sql"

# -------------------------------------------
# Code Quality
# -------------------------------------------

.PHONY: lint
lint: ## Run all linters (PHPStan + PHPCS)
	composer lint

.PHONY: phpstan
phpstan: ## Run PHPStan static analysis
	composer phpstan

.PHONY: phpcs
phpcs: ## Run PHPCS coding standards check
	composer phpcs

.PHONY: phpcbf
phpcbf: ## Auto-fix PHPCS violations
	composer phpcbf

# -------------------------------------------
# Git Hooks
# -------------------------------------------

.PHONY: hooks
hooks: ## Install lefthook git hooks
	lefthook install

# -------------------------------------------
# Testing
# -------------------------------------------

.PHONY: playground
playground: ## Start WordPress Playground with blueprint
	npx @wp-playground/cli@latest server --blueprint=./blueprint.json --blueprint-may-read-adjacent-files

# -------------------------------------------
# Help
# -------------------------------------------

.PHONY: help
help: ## Show this help message
	@echo "Usage: make <target>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
