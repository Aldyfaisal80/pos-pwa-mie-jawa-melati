# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-05-09T19:07:36Z |
| **Timestamp WIB** | 2026-05-10 02:07 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
