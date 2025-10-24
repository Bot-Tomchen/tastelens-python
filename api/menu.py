from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# GitHub raw URL base
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/Bot-Tomchen/tastelens-python/main/public"

menus = {
    "italian1": {
        "name": "Casa Linga",
        "dishes": [
            {"name": "CASSALINGA", "img": f"{GITHUB_RAW_BASE}/CASSALINGA.png", "desc": "Classic Italian homestyle pasta"},
            {"name": "POLLO RABE", "img": f"{GITHUB_RAW_BASE}/POLLO_RABE.png", "desc": "Grilled chicken with broccoli rabe"}
        ],
    }
}

HTML_TEMPLATE = """<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>{title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; padding: 24px; max-width: 860px; margin: 0 auto; }}
  h1 {{ margin-bottom: 8px; }}
  .dish {{ display: grid; grid-template-columns: 200px 1fr; gap: 16px; align-items: start; margin: 20px 0; }}
  img {{ width: 200px; height: auto; border-radius: 12px; object-fit: cover; }}
  .name {{ font-size: 18px; margin: 0 0 6px; }}
  .desc {{ color: #444; margin: 0; }}
  .note {{ margin-top: 24px; font-size: 13px; color: #666; }}
</style>
</head>
<body>
  <h1>{restaurant_name} Menu</h1>
  {items}
  <p class="note">Scan-to-View by TasteLens • Demo</p>
</body>
</html>
"""

def render_menu(restaurant):
    blocks = []
    for d in restaurant["dishes"]:
        blocks.append(
            f"<div class='dish'>"
            f"<img src='{d['img']}' alt='{d['name']}' />"
            f"<div><h3 class='name'>{d['name']}</h3>"
            f"<p class='desc'>{d['desc']}</p></div>"
            f"</div>"
        )
    return HTML_TEMPLATE.format(
        title=f"{restaurant['name']} Menu",
        restaurant_name=restaurant["name"],
        items="".join(blocks),
    )

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        restaurant_id = params.get("id", [""])[0]
        restaurant = menus.get(restaurant_id)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        if not restaurant:
            self.wfile.write(b"<h1>Menu not found</h1>")
            return
        html = render_menu(restaurant)
        self.wfile.write(html.encode("utf-8"))
