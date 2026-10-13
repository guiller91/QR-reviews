"""Genera el QR de reseñas de Google para la clínica Dr. Javier Sola.

Salidas (en ./out):
  - qr-resenas.svg / qr-resenas.png   -> solo el código, para reutilizar
  - tarjeta-resenas-a6.pdf / .png     -> tarjeta imprimible A6 (105x148 mm)
"""
import base64
import os
import sys

import cairosvg
import segno

PLACE_ID = "ChIJXzx4KLMSRw0R9agcX3SkseQ"
URL = f"https://search.google.com/local/writereview?placeid={PLACE_ID}"

INK = "#23343a"
PETROL = "#2b5a66"
TEAL = "#3d7f8c"
TINT = "#e8f1f2"
LINE = "#d9e4e6"
MUTED = "#5f6f74"
STAR = "#e9a93a"

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
LOGO = sys.argv[1] if len(sys.argv) > 1 else None


def star_path(cx, cy, r_out, r_in=None):
    import math
    r_in = r_in or r_out * 0.48
    pts = []
    for i in range(10):
        r = r_out if i % 2 == 0 else r_in
        a = -math.pi / 2 + i * math.pi / 5
        pts.append(f"{cx + r * math.cos(a):.2f},{cy + r * math.sin(a):.2f}")
    return "M" + " L".join(pts) + " Z"


def qr_group(x, y, size):
    """Devuelve el SVG (<g>) del QR estilizado en la caja (x, y, size)."""
    qr = segno.make(URL, error="h", boost_error=False)
    matrix = [list(row) for row in qr.matrix]
    n = len(matrix)
    m = size / n
    parts = [f'<g transform="translate({x:.2f},{y:.2f})">']

    finders = [(0, 0), (0, n - 7), (n - 7, 0)]

    def in_finder(r, c):
        return any(fr <= r < fr + 7 and fc <= c < fc + 7 for fr, fc in finders)

    # hueco central para la insignia
    hole = 9 if n >= 33 else 7
    h0 = (n - hole) // 2

    def in_hole(r, c):
        return h0 <= r < h0 + hole and h0 <= c < h0 + hole

    dot = m * 0.86
    for r in range(n):
        for c in range(n):
            if matrix[r][c] and not in_finder(r, c) and not in_hole(r, c):
                cx, cy = c * m + (m - dot) / 2, r * m + (m - dot) / 2
                parts.append(
                    f'<rect x="{cx:.2f}" y="{cy:.2f}" width="{dot:.2f}" height="{dot:.2f}" '
                    f'rx="{dot * 0.45:.2f}" fill="{PETROL}"/>'
                )

    for fr, fc in finders:
        ox, oy = fc * m, fr * m
        s = 7 * m
        parts.append(
            f'<rect x="{ox + m / 2:.2f}" y="{oy + m / 2:.2f}" width="{s - m:.2f}" height="{s - m:.2f}" '
            f'rx="{m * 1.9:.2f}" fill="none" stroke="{INK}" stroke-width="{m:.2f}"/>'
        )
        parts.append(
            f'<rect x="{ox + 2 * m:.2f}" y="{oy + 2 * m:.2f}" width="{3 * m:.2f}" height="{3 * m:.2f}" '
            f'rx="{m * 0.9:.2f}" fill="{TEAL}"/>'
        )

    # insignia central: círculo blanco + estrella
    c = n * m / 2
    parts.append(f'<circle cx="{c:.2f}" cy="{c:.2f}" r="{hole * m / 2 - m * 0.2:.2f}" fill="#ffffff"/>')
    parts.append(f'<circle cx="{c:.2f}" cy="{c:.2f}" r="{hole * m / 2 - m * 1.1:.2f}" fill="{TINT}"/>')
    parts.append(f'<path d="{star_path(c, c + m * 0.25, hole * m * 0.30)}" fill="{STAR}"/>')
    parts.append("</g>")
    return "\n".join(parts), n


