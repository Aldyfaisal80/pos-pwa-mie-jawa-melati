# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-07-07T19:59:15Z |
| **Timestamp WIB** | 2026-07-08 02:59 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
