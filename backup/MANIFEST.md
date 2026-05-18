# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-05-18T19:48:27Z |
| **Timestamp WIB** | 2026-05-19 02:48 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