def qr_only_svg():
    size = 1000
    pad = 60
    g, _ = qr_group(pad, pad, size)
    total = size + 2 * pad
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total} {total}" '
        f'width="{total}" height="{total}"><rect width="100%" height="100%" fill="#ffffff"/>{g}</svg>'
    )


def card_svg():
    W, H = 1050, 1480  # décimas de mm -> A6
    logo_tag = ""
    if LOGO:
        with open(LOGO, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        lw = 560
        lh = lw * 170 / 600
        logo_tag = (
            f'<image x="{(W - lw) / 2:.1f}" y="70" width="{lw}" height="{lh:.1f}" '
            f'href="data:image/png;base64,{b64}"/>'
        )

    qr_size = 520
    qx = (W - qr_size) / 2
    qy = 530
    g, _ = qr_group(qx, qy, qr_size)

    stars = "".join(
        f'<path d="{star_path(W / 2 + (i - 2) * 64, 446, 24)}" fill="{STAR}"/>' for i in range(5)
    )

    steps = [("1", "Abra la cámara"), ("2", "Apunte al código"), ("3", "Toque el enlace")]
    step_tags = []
    col = W / 3
    for i, (num, txt) in enumerate(steps):
        cx = col * i + col / 2
        step_tags.append(
            f'<circle cx="{cx:.1f}" cy="1162" r="30" fill="{TEAL}"/>'
            f'<text x="{cx:.1f}" y="1174" text-anchor="middle" font-family="Lato" font-weight="900" '
            f'font-size="34" fill="#ffffff">{num}</text>'
            f'<text x="{cx:.1f}" y="1240" text-anchor="middle" font-family="Lato" font-weight="700" '
            f'font-size="30" fill="{INK}">{txt}</text>'
        )

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="105mm" height="148mm">
  <rect width="{W}" height="{H}" fill="#ffffff"/>
  {logo_tag}
  <text x="{W / 2}" y="330" text-anchor="middle" font-family="Lato" font-weight="900" font-size="64" fill="{INK}">¿Qué tal su visita?</text>
  <text x="{W / 2}" y="384" text-anchor="middle" font-family="Lato" font-weight="400" font-size="32" fill="{MUTED}">Su opinión en Google ayuda a otros pacientes</text>
  {stars}
  <rect x="{qx - 34}" y="{qy - 34}" width="{qr_size + 68}" height="{qr_size + 68}" rx="40" fill="#ffffff" stroke="{LINE}" stroke-width="4"/>
  {g}
  {''.join(step_tags)}
  <rect x="0" y="{H - 170}" width="{W}" height="170" fill="{PETROL}"/>
  <text x="{W / 2}" y="{H - 98}" text-anchor="middle" font-family="Lato" font-weight="900" font-size="40" fill="#ffffff">¡Muchas gracias!</text>
  <text x="{W / 2}" y="{H - 50}" text-anchor="middle" font-family="Lato" font-weight="400" font-size="26" fill="{TINT}">Google le pedirá la cuenta de su móvil para publicar su opinión</text>
</svg>'''


def main():
    os.makedirs(OUT, exist_ok=True)
    q = qr_only_svg()
    with open(os.path.join(OUT, "qr-resenas.svg"), "w") as f:
        f.write(q)
    cairosvg.svg2png(bytestring=q.encode(), write_to=os.path.join(OUT, "qr-resenas.png"), output_width=2000)

    c = card_svg()
    with open(os.path.join(OUT, "tarjeta-resenas-a6.svg"), "w") as f:
        f.write(c)
    cairosvg.svg2pdf(bytestring=c.encode(), write_to=os.path.join(OUT, "tarjeta-resenas-a6.pdf"))
    cairosvg.svg2png(bytestring=c.encode(), write_to=os.path.join(OUT, "tarjeta-resenas-a6.png"), output_width=1240)
    print("URL:", URL)


if __name__ == "__main__":
    main()
