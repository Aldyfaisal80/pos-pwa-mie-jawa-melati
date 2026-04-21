# 🗄️ Database Backup

Direktori ini berisi backup otomatis database **Supabase PostgreSQL** yang di-generate oleh GitHub Actions setiap malam.

---

## ⚡ Jadwal Backup

| Jenis | Waktu | Keterangan |
|-------|-------|------------|
| **Otomatis** | Setiap hari pukul 01:00 WIB | Via GitHub Actions cron `0 18 * * *` UTC |
| **Manual** | Kapan saja | *Actions → Nightly DB Backup → Run workflow* |

---

## 📁 Isi Direktori

```
backup/
├── schema.sql    # DDL — struktur tabel, index, constraint
├── data.sql      # DML — isi data (semua rows)
└── MANIFEST.md   # Metadata timestamp & panduan restore
```

| File | Deskripsi |
|------|-----------|
| `schema.sql` | Definisi tabel, kolom, tipe data, index, foreign key |
| `data.sql` | Semua data dari schema `public` |
| `MANIFEST.md` | Timestamp backup, trigger info, dan instruksi restore |

---

## 🔄 Cara Restore

> [!WARNING]
> Restore akan **menimpa data yang ada**. Lakukan di environment development/staging dulu sebelum production.

### Prasyarat

```bash
# Pastikan postgresql-client sudah terinstall
psql --version

# Export connection string Supabase kamu
export DB_URL="postgresql://postgres.[project-ref]:[password]@[host]:5432/postgres"
```

### Langkah Restore

```bash
# 1. Restore struktur database (DDL)
psql $DB_URL -f backup/schema.sql

# 2. Restore isi data (DML)
psql $DB_URL -f backup/data.sql
```

### Restore Partial (hanya tabel tertentu)

```bash
# Contoh: restore hanya tabel 'products'
psql $DB_URL -c "\copy products FROM 'backup/data.sql'"
```

---

## 🔐 Keamanan

| Aspek | Status | Keterangan |
|-------|--------|------------|
| Password DB | ✅ Aman | Disimpan di GitHub Secrets, tidak pernah muncul di log |
| Host & username | ✅ Aman | Metadata publik, bukan credential |
| File backup | ⚠️ Sensitif | Berisi data real — repo sudah di-set **private** |
| Akses repo | ✅ Terbatas | Hanya collaborator yang bisa akses file ini |

> [!IMPORTANT]
> Pastikan repository ini selalu **private**. File `data.sql` mengandung data transaksi nyata.

---

## ⚙️ Konfigurasi GitHub Actions

Workflow: [`.github/workflows/backup-db.yml`](../.github/workflows/backup-db.yml)

### Secret yang Dibutuhkan

| Secret Name | Keterangan |
|-------------|------------|
| `SUPABASE_DB_PASSWORD` | Password database Supabase (set di *Settings → Secrets → Actions*) |

### Infrastruktur

| Komponen | Nilai |
|----------|-------|
| Runner | `ubuntu-latest` (GitHub-hosted) |
| PostgreSQL client | v17 (dari PGDG official repo) |
| Connection | Supabase IPv4 Connection Pooler |
| Pooler host | `aws-1-ap-southeast-1.pooler.supabase.com:5432` |

---

## 🐛 Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `fe_sendauth: no password supplied` | Secret `SUPABASE_DB_PASSWORD` kosong | Set secret di GitHub Settings |
| `server version mismatch` | pg_dump versi lama vs server baru | Workflow sudah pakai PGDG pg_dump v17 |
| `Network is unreachable` | Runner mencoba koneksi IPv6 | Workflow sudah pakai pooler IPv4 |
| `No changes to backup` | Data tidak berubah sejak backup terakhir | Normal — commit di-skip otomatis |

---

## 📋 Riwayat Perbaikan

| Tanggal | Fix |
|---------|-----|
| 2026-04-21 | Ganti `supabase db dump` → native `pg_dump` |
| 2026-04-21 | Ganti host direct (IPv6) → connection pooler (IPv4) |
| 2026-04-21 | Install `postgresql-client-17` dari PGDG repo (version mismatch) |

---

*Dikelola oleh [GitHub Actions](../.github/workflows/backup-db.yml) — jangan edit `schema.sql` / `data.sql` secara manual.*
