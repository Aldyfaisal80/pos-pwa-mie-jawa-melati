# Directory ini digunakan oleh GitHub Actions untuk menyimpan backup otomatis database.
# File backup di-commit secara otomatis tiap malam jam 01:00 WIB.
#
# Format file:
#   - schema.sql  → DDL (struktur tabel)
#   - data.sql    → DML (isi data / rows)
#   - MANIFEST.md → Info timestamp & cara restore
#
# ⚠️  Untuk RESTORE:
#   psql [DB_URL] -f backup/schema.sql
#   psql [DB_URL] -f backup/data.sql
