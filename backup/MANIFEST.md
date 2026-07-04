# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-07-04T19:18:13Z |
| **Timestamp WIB** | 2026-07-05 02:18 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
