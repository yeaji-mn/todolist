# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
mvn clean package

# Run
mvn spring-boot:run

# Test
mvn test

# Compile only
mvn compile
```

The application starts on port 8080.

## Architecture

Spring Boot 3.2.3 REST API (Java 17) with a simple two-layer structure:

- **Model** (`model/Todo.java`): Domain object with `id`, `title`, and `completed` fields
- **Controller** (`controller/TodoController.java`): REST endpoints at `/api/todos`

**Endpoints:**
- `GET /api/todos` — all todos
- `GET /api/todos/{id}` — single todo by ID (throws `RuntimeException` if not found)

**Data**: In-memory only — a hardcoded list in `TodoController`. No database or persistence layer.
