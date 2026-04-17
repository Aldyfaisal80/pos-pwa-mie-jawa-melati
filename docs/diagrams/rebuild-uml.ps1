$ErrorActionPreference = "Stop"
$file = "c:\Users\aldyf\Downloads\CODE\antigravity\post-pwa\docs\diagrams\uml-diagrams.drawio"
$content = [System.IO.File]::ReadAllText($file)

Write-Host "=== FASE 1: Update Use Case Diagram ===" -ForegroundColor Cyan

# Add "Melihat Beranda & Dashboard" use case + edge
$ucInsert = @'
                <mxCell id="uc-new-3" value="Melihat Beranda &amp; Dashboard" style="ellipse;whiteSpace=wrap;html=1;align=center;" parent="1" vertex="1">
                    <mxGeometry x="130" y="605" width="100" height="70" as="geometry"/>
                </mxCell>
                <mxCell id="uc-edge-beranda" value="" style="endArrow=classic;html=1;rounded=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.3333333333333333;exitDx=0;exitDy=0;exitPerimeter=0;" parent="1" source="_3HVeJXoIIEDDYXW4NGz-11" target="uc-new-3" edge="1">
                    <mxGeometry width="50" height="50" relative="1" as="geometry">
                        <mxPoint x="20" y="180" as="sourcePoint"/>
                        <mxPoint x="240" y="600" as="targetPoint"/>
                    </mxGeometry>
                </mxCell>
'@

# Insert before </root> in Use Case diagram (after the last edge)
$ucTarget = '                <mxCell id="uc-edge-settings"'
$ucSearchEnd = '</mxCell>
            </root>
        </mxGraphModel>
    </diagram>
    <diagram id="PwlFxr4sa3zVbGuwgD4N"'

# Use a more precise approach: find the closing of Use Case diagram
$content = $content -replace '(                </mxCell>\r?\n            </root>\r?\n        </mxGraphModel>\r?\n    </diagram>\r?\n    <diagram id="PwlFxr4sa3zVbGuwgD4N")', "$ucInsert`r`n            </root>`r`n        </mxGraphModel>`r`n    </diagram>`r`n    <diagram id=""PwlFxr4sa3zVbGuwgD4N"""

Write-Host "  [OK] Use Case: Added 'Melihat Beranda & Dashboard'" -ForegroundColor Green

Write-Host "`n=== FASE 2: Remove Duplicate Pages ===" -ForegroundColor Cyan

# Remove "Copy of Activity Diagram" page
$content = $content -replace '(?s)    <diagram name="Copy of Activity Diagram" id="C8cbJrc3moHQE8vKxy_f">.*?</diagram>\r?\n', ''
Write-Host "  [OK] Removed 'Copy of Activity Diagram'" -ForegroundColor Green

# Remove "Copy of FlowChart" page
$content = $content -replace '(?s)    <diagram name="Copy of FlowChart" id="qi5tf2BKybLjzS2uc_MX">.*?</diagram>\r?\n', ''
Write-Host "  [OK] Removed 'Copy of FlowChart'" -ForegroundColor Green

Write-Host "`n=== FASE 3: Localize Sequence Diagram ===" -ForegroundColor Cyan

