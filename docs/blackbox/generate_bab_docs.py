import re
import os

input_file = r"c:\Users\aldyf\Downloads\CODE\antigravity\post-pwa\docs\blackbox\BAB4-BLACKBOX.md"
bab3_output = r"c:\Users\aldyf\Downloads\CODE\antigravity\post-pwa\docs\blackbox\BAB3-BLACKBOX.md"
bab4_output = r"c:\Users\aldyf\Downloads\CODE\antigravity\post-pwa\docs\blackbox\BAB4-BLACKBOX.md"

def to_paragraph(text):
    if not text:
        return text
    parts = text.split('<br>')
    sentences = []
    for p in parts:
        p = p.strip()
        if p.startswith('- '):
            p = p[2:]
        if p:
            if not p.endswith('.') and not p.endswith('?') and not p.endswith('!'):
                p += '.'
            if len(p) > 0:
                p = p[0].upper() + p[1:]
            sentences.append(p)
    return ' '.join(sentences)

def to_numbered_list(text):
    if not text:
        return text
    parts = text.split('<br>')
    numbered_parts = []
    counter = 1
    for p in parts:
        p = p.strip()
        if p.startswith('- '):
            p = p[2:]
        # Strip ALL existing numbering (e.g. "1. ", "1. 1. 1. ") to prevent duplication
        p = re.sub(r'^(?:\d+\.\s*)+', '', p).strip()
        if p:
            # Capitalize first letter
            if len(p) > 0:
                p = p[0].upper() + p[1:]
            numbered_parts.append(f"{counter}. {p}")
            counter += 1
    return ' <br> '.join(numbered_parts)

def extract_tables(content):
    tables = []
    # Find tables that start with | No | Skenario Pengujian |
    pattern = re.compile(r'(\| No \| Skenario Pengujian \|.*?)(?=\n\n|\Z)', re.DOTALL)
    matches = pattern.findall(content)
    # Filter out actual markdown tables
    for match in matches:
        if '|---' in match or '| ---' in match:
            tables.append(match.strip())
            
    # There are 8 tables in total, the first 7 are module tests, the 8th is the summary
    # Let's extract by looking line by line to handle tables accurately.
    return tables

def extract_all_tables_by_lines(content):
    lines = content.split('\n')
    tables = []
    current_table = []
    in_table = False
    
    for line in lines:
        if line.strip().startswith('|') and line.strip().endswith('|'):
            in_table = True
            current_table.append(line.strip())
        else:
            if in_table:
                # Table ended
                tables.append("\n".join(current_table))
                current_table = []
                in_table = False
                
    if in_table:
        tables.append("\n".join(current_table))
        
    # The last table is the recapitulation table
    return tables

