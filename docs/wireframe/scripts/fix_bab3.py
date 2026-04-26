"""Fix WIREFRAME-BAB3.md: renumber captions using image src as anchor."""
import re

FILE = "C:/Users/aldyf/Downloads/CODE/antigravity/post-pwa/docs/wireframe/WIREFRAME-BAB3.md"

MAP = {
    'WF-00-D.png':'3.1','WF-00-M.png':'3.2','WF-00-E.png':'3.3',
    'WF-01-D.png':'3.4','WF-01-M.png':'3.5',
    'WF-02-D.png':'3.6','WF-02-M.png':'3.7','WF-02-MC.png':'3.8',
    'WF-02-MR.png':'3.9','WF-02-MN.png':'3.10',
    'WF-03-D.png':'3.11','WF-03-M.png':'3.12','WF-03-MF.png':'3.13','WF-03-MK.png':'3.14',
    'WF-04-D.png':'3.15','WF-04-M.png':'3.16','WF-04-MD.png':'3.17',
    'WF-05-D.png':'3.18','WF-05-M.png':'3.19',
}

with open(FILE, encoding='utf-8') as f:
    lines = f.readlines()

result = []
cur = None
for line in lines:
    # Image line: fix alt text number
    m = re.search(r'!\[Gambar \d+\.\d+([^\]]*)\]\(export/(\S+\.png)\)', line)
    if m:
        fname = m.group(2)
        if fname in MAP:
            cur = MAP[fname]
            line = re.sub(r'Gambar \d+\.\d+', f'Gambar {cur}', line, count=1)
    # Comment line before image
    elif cur and re.match(r'<!-- SISIPKAN: Gambar \d+', line):
        line = re.sub(r'Gambar \d+\.\d+', f'Gambar {cur}', line, count=1)
    # Caption italic line
    elif cur and re.match(r'\*Gambar \d+', line):
        line = re.sub(r'Gambar \d+\.\d+', f'Gambar {cur}', line, count=1)
        cur = None  # reset after caption
    result.append(line)

content = ''.join(result)

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

nums = sorted(set(int(x) for x in re.findall(r'Gambar 3\.(\d+)', content)))
print('Nums:', nums)
print('Gaps:', [x for x in range(1,20) if x not in nums])
assert nums == list(range(1,20)), "Still wrong!"
print("ALL GOOD!")