$translations = @{
    'value="Access application"' = 'value="Akses Aplikasi"'
    'value="Check authentication status"' = 'value="Cek Status Autentikasi"'
    'value="Prompt for username and PIN"' = 'value="Tampilkan Form Login"'
    'value="Input username and PIN"' = 'value="Input Email dan Password"'
    'value="Validate data"' = 'value="Validasi Data"'
    'value="Display Cashier Dashboard"' = 'value="Tampilkan Dashboard Kasir"'
    'value="Select Menu Category"' = 'value="Pilih Kategori Menu"'
    'value="Choose Menu Items"' = 'value="Pilih Item Menu"'
    'value="Input Order Quantity"' = 'value="Input Jumlah Pesanan"'
    'value="Press Add to Cart"' = 'value="Tekan Tambah ke Keranjang"'
    'value="Ask if add more items"' = 'value="Tanya Tambah Pesanan Lagi?"'
    'value="Press Checkout"' = 'value="Tekan Checkout"'
    'value="Display Order Summary and Total Price"' = 'value="Tampilkan Ringkasan &amp; Total Harga"'
    'value="Input payment amount"' = 'value="Input Nominal Pembayaran"'
    'value="Calculate change"' = 'value="Hitung Kembalian"'
    'value="Process transaction storage"' = 'value="Proses Penyimpanan Transaksi"'
    'value="Perform Internet Connection Check"' = 'value="Cek Koneksi Internet"'
    'value="Save transaction data"' = 'value="Simpan Data Transaksi"'
    'value="Mark status as &quot;Successful&quot;"' = 'value="Tandai Status &quot;Berhasil&quot;"'
    'value="Mark status as &quot;Pending Upload&quot;"' = 'value="Tandai Status &quot;Menunggu Upload&quot;"'
    'value="Provide option to print receipt"' = 'value="Tampilkan Opsi Cetak Struk"'
    'value="Confirm receipt printing"' = 'value="Konfirmasi Cetak Struk"'
    'value="Transaction complete"' = 'value="Transaksi Selesai"'
    'value="Ready for next transaction"' = 'value="Siap Transaksi Berikutnya"'
    # ALT frame labels
    'value="[Not logged in]"' = 'value="[Belum Login]"'
    'value="[Logged in]"' = 'value="[Sudah Login]"'
    'value="[Add more items]"' = 'value="[Tambah Pesanan Lagi]"'
    'value="[No more items]"' = 'value="[Tidak Tambah Lagi]"'
    'value="[Online]"' = 'value="[Online]"'
    'value="[Offline]"' = 'value="[Offline]"'
    # Lifeline names
    'value="System"' = 'value="Sistem"'
    'value="DatabaseServer"' = 'value="Server Database"'
    'value="LocalStorage"' = 'value="Penyimpanan Lokal"'
}

$count = 0
foreach ($pair in $translations.GetEnumerator()) {
    if ($content.Contains($pair.Key)) {
        $content = $content.Replace($pair.Key, $pair.Value)
        $count++
        Write-Host "  [OK] $($pair.Key) -> $($pair.Value)" -ForegroundColor Green
    }
}
Write-Host "  Total labels translated: $count" -ForegroundColor Yellow

Write-Host "`n=== FASE 4: Add 4 New Activity Diagrams ===" -ForegroundColor Cyan

# Activity: Login
$actLogin = @'
    <diagram name="Activity: Login" id="act-login-1">
        <mxGraphModel dx="1422" dy="820" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
                <mxCell id="al-2" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="374" y="40" width="40" height="40" as="geometry"/>
                </mxCell>
                <mxCell id="al-3" value="Buka Aplikasi" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="120" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="al-e1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-2" target="al-3" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-4" value="Cek Status Autentikasi" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="210" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="al-e2" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-3" target="al-4" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-5" value="Sudah Login?" style="rhombus;whiteSpace=wrap;html=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="344" y="300" width="100" height="80" as="geometry"/>
                </mxCell>
                <mxCell id="al-e3" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-4" target="al-5" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-6" value="Tampilkan Form Login" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="164" y="400" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="al-e4" value="Tidak" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-5" target="al-6" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-7" value="Input Email &amp; Password" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="154" y="490" width="140" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="al-e5" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-6" target="al-7" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-8" value="Validasi Data" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="164" y="580" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="al-e6" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-7" target="al-8" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-9" value="Valid?" style="rhombus;whiteSpace=wrap;html=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="174" y="670" width="100" height="80" as="geometry"/>
                </mxCell>
                <mxCell id="al-e7" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-8" target="al-9" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-10" value="Tampilkan Pesan Error" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="14" y="700" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="al-e8" value="Tidak" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-9" target="al-10" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="al-e9" value="" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=0;exitY=0.5;exitDx=0;exitDy=0;" parent="1" source="al-10" target="al-6" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="-20" y="725"/>
                            <mxPoint x="-20" y="425"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="al-11" value="Tampilkan Halaman Beranda" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="800" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="al-e10" value="Iya" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="al-9" target="al-11" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="224" y="825"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="al-e11" value="Iya" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-5" target="al-11" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="520" y="340"/>
                            <mxPoint x="520" y="825"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="al-12" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;strokeWidth=3;" parent="1" vertex="1">
                    <mxGeometry x="379" y="890" width="30" height="30" as="geometry"/>
                </mxCell>
                <mxCell id="al-e12" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="al-11" target="al-12" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
            </root>
        </mxGraphModel>
    </diagram>
