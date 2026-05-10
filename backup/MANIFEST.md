# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-05-10T19:09:39Z |
| **Timestamp WIB** | 2026-05-11 02:09 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
