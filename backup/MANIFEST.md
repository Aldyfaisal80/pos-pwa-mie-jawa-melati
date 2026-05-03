# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-05-03T19:05:16Z |
| **Timestamp WIB** | 2026-05-04 02:05 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