'@

# Activity: Kelola Produk
$actProduk = @'
    <diagram name="Activity: Kelola Produk" id="act-produk-1">
        <mxGraphModel dx="1422" dy="820" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
                <mxCell id="ap-2" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="374" y="40" width="40" height="40" as="geometry"/>
                </mxCell>
                <mxCell id="ap-3" value="Buka Halaman Produk" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="120" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-2" target="ap-3" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-4" value="Tampilkan Daftar Produk &amp; Kategori" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="314" y="210" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e2" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-3" target="ap-4" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-5" value="Pilih Aksi" style="rhombus;whiteSpace=wrap;html=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="344" y="300" width="100" height="80" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e3" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-4" target="ap-5" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-6" value="Tampilkan Form Tambah Produk" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="124" y="420" width="140" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e4" value="Tambah" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-5" target="ap-6" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-7" value="Tampilkan Form Edit Produk" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="420" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e5" value="Edit" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-5" target="ap-7" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-8" value="Konfirmasi Hapus Produk" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="534" y="420" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e6" value="Hapus" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-5" target="ap-8" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-9" value="Input Data Produk" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="124" y="510" width="140" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e7" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-6" target="ap-9" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-10" value="Input Data Produk" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="324" y="510" width="140" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e8" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-7" target="ap-10" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-11" value="Simpan ke Database" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="630" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e9" value="" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="ap-9" target="ap-11" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="194" y="655"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="ap-e10" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-10" target="ap-11" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e11" value="" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="ap-8" target="ap-11" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="594" y="655"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="ap-12" value="Tampilkan Notifikasi Berhasil" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="314" y="720" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e12" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-11" target="ap-12" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-13" value="Refresh Daftar Produk" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="810" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e13" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-12" target="ap-13" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ap-14" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;strokeWidth=3;" parent="1" vertex="1">
                    <mxGeometry x="379" y="900" width="30" height="30" as="geometry"/>
                </mxCell>
                <mxCell id="ap-e14" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ap-13" target="ap-14" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
            </root>
        </mxGraphModel>
    </diagram>
'@

# Activity: Lihat Laporan
$actLaporan = @'
    <diagram name="Activity: Lihat Laporan" id="act-laporan-1">
        <mxGraphModel dx="1422" dy="820" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
                <mxCell id="ar-2" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="374" y="40" width="40" height="40" as="geometry"/>
                </mxCell>
                <mxCell id="ar-3" value="Buka Halaman Laporan" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="120" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-2" target="ar-3" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-4" value="Tampilkan Statistik &amp; Tabel Transaksi" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="314" y="210" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e2" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-3" target="ar-4" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-5" value="Filter Laporan?" style="rhombus;whiteSpace=wrap;html=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="344" y="300" width="100" height="80" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e3" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-4" target="ar-5" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-6" value="Pilih Rentang Tanggal" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="154" y="400" width="140" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e4" value="Iya" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-5" target="ar-6" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-7" value="Tampilkan Data Terfilter" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="154" y="490" width="140" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e5" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-6" target="ar-7" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-8" value="Lihat Detail Transaksi?" style="rhombus;whiteSpace=wrap;html=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="344" y="530" width="100" height="80" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e6" value="" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="ar-7" target="ar-8" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="224" y="570"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="ar-e7" value="Tidak" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-5" target="ar-8" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-9" value="Buka Modal Detail Transaksi" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="314" y="660" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e8" value="Iya" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-8" target="ar-9" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-10" value="Tampilkan Item &amp; Total" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="750" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e9" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-9" target="ar-10" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-11" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;strokeWidth=3;" parent="1" vertex="1">
                    <mxGeometry x="379" y="840" width="30" height="30" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e10" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="ar-10" target="ar-11" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="ar-e11" value="Tidak" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="ar-8" target="ar-11" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="530" y="570"/>
                            <mxPoint x="530" y="855"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
            </root>
        </mxGraphModel>
    </diagram>
'@

