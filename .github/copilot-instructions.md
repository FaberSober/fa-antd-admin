# FA-Admin Codebase AI Coding Agent Instructions

## Project Overview

**fa-admin** is a Spring Boot 3.3.3 monolithic full-stack application with Maven multi-module structure:
- **Backend**: Java 17, Spring Boot 3.3.3, MyBatis-Plus 3.5.12, MySQL/Redis
- **Frontend**: React 18 + Ant Design 5.x + Vite 3 (pnpm monorepo)
- **Key Domains**: User/RBAC, File Storage, Workflow (FlowLong), Instant Messaging, Demo features

## Architecture & Module Layout

```
fa-admin-web (root pom)
├─ fa-core          # Core framework: BaseController, BaseBiz, annotations, config
├─ fa-base          # RBAC, Users, System, Admin features  
├─ fa-admin         # Main app: integrates all modules + frontend
├─ fa-admin-server  # Spring Boot Admin monitoring service
├─ fa-demo          # Demo/testing features
├─ fa-disk          # File management (network storage)
├─ fa-app           # Application management
├─ fa-media         # Media handling
├─ fa-flow          # Workflow engine (FlowLong BPM integration)
└─ fa-im            # Instant messaging
```

## Critical Architectural Patterns

### 1. Controller-Biz-Mapper Three-Layer Pattern
All business logic follows a strict layered approach:

- **Controllers** (`rest/` packages): Extend `BaseController<Biz, Entity, Key>` or custom handlers
  - Inherit CRUD endpoints automatically: `/save`, `/getById/{id}`, `/page`, `/update`, `/remove`, etc.
  - Use `@FaLogBiz("domain name")` for request logging
  - Use `@FaLogOpr("operation")` for operation tracking
  - Return `Ret<T>` (single object) or `TableRet<T>` (paginated)

- **Business Services** (`biz/` packages): Extend `BaseBiz<Mapper, Entity>` 
  - Leverage MyBatis-Plus for CRUD operations
  - Override `afterChange()`, `saveBefore()` for data synchronization
  - Query building via `baseBiz.parseQuery(QueryParams)` + `WrapperUtils`

- **Mappers** (MyBatis-Plus): Auto-generated via `FaBaseMapper<T>`
  - Annotated with `@Mapper` 
  - No manual SQL needed for standard CRUD

**Reference**: [BaseController.java](fa-core/src/main/java/com/faber/core/web/rest/BaseController.java), [BaseBiz.java](fa-core/src/main/java/com/faber/core/web/biz/BaseBiz.java)

### 2. Response Format Standardization
Always wrap responses:
```java
// Success
return ok(data);  // → Ret<T> with code=0
return ok();      // → Ret<Boolean> true
return okMsg("message");

// Error  
throw new BuzzException("error message");  // Caught globally
```

### 3. Validation Groups (Vg)
Use validation groups for CRUD operations:
```java
@Validated(value = Vg.Crud.C.class) @RequestBody Entity entity  // Create
@Validated(value = Vg.Crud.U.class) @RequestBody Entity entity  // Update
```

### 4. Query Parameter Handling
Dynamic filtering via `QueryParams`:
```java
@RequestBody QueryParams query  // Includes: conditions, sorting, pagination
baseBiz.selectPageByQuery(query)  // Built-in pagination support
```

## Build & Deployment Commands

### Development
```bash
# Backend only (skips frontend build)
mvn clean package -Dmaven.test.skip=true -pl fa-admin

# Full stack (compiles frontend, packages jar)
mvn clean package -Dmaven.test.skip=true

# Run tests
mvn test
```

### Startup
```bash
# Run locally
java -jar fa-admin/target/fa-admin.jar

# Main entry: com.faber.AdminBootstrap
# Auto-initializes database, runs @EnableScheduling jobs
# Listens on http://127.0.0.1:8080 (default)
```

### Frontend (Separate Dev)
```bash
cd frontend
pnpm i  # Install (pnpm@9.15.4 required)
pnpm dev  # Start dev server with hot reload
```

## Module Dependency Map

