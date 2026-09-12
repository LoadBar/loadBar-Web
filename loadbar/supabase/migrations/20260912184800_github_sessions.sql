-- Persistent server-side GitHub sessions. The browser cookie stores only github_sessions.id.

create table github_sessions (
  id text primary key,
  csrf_state text,
  github_access_token text,
  github_access_token_expires_at timestamptz,
  github_refresh_token text,
  github_refresh_token_expires_at timestamptz,
  github_installation_id text,
  github_user_id bigint,
  github_login text,
  github_name text,
  github_avatar_url text,
  github_html_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index github_sessions_expires_at_idx on github_sessions (expires_at);

alter table github_sessions enable row level security;
