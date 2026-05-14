# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-05-14T19:51:18Z |
| **Timestamp WIB** | 2026-05-15 02:51 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
