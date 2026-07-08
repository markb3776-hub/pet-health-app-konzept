import qrcode
url = "https://tierakte.app/s/7F3K"
img = qrcode.make(url)
img.save("/home/ubuntu/app_defizit_analyse/workflow_test/qr_test.png")
try:
    from pyzbar.pyzbar import decode
    from PIL import Image
    result = decode(Image.open("/home/ubuntu/app_defizit_analyse/workflow_test/qr_test.png"))
    decoded = result[0].data.decode()
    print("QR_ERZEUGT_UND_DEKODIERT:", decoded, "| MATCH:", decoded == url)
except ImportError:
    print("QR_ERZEUGT (Dekodier-Bibliothek fehlt)")
