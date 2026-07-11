# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-07-11T19:08:18Z |
| **Timestamp WIB** | 2026-07-12 02:08 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
