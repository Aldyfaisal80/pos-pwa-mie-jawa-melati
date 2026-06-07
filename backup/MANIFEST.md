# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-07T19:28:02Z |
| **Timestamp WIB** | 2026-06-08 02:28 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
