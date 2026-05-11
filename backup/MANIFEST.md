# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-05-11T19:52:54Z |
| **Timestamp WIB** | 2026-05-12 02:52 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
