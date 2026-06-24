# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-24T19:50:25Z |
| **Timestamp WIB** | 2026-06-25 02:50 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
