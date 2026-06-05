-- ------------------------- info -------------------------
-- @@ver: 1_000_025
-- @@info: 基础表增加租户字段，角色表增加类型字段
-- ------------------------- info -------------------------

-- PostgreSQL 不需要 SET NAMES / FOREIGN_KEY_CHECKS

-- ----------------------------
-- Table structure for tn_tenant
-- ----------------------------
CREATE TABLE IF NOT EXISTS tn_tenant (
  id varchar(32) NOT NULL,
  code varchar(64) NOT NULL,
  name varchar(255) NOT NULL,
  short_name varchar(255) DEFAULT NULL,
  status boolean NOT NULL DEFAULT true,
  expire_time timestamp DEFAULT NULL,
  contact_name varchar(255) DEFAULT NULL,
  contact_phone varchar(32) DEFAULT NULL,
  contact_email varchar(255) DEFAULT NULL,
  sort integer NOT NULL DEFAULT 0,
  description varchar(255) DEFAULT NULL,
  crt_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crt_user varchar(32) NOT NULL,
  crt_name varchar(255) NOT NULL,
  crt_host varchar(255) DEFAULT NULL,
  upd_time timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  upd_user varchar(32) DEFAULT NULL,
  upd_name varchar(255) DEFAULT NULL,
  upd_host varchar(255) DEFAULT NULL,
  deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_tn_tenant PRIMARY KEY (id),
  CONSTRAINT uk_tn_tenant_code UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_tn_tenant_name ON tn_tenant USING btree (name);
CREATE INDEX IF NOT EXISTS idx_tn_tenant_status ON tn_tenant USING btree (status);

COMMENT ON TABLE tn_tenant IS '租户表';
COMMENT ON COLUMN tn_tenant.id IS 'ID';
COMMENT ON COLUMN tn_tenant.code IS '租户编码';
COMMENT ON COLUMN tn_tenant.name IS '租户名称';
COMMENT ON COLUMN tn_tenant.short_name IS '租户简称';
COMMENT ON COLUMN tn_tenant.status IS '状态：true-启用/false-禁用';
COMMENT ON COLUMN tn_tenant.expire_time IS '到期时间';
COMMENT ON COLUMN tn_tenant.contact_name IS '联系人';
COMMENT ON COLUMN tn_tenant.contact_phone IS '联系电话';
COMMENT ON COLUMN tn_tenant.contact_email IS '联系邮箱';
COMMENT ON COLUMN tn_tenant.sort IS '排序';
COMMENT ON COLUMN tn_tenant.description IS '描述';
COMMENT ON COLUMN tn_tenant.crt_time IS '创建时间';
COMMENT ON COLUMN tn_tenant.crt_user IS '创建用户ID';
COMMENT ON COLUMN tn_tenant.crt_name IS '创建用户';
COMMENT ON COLUMN tn_tenant.crt_host IS '创建IP';
COMMENT ON COLUMN tn_tenant.upd_time IS '更新时间';
COMMENT ON COLUMN tn_tenant.upd_user IS '更新用户ID';
COMMENT ON COLUMN tn_tenant.upd_name IS '更新用户';
COMMENT ON COLUMN tn_tenant.upd_host IS '更新IP';
COMMENT ON COLUMN tn_tenant.deleted IS '是否删除';

-- ----------------------------
-- Table structure for tn_tenant_user
-- ----------------------------
CREATE TABLE IF NOT EXISTS tn_tenant_user (
  id varchar(32) NOT NULL,
  tenant_id varchar(32) NOT NULL,
  user_id varchar(32) NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  status boolean NOT NULL DEFAULT true,
  sort integer NOT NULL DEFAULT 0,
  description varchar(255) DEFAULT NULL,
  crt_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  crt_user varchar(32) NOT NULL,
  crt_name varchar(255) NOT NULL,
  crt_host varchar(255) DEFAULT NULL,
  upd_time timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  upd_user varchar(32) DEFAULT NULL,
  upd_name varchar(255) DEFAULT NULL,
  upd_host varchar(255) DEFAULT NULL,
  deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_tn_tenant_user PRIMARY KEY (id),
  CONSTRAINT uk_tn_tenant_user UNIQUE (tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tn_tenant_user_tenant_id ON tn_tenant_user USING btree (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tn_tenant_user_user_id ON tn_tenant_user USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_tn_tenant_user_status ON tn_tenant_user USING btree (status);

COMMENT ON TABLE tn_tenant_user IS '租户用户关联表';
COMMENT ON COLUMN tn_tenant_user.id IS 'ID';
COMMENT ON COLUMN tn_tenant_user.tenant_id IS '租户ID';
COMMENT ON COLUMN tn_tenant_user.user_id IS '用户ID';
COMMENT ON COLUMN tn_tenant_user.is_admin IS '是否租户管理员：true-是/false-否';
COMMENT ON COLUMN tn_tenant_user.status IS '状态：true-启用/false-禁用';
COMMENT ON COLUMN tn_tenant_user.sort IS '排序';
COMMENT ON COLUMN tn_tenant_user.description IS '描述';
COMMENT ON COLUMN tn_tenant_user.crt_time IS '创建时间';
COMMENT ON COLUMN tn_tenant_user.crt_user IS '创建用户ID';
COMMENT ON COLUMN tn_tenant_user.crt_name IS '创建用户';
COMMENT ON COLUMN tn_tenant_user.crt_host IS '创建IP';
COMMENT ON COLUMN tn_tenant_user.upd_time IS '更新时间';
COMMENT ON COLUMN tn_tenant_user.upd_user IS '更新用户ID';
COMMENT ON COLUMN tn_tenant_user.upd_name IS '更新用户';
COMMENT ON COLUMN tn_tenant_user.upd_host IS '更新IP';
COMMENT ON COLUMN tn_tenant_user.deleted IS '是否删除';



-- 部门表增加租户ID
ALTER TABLE base_department
  ADD COLUMN IF NOT EXISTS tenant_id varchar(32) NULL;

COMMENT ON COLUMN base_department.tenant_id IS '租户ID';

-- 角色表增加类型和租户ID
ALTER TABLE base_rbac_role
  ADD COLUMN IF NOT EXISTS type integer NULL;

COMMENT ON COLUMN base_rbac_role.type IS '类型：1全局超管/2全局/3租户';

ALTER TABLE base_rbac_role
  ADD COLUMN IF NOT EXISTS tenant_id varchar(32) NULL;

COMMENT ON COLUMN base_rbac_role.tenant_id IS '租户ID';

-- 兼容历史角色数据：超管为全局超管，其余未绑定租户角色为全局角色
UPDATE base_rbac_role
SET type = CASE
  WHEN id = 1 THEN 1
  WHEN tenant_id IS NULL THEN 2
  ELSE 3
END
WHERE type IS NULL;
