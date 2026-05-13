-- ==============================================================================
-- PHASE 4D: Admin Infrastructure (Providers & Audit Logs)
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Provider Configurations (AI Settings)
CREATE TABLE IF NOT EXISTS provider_configs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider     TEXT NOT NULL UNIQUE, -- 'gemini', 'openai', 'anthropic', etc.
  api_key      TEXT, -- Encrypted or stored as secret
  model_name   TEXT NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT false,
  settings     JSONB DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default Gemini config
INSERT INTO provider_configs (provider, model_name, is_active)
VALUES ('gemini', 'gemini-1.5-flash', true)
ON CONFLICT (provider) DO NOTHING;

-- 2. Audit Logs (Tracking admin actions)
CREATE TABLE IF NOT EXISTS audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action       TEXT NOT NULL, -- 'CREATE_USER', 'DELETE_MCQ', etc.
  entity_type  TEXT NOT NULL, -- 'user', 'mcq', 'subject', etc.
  entity_id    TEXT,
  details      JSONB DEFAULT '{}',
  ip_address   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
