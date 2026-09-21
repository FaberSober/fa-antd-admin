# fa-doc SQL Dialect Organization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Organize the fa-doc database scripts into the database-specific directories used by the automatic database initializer, with equivalent MySQL and PostgreSQL version chains.

**Status:** 🔍验证中

**Architecture:** Keep the existing `1.0.0` initialization and `1.0.1` menu version numbers. Put MySQL scripts under `sql/fa-doc/mysql`, create PostgreSQL counterparts under `sql/fa-doc/postgre`, and remove the obsolete dialect-neutral root scripts so one database cannot execute the other database's syntax.

**Tech Stack:** MySQL 5.7-compatible DDL, PostgreSQL 18-compatible DDL, Spring Boot resource scanning, Maven.

---

### Task 1: Inspect the existing fa-doc schema and loader contract

**Files:**
- Inspect: `fa-doc/src/main/resources/sql/fa-doc/1.0.0_fa_doc_ddl.sql`
- Inspect: `fa-doc/src/main/resources/sql/fa-doc/1.0.1_fa_doc_ddl.sql`
- Inspect: `fa-base/src/main/java/com/faber/api/base/admin/biz/SystemUpdateLogBiz.java`

**Step 1:** Confirm the loader scans `sql/fa-doc/{mysql|postgre}/*.sql` and validates version headers against filenames.

**Step 2:** Map the six entity tables and the two menu-version changes so both dialects preserve the current object and version semantics.

### Task 2: Create dialect-specific version scripts

**Files:**
- Create: `fa-doc/src/main/resources/sql/fa-doc/mysql/1.0.0_fa_doc_ddl.sql`
- Create: `fa-doc/src/main/resources/sql/fa-doc/mysql/1.0.1_fa_doc_menu.sql`
- Create: `fa-doc/src/main/resources/sql/fa-doc/postgre/1.0.0_fa_doc_ddl.sql`
- Create: `fa-doc/src/main/resources/sql/fa-doc/postgre/1.0.1_fa_doc_menu.sql`

**Step 1:** Keep the shared `@@ver` and `@@info` headers in every file.

**Step 2:** Use MySQL identifiers/types/boolean values only in the MySQL files and PostgreSQL identifiers/types/boolean values/`ON CONFLICT` behavior only in the PostgreSQL files.

**Step 3:** Use the repository's audit-column conventions: no MySQL `ON UPDATE` clauses and no PostgreSQL triggers; rely on MyBatis-Plus field filling.

### Task 3: Remove obsolete root scripts and validate

**Files:**
- Delete: `fa-doc/src/main/resources/sql/fa-doc/1.0.0_fa_doc_ddl.sql`
- Delete: `fa-doc/src/main/resources/sql/fa-doc/1.0.1_fa_doc_ddl.sql`

**Step 1:** Check that only `mysql` and `postgre` SQL directories remain and both contain matching version numbers.

**Step 2:** Run static dialect/header checks and `mvn -pl fa-doc -am -DskipTests -DskipITs test-compile`.
