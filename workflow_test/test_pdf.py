from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Helvetica", "B", 16)
pdf.cell(0, 10, "Notfall-Pass: Balou (Testfall)", ln=True)
pdf.set_font("Helvetica", "", 11)
lines = [
    "Signalement: Labrador Retriever, m/kastriert, geb. 12.05.2019, 32,4 kg",
    "Chipnummer: 276098100123456",
    "Allergien: Huehnerprotein (best. 03/2025); Unvertraegl.: Carprofen",
    "Dauermedikation: Vetoryl 30 mg 1x tgl. (Cushing, seit 06/2024)",
    "Letzte Impfung: SHPPi+LT 09/2025 (Praxis Dr. Weber)",
]
for l in lines:
    pdf.cell(0, 8, l, ln=True)
pdf.output("/home/ubuntu/app_defizit_analyse/workflow_test/notfallpass_test.pdf")
print("PDF_OK")
