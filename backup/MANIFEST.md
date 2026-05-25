# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-05-25T19:45:39Z |
| **Timestamp WIB** | 2026-05-26 02:45 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