def main():
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    tables = extract_all_tables_by_lines(content)
    
    # We expect 8 tables in total (7 test modules + 1 rekapitulasi)
    # Some tables might have been broken into two pieces in the original doc by a rogue heading.
    # Actually, in the provided BAB4-BLACKBOX.md, table F-07 was split into 4 parts due to headers repeating!
    # Let's look at the raw lines:
    # 128: ### 4.1.11 Hasil Pengujian Modul Tabel 4.7 — Tes Skenario Modul F-07: Pengaturan
    # 129: | No | Skenario Pengujian | ...
    # 142: | No | Skenario Pengujian | ...
    # 152: | No | Skenario Pengujian | ...
    # 161: | No | Skenario Pengujian | ...
    # Let's merge contiguous tables or tables separated only by table headers.

    merged_tables = []
    current_merged_table = []
    header_line = "| No | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian |"
    
    for table in tables:
        if 'Tingkat Keberhasilan' in table:
            # This is the recap table
            merged_tables.append(table)
            continue
            
        lines = table.split('\n')
        
        # If this is the start of a new actual module (we have 7 modules)
        # We can distinguish them because they have specific content or just merge them if they have the same header.
        # Actually, let's just parse the rows and rebuild the tables.
        pass

    # Let's write a simpler, explicit parser that pulls out the exact rows for each module.
    # Modules: F-01 to F-07
    # We will just parse all data rows.
    data_rows = []
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('|') and line.endswith('|'):
            if 'No | Skenario' in line or '---|' in line or 'Modul | Nama Modul' in line or '| **Total** |' in line or 'Tingkat Keberhasilan' in line:
                pass # skip header and separators and recap table
            else:
                cols = [c.strip() for c in line.strip('|').split('|')]
                if len(cols) >= 6 and cols[0].isdigit():
                    # If there are 7 columns, combine the last two or just use the last one for 'Hasil Pengujian'
                    if len(cols) == 7:
                        # Apply formatting to specific columns
                        langkah = to_numbered_list(cols[2])
                        diharapkan = to_paragraph(cols[3])
                        diperoleh = to_paragraph(cols[4])
                        
                        mapped_cols = [cols[0], cols[1], langkah, diharapkan, diperoleh, cols[6]]
                        data_rows.append(mapped_cols)
                    else:
                        cols[2] = to_numbered_list(cols[2])
                        cols[3] = to_paragraph(cols[3])
                        cols[4] = to_paragraph(cols[4])
                        data_rows.append(cols)

    # Now we have all test scenario rows. Let's group them by their numbers resetting to 1.
    modules_data = []
    current_module = []
    for row in data_rows:
        if row[0] == '1' and len(current_module) > 0:
            modules_data.append(current_module)
            current_module = []
        current_module.append(row)
    if len(current_module) > 0:
        modules_data.append(current_module)

    # modules_data should have 7 items.
    assert len(modules_data) == 7, f"Expected 7 modules, found {len(modules_data)}"
    
    module_titles = [
        "Halaman Autentikasi",
        "Halaman Beranda (*Home Hub*)",
        "Halaman Dashboard Analitik",
        "Halaman Kasir (*Point of Sale*)",
        "Halaman Manajemen Produk",
        "Halaman Laporan",
        "Halaman Pengaturan"
    ]
    
    bab3_descriptions = [
        "Pengujian pada modul autentikasi dirancang untuk memvalidasi keandalan mekanisme keamanan sistem, khususnya dalam mengelola sesi pengguna, mencegah akses yang tidak sah, serta memastikan proses otorisasi berjalan sesuai dengan parameter yang telah ditetapkan.",
        "Pengujian pada modul beranda bertujuan untuk memastikan bahwa antarmuka utama sistem mampu menampilkan informasi yang dinamis dan relevan, serta memvalidasi fungsionalitas navigasi dan sinkronisasi status secara waktu nyata.",
        "Pengujian pada modul dashboard analitik difokuskan pada verifikasi akurasi representasi data statistik, visualisasi grafik pendapatan, serta kemampuan sistem dalam memperbarui informasi secara otomatis seiring dengan adanya transaksi baru.",
        "Pengujian pada modul kasir merupakan tahapan krusial untuk mengevaluasi kapabilitas sistem dalam memproses transaksi penjualan, manajemen keranjang belanja, kalkulasi tagihan, serta penanganan konektivitas luring (*offline*) dan pencetakan struk.",
        "Pengujian pada modul manajemen produk dirancang untuk memvalidasi fungsionalitas manipulasi data pokok (*Create, Read, Update, Delete*), validasi unggahan media, serta pengelolaan status ketersediaan inventaris.",
        "Pengujian pada modul laporan bertujuan untuk menguji keandalan sistem dalam menyajikan riwayat transaksi, fungsionalitas penyaringan data (*filter*) berbasis temporal dan kriteria spesifik, serta kemampuan ekspor data untuk keperluan administratif.",
        "Pengujian pada modul pengaturan difokuskan pada evaluasi mekanisme konfigurasi identitas sistem, manajemen profil pengguna, preferensi pencetakan, serta kapabilitas pencadangan (*backup*) data secara mandiri."
    ]
    
    bab4_descriptions = [
        "Tabel 4.1 menyajikan hasil eksekusi pengujian untuk modul autentikasi. Hasil observasi menunjukkan bahwa seluruh mekanisme validasi input dan kontrol akses beroperasi sesuai dengan spesifikasi fungsional yang telah ditetapkan tanpa terdeteksi adanya galat sistem.",
        "Tabel 4.2 merangkum hasil pengujian pada modul beranda. Berdasarkan hasil pengujian, sistem terbukti mampu menyajikan informasi dinamis dan merespons interaksi pengguna dengan tingkat akurasi yang tinggi.",
        "Hasil pengujian untuk modul dashboard analitik disajikan pada Tabel 4.3. Keseluruhan skenario yang dieksekusi menunjukkan bahwa agregasi data dan visualisasi grafik berfungsi secara optimal dan sesuai dengan rekam jejak transaksi.",
        "Tabel 4.4 memuat hasil eksekusi pengujian modul kasir. Observasi mengonfirmasi bahwa seluruh alur transaksi, baik dalam kondisi daring maupun luring, dapat diselesaikan dengan presisi kalkulasi yang akurat serta integrasi perangkat keras yang berjalan mulus.",
        "Hasil pengujian terkait modul manajemen produk ditunjukkan pada Tabel 4.5. Seluruh operasi pengelolaan data produk dapat dieksekusi dengan sukses, disertai dengan respons sistem yang tepat terhadap berbagai skenario validasi input.",
        "Tabel 4.6 menampilkan hasil akhir pengujian modul laporan. Data yang disajikan menunjukkan bahwa sistem mampu memproses dan menyaring riwayat transaksi dengan akurat, serta menghasilkan dokumen ekspor yang sesuai dengan parameter yang ditentukan pengguna.",
        "Rekam jejak pengujian untuk modul pengaturan dapat dilihat pada Tabel 4.7. Hasil observasi membuktikan bahwa sistem secara konsisten mampu menyimpan dan menerapkan setiap perubahan konfigurasi profil dan preferensi sesuai dengan ekspektasi."
    ]
    
    recap_table_lines = [
        "| Modul | Nama Modul | Jumlah Kasus Uji | Berhasil | Gagal | Tingkat Keberhasilan |",
        "|---|---|---|---|---|---|",
        "| F-01 | Autentikasi | 6 | 6 | 0 | 100% |",
        "| F-02 | Beranda (Dashboard) | 11 | 11 | 0 | 100% |",
        "| F-03 | Dashboard Analitik | 7 | 7 | 0 | 100% |",
        "| F-04 | Kasir (Point of Sale) | 27 | 27 | 0 | 100% |",
        "| F-05 | Manajemen Produk | 23 | 23 | 0 | 100% |",
        "| F-06 | Laporan & Analitik | 16 | 16 | 0 | 100% |",
        "| F-07 | Pengaturan Sistem | 34 | 34 | 0 | 100% |",
        "| **Total** | | **124** | **124** | **0** | **100%** |"
    ]
    
    # ------------------ GENERATE BAB 3 ------------------
    bab3_content = "# BAB III METODOLOGI PENELITIAN\n\n"
    bab3_content += "## 3.1 Skenario Pengujian Blackbox\n\n"
    bab3_content += "Pengujian *blackbox* dirancang untuk mengevaluasi fungsionalitas sistem berdasarkan spesifikasi kebutuhan yang telah ditetapkan. Berikut adalah penjabaran skenario pengujian untuk setiap modul utama.\n\n"
    
    for i in range(7):
        bab3_content += f"### 3.1.{i+1} Pengujian {module_titles[i]}\n\n"
        bab3_content += f"{bab3_descriptions[i]}\n\n"
        bab3_content += f"**Tabel 3.{i+1}** Pengujian {module_titles[i]}\n"
        bab3_content += "| No | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian |\n"
        bab3_content += "|---|---|---|---|---|---|\n"
        for row in modules_data[i]:
            # Keep Hasil Diperoleh and Hasil Pengujian empty
            bab3_content += f"| {row[0]} | {row[1]} | {row[2]} | {row[3]} | | |\n"
        bab3_content += "\n"
        
    with open(bab3_output, 'w', encoding='utf-8') as f:
        f.write(bab3_content)
        
    # ------------------ GENERATE BAB 4 ------------------
    bab4_content = "# BAB IV HASIL DAN PEMBAHASAN\n\n"
    bab4_content += "## 4.1 Hasil Pengujian Blackbox\n\n"
    bab4_content += "Tahapan ini menguraikan hasil eksekusi dari skenario pengujian *blackbox* yang telah dirumuskan pada Bab III. Evaluasi dilakukan secara sistematis pada setiap modul untuk memastikan keandalan fungsionalitas aplikasi.\n\n"
    
    for i in range(7):
        bab4_content += f"### 4.1.{i+1} Hasil Pengujian {module_titles[i]}\n\n"
        bab4_content += f"{bab4_descriptions[i]}\n\n"
        bab4_content += f"**Tabel 4.{i+1}** Hasil Pengujian {module_titles[i]}\n"
        bab4_content += "| No | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian |\n"
        bab4_content += "|---|---|---|---|---|---|\n"
        for row in modules_data[i]:
            # Use original results
            bab4_content += f"| {row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} |\n"
        bab4_content += "\n"
        
    bab4_content += "### 4.1.8 Rekapitulasi Hasil Pengujian\n\n"
    bab4_content += "Berdasarkan keseluruhan eksekusi skenario pengujian *blackbox*, Tabel 4.8 menyajikan rekapitulasi tingkat keberhasilan dari pengujian pada ketujuh modul sistem utama. Seluruh fungsi telah divalidasi dan memenuhi kriteria penerimaan (*acceptance criteria*) yang ditetapkan.\n\n"
    bab4_content += "**Tabel 4.8** Rekapitulasi Hasil Pengujian Blackbox\n"
    bab4_content += "\n".join(recap_table_lines) + "\n"
    
    with open(bab4_output, 'w', encoding='utf-8') as f:
        f.write(bab4_content)
        
    print("Generation successful!")

if __name__ == "__main__":
    main()