# Activity: Pengaturan Toko
$actSettings = @'
    <diagram name="Activity: Pengaturan Toko" id="act-settings-1">
        <mxGraphModel dx="1422" dy="820" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
                <mxCell id="as-2" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="374" y="40" width="40" height="40" as="geometry"/>
                </mxCell>
                <mxCell id="as-3" value="Buka Halaman Pengaturan" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="314" y="120" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-2" target="as-3" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-4" value="Pilih Tab Pengaturan" style="rhombus;whiteSpace=wrap;html=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="344" y="210" width="100" height="80" as="geometry"/>
                </mxCell>
                <mxCell id="as-e2" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-3" target="as-4" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-5" value="Edit Info Toko (Nama, Alamat, Telepon)" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="104" y="340" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e3" value="Info Toko" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-4" target="as-5" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-6" value="Konfigurasi Printer Bluetooth" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="340" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e4" value="Printer" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-4" target="as-6" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-7" value="Edit Profil Akun (Nama, Avatar)" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="524" y="340" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e5" value="Profil" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-4" target="as-7" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-8" value="Input Data Perubahan" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;rounded=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="314" y="450" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e6" value="" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;" parent="1" source="as-5" target="as-8" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="184" y="475"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="as-e7" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-6" target="as-8" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-e8" value="" style="rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;entryPerimeter=0;" parent="1" source="as-7" target="as-8" edge="1">
                    <mxGeometry relative="1" as="geometry">
                        <Array as="points">
                            <mxPoint x="604" y="475"/>
                        </Array>
                    </mxGeometry>
                </mxCell>
                <mxCell id="as-9" value="Tekan Simpan" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="540" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e9" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-8" target="as-9" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-10" value="Simpan ke Database" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="334" y="630" width="120" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e10" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-9" target="as-10" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-11" value="Tampilkan Notifikasi Berhasil" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" parent="1" vertex="1">
                    <mxGeometry x="314" y="720" width="160" height="50" as="geometry"/>
                </mxCell>
                <mxCell id="as-e11" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-10" target="as-11" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
                <mxCell id="as-12" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;strokeWidth=3;" parent="1" vertex="1">
                    <mxGeometry x="379" y="810" width="30" height="30" as="geometry"/>
                </mxCell>
                <mxCell id="as-e12" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" parent="1" source="as-11" target="as-12" edge="1">
                    <mxGeometry relative="1" as="geometry"/>
                </mxCell>
            </root>
        </mxGraphModel>
    </diagram>
'@

# Insert all 4 new activity diagrams before the closing </mxfile> tag
$closingTag = "</mxfile>"
$content = $content.Replace($closingTag, "$actLogin`r`n$actProduk`r`n$actLaporan`r`n$actSettings`r`n$closingTag")
Write-Host "  [OK] Added Activity: Login" -ForegroundColor Green
Write-Host "  [OK] Added Activity: Kelola Produk" -ForegroundColor Green
Write-Host "  [OK] Added Activity: Lihat Laporan" -ForegroundColor Green
Write-Host "  [OK] Added Activity: Pengaturan Toko" -ForegroundColor Green

Write-Host "`n=== FASE 5: Update Page Count ===" -ForegroundColor Cyan

# Current: 12 pages - 2 deleted + 4 added = 14 pages
$content = $content -replace 'pages="12"', 'pages="14"'
Write-Host "  [OK] Updated pages count: 12 -> 14" -ForegroundColor Green

Write-Host "`n=== SAVING FILE ===" -ForegroundColor Cyan
[System.IO.File]::WriteAllText($file, $content)
Write-Host "  [OK] File saved successfully!" -ForegroundColor Green

# Verify
$finalContent = [System.IO.File]::ReadAllText($file)
$diagramCount = ([regex]::Matches($finalContent, '<diagram ')).Count
Write-Host "`n=== VERIFICATION ===" -ForegroundColor Cyan
Write-Host "  Total diagram pages: $diagramCount" -ForegroundColor Yellow
Write-Host "  Expected: 14" -ForegroundColor Yellow

if ($diagramCount -eq 14) {
    Write-Host "`n  [SUCCESS] All changes applied correctly!" -ForegroundColor Green
} else {
    Write-Host "`n  [WARNING] Page count mismatch! Review needed." -ForegroundColor Red
}
