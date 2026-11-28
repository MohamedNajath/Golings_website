-- Internship & Training system: applications, internal notes, admin users.
CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS internship_applications (
  id                    BIGSERIAL PRIMARY KEY,
  reference             TEXT UNIQUE,
  -- A. personal
  full_name             TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL,
  whatsapp              TEXT NOT NULL,
  country               TEXT NOT NULL,
  city                  TEXT NOT NULL,
  -- B. education
  qualification         TEXT NOT NULL CHECK (qualification IN ('degree','higher_diploma','diploma','other')),
  institution           TEXT NOT NULL,
  field_of_study        TEXT NOT NULL,
  academic_status       TEXT NOT NULL CHECK (academic_status IN ('final_year_student','recently_graduated','degree_completed','diploma_completed','other')),
  -- C. program
  program               TEXT NOT NULL CHECK (program IN ('software-engineering','web-development','qa-engineering','ui-ux-design','digital-marketing')),
  training_mode         TEXT NOT NULL CHECK (training_mode IN ('online','hybrid','on-site')),
  preferred_start_date  DATE,
  previous_experience   TEXT,
  technical_skills      TEXT,
  programming_knowledge TEXT,
  additional_info       TEXT,
  -- D. professional
  linkedin_url          TEXT,
  github_url            TEXT,
  portfolio_url         TEXT,
  cv_path               TEXT NOT NULL,
  cv_original_name      TEXT NOT NULL,
  cv_size_bytes         INTEGER NOT NULL,
  -- E. questions + consent
  motivation            TEXT NOT NULL,
  consent_privacy       BOOLEAN NOT NULL,
  consent_terms         BOOLEAN NOT NULL,
  consent_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- admin workflow
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','shortlisted','interview_scheduled','accepted','rejected')),
  interview_at          TIMESTAMPTZ,
  evaluation_feedback   TEXT,
  status_updated_at     TIMESTAMPTZ,
  status_updated_by     TEXT,
  -- meta
  ack_email_status      TEXT NOT NULL DEFAULT 'pending',
  admin_email_status    TEXT NOT NULL DEFAULT 'pending',
  ip_hash               TEXT,
  user_agent            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_int_app_status  ON internship_applications (status);
CREATE INDEX IF NOT EXISTS idx_int_app_program ON internship_applications (program);
CREATE INDEX IF NOT EXISTS idx_int_app_created ON internship_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_int_app_email   ON internship_applications (lower(email));

CREATE TABLE IF NOT EXISTS internship_notes (
  id             BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  author_email   TEXT NOT NULL,
  note           TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_int_notes_app ON internship_notes (application_id, created_at);
