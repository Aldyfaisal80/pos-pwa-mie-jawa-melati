# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-13T19:41:13Z |
| **Timestamp WIB** | 2026-06-14 02:41 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