- **fa-admin** → depends on fa-base, fa-demo, fa-app, fa-disk, fa-media (see pom.xml modules)
- **fa-base** → depends on fa-core (core utilities)
- **fa-flow** → depends on fa-base + FlowLong BPM engine (Aizuda)
- **fa-im** → depends on fa-base (messaging)
- All modules inherit parent POM configuration from root `pom.xml`

## Key Annotations & Conventions

| Annotation | Purpose | Location |
|-----------|---------|----------|
| `@FaLogBiz("name")` | Business module logging label | Controller class |
| `@FaLogOpr("action")` | Operation tracking + CRUD enum | Controller method |
| `@TableId` | MyBatis-Plus primary key | Entity field |
| `@ApiToken` | JWT/Token-based API auth | Controller method |
| `@IgnoreUserToken` | Bypass token validation | Controller method |
| `@Permission("perm")` | Role-based access control | Controller method |

## Common Development Tasks

### Adding a New Entity
1. Create entity in `module/src/main/java/com/faber/api/{module}/entity/`
2. Extend from base entity if needed (timestamps, soft-delete)
3. Annotate with `@TableId`, `@TableName`, validation groups
4. Generate Mapper extending `FaBaseMapper<Entity>`
5. Create `Biz extends BaseBiz<Mapper, Entity>` with business logic
6. Create `Controller extends BaseController<Biz, Entity, PrimaryKeyType>`
7. Add `@FaLogBiz` and `@FaLogOpr` annotations

### Adding Custom Query Endpoints
```java
@FaLogOpr("custom operation name")
@RequestMapping(value = "/customEndpoint", method = RequestMethod.POST)
@ResponseBody
public TableRet<Entity> customQuery(@RequestBody QueryParams query) {
    return baseBiz.selectPageByQuery(query);
}
```

### Workflow Integration (fa-flow)
- Extends FlowLong (Aizuda BPM) workflow engine
- Custom task access strategy: [FaTaskAccessStrategy](fa-flow/src/main/java/com/faber/api/flow/manage/config/FaTaskAccessStrategy.java)
- Validates task actors by user→role→department mapping

## Database & ORM

- **MyBatis-Plus**: Automatic CRUD mapper generation
- **Soft Delete**: Managed via `BaseBiz.remove()` (logical delete)
- **Logical Delete Field**: Typically `del_flag` or `is_deleted`
- **Query Builder**: Use `WrapperUtils` to construct `QueryWrapper` from `QueryParams`

## External Dependencies to Understand

| Dependency | Version | Use Case |
|------------|---------|----------|
| MyBatis-Plus | 3.5.12 | ORM, automatic mapper generation |
| Sa-Token | 1.38.0 | Authentication/authorization |
| EasyExcel | - | Excel import/export |
| Hutool | - | Utility functions (encryption, collections, etc.) |
| Redisson | - | Redis cache abstraction |
| Forest | - | Declarative HTTP client |
| FlowLong | 1.0.0-SNAPSHOT | Workflow/BPM engine |

## Testing & Validation

- Tests reside in `{module}/src/test/` alongside source
- Use `@SpringBootTest(classes = {FaTestApp.class})` for integration tests
- Standard JUnit 5 + Spring Test framework
- Skip tests during build with `-Dmaven.test.skip=true`

## Important Files for Reference

- [pom.xml](pom.xml) - Root dependency management, module definitions
- [AdminBootstrap.java](fa-admin/src/main/java/com/faber/AdminBootstrap.java) - App entry, scheduler, configs
- [BaseController](fa-core/src/main/java/com/faber/core/web/rest/BaseController.java) - CRUD endpoint templates
- [BaseBiz](fa-core/src/main/java/com/faber/core/web/biz/BaseBiz.java) - Business logic base class
- [README.md](README.md) - Setup, deployment, tech stack overview

## Common Pitfalls to Avoid

1. **Don't bypass BaseController**: Most controllers should extend it for CRUD consistency
2. **Don't hardcode credentials**: Use environment config via `application.properties`
3. **Don't skip validation**: Always use `@Validated` with validation groups on DTOs
4. **Don't forget @FaLogOpr**: Missing logging annotations break audit trails
5. **Don't manipulate mappers directly**: Use Biz layer methods for consistency
6. **Frontend build in pom**: The fa-admin pom.xml includes frontend-maven-plugin; it handles React build automatically
