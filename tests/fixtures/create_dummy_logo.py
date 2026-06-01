import struct
import zlib

def create_png(width, height, r, g, b):
    def chunk(chunk_type, data):
        c = struct.pack('>I', len(data)) + chunk_type + data
        return c + struct.pack('>I', zlib.crc32(c[4:]) & 0xffffffff)

    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
    row = b'\x00' + bytes([r, g, b]) * width
    raw = b''.join([row] * height)
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend

with open('tests/fixtures/dummy-logo.png', 'wb') as f:
    f.write(create_png(100, 100, 255, 102, 0))

print("Created tests/fixtures/dummy-logo.png successfully")
