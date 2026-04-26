# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-04-26T19:00:44Z |
| **Timestamp WIB** | 2026-04-27 02:00 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
