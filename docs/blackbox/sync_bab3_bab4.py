import re

def process_docs():
    file4 = r'c:\Users\aldyf\Downloads\CODE\antigravity\post-pwa\docs\BAB4-BLACKBOX.md'
    file3 = r'c:\Users\aldyf\Downloads\CODE\antigravity\post-pwa\docs\BAB3-BLACKBOX.md'

    with open(file4, 'r', encoding='utf-8') as f:
        content4 = f.read()

    with open(file3, 'r', encoding='utf-8') as f:
        content3 = f.read()

    terms = [
        'login', 'logout', 'password', 'email', 'field', 'error', 'browser', 'refresh', 'reload', 
        'redirect', 'redirect loop', 'sidebar', 'dropdown', 'popover', 'drawer', 'bottom tab bar', 
        'floating button', 'online', 'offline', 'loading', 'sync', 'live invalidation', 'checkout', 
        'invoice', 'split qty', 'qty', 'toast', 'progress bar', 'default', 'filter', 'real-time', 
        'search bar', 'enter', 'desktop', 'mobile', 'viewport', 'drag handle', 'swipe-to-dismiss', 
        'database', 'server', 'soft delete', 'invalid login credentials', 'invalid', 'credentials', 
        'plaintext', 'empty state', 'custom', 'dashboard'
    ]

    terms.sort(key=len, reverse=True)

    # 1. Format BAB4
    for term in terms:
        # Match boundaries, not preceded/followed by *, _, /, or `-`
        pattern = re.compile(r'(?<![\*\_/\-\w])(' + re.escape(term) + r')(?![\*\_/\-\w])', re.IGNORECASE)
        content4 = pattern.sub(r'*\1*', content4)

    # Specific replacements
    content4 = content4.replace("Muncul pesan error autentikasi", "Sistem menampilkan pesan *error* autentikasi")
    content4 = content4.replace("Muncul pesan validasi", "Sistem menampilkan pesan validasi")
    content4 = content4.replace("Muncul notifikasi sukses", "Sistem menampilkan notifikasi sukses")
    content4 = content4.replace("Muncul peringatan", "Sistem menampilkan peringatan")

    # Double check for double asterisks **word** -> *word* if we accidentally nested them (unlikely due to regex lookarounds)

    with open(file4, 'w', encoding='utf-8') as f:
        f.write(content4)

    # 2. Extract tables from BAB4 and put into BAB3
    # Find all tables in BAB4 and process them.
    # We will just iterate line by line
    
    bab3_lines = []
    in_table = False
    
    lines4 = content4.split('\n')
    
    # We want to replace all tables in BAB3 with tables from BAB4
    # But BAB3 text outside tables should be kept as is? Or should we just copy BAB4 to BAB3 and replace "Hasil Pengujian" with empty?
    # No, BAB3 text outside tables might be different. E.g. "Bab 3.1 Skenario Pengujian..."
    
    # So let's parse tables from BAB4.
    tables4 = {} # key: Table Name/Number (e.g. "Tabel 4.1"), value: list of lines
    current_table = None
    
    for line in lines4:
        if line.startswith('**Tabel 4.'):
            # Extract table name and change 4.x to 3.x
            table_name = line.replace('**Tabel 4.', '**Tabel 3.')
            current_table = table_name
            tables4[current_table] = []
        elif line.strip().startswith('|') and current_table:
            tables4[current_table].append(line)
        elif not line.strip() and current_table and len(tables4[current_table]) > 0:
            current_table = None
            
    # Now reconstruct BAB3
    lines3 = content3.split('\n')
    new_lines3 = []
    
    skip_table = False
    current_table3 = None
    
    for line in lines3:
        if line.startswith('**Tabel 3.'):
            new_lines3.append(line)
            current_table3 = line
            
            # Wait for table to start
            skip_table = True
            
            # Append the empty line and the processed table from tables4
            new_lines3.append('')
            
            if current_table3 in tables4:
                table_lines = tables4[current_table3]
                for tline in table_lines:
                    if tline.startswith('| No |') or tline.startswith('|---|'):
                        new_lines3.append(tline)
                    else:
                        # Data row, blank the last two columns
                        parts = tline.split('|')
                        if len(parts) >= 7: # | 1 | 2 | 3 | 4 | 5 | 6 |
                            parts[-2] = ' ' # col 6
                            parts[-3] = ' ' # col 5
                            new_lines3.append('|'.join(parts))
                        else:
                            new_lines3.append(tline)
            continue
            
        if skip_table:
            if not line.strip():
                # End of table in BAB3
                skip_table = False
            continue
            
        new_lines3.append(line)
        
    # Format terms in BAB3 as well just in case there's text outside tables
    content3_new = '\n'.join(new_lines3)
    for term in terms:
        pattern = re.compile(r'(?<![\*\_/\-\w])(' + re.escape(term) + r')(?![\*\_/\-\w])', re.IGNORECASE)
        content3_new = pattern.sub(r'*\1*', content3_new)
        
    content3_new = content3_new.replace("Muncul pesan error autentikasi", "Sistem menampilkan pesan *error* autentikasi")
    content3_new = content3_new.replace("Muncul pesan validasi", "Sistem menampilkan pesan validasi")
    content3_new = content3_new.replace("Muncul notifikasi sukses", "Sistem menampilkan notifikasi sukses")
    content3_new = content3_new.replace("Muncul peringatan", "Sistem menampilkan peringatan")

    with open(file3, 'w', encoding='utf-8') as f:
        f.write(content3_new)
        
    print("Successfully synchronized BAB3 and BAB4.")

if __name__ == '__main__':
    process_docs()
