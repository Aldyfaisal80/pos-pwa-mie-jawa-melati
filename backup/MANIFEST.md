# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-07-02T19:28:24Z |
| **Timestamp WIB** | 2026-07-03 02:28 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
