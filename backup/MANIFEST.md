# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-04-21T01:28:23Z |
| **Timestamp WIB** | 2026-04-21 08:28 WIB |
| **Trigger** | workflow_dispatch |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
