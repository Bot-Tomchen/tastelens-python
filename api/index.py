from flask import Flask, request

app = Flask(__name__)

# GitHub raw URL base
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/Bot-Tomchen/tastelens-python/main/public"

menus = {
    "italian1": {
        "name": "Casa Linga",
        "dishes": [
            {
                "name": "CASSALINGA", 
                "img": GITHUB_RAW_BASE + "/CASSALINGA.png", 
                "desc": "Classic Italian homestyle pasta"
            },
            {
                "name": "POLLO RABE", 
                "img": GITHUB_RAW_BASE + "/POLLO_RABE.png", 
                "desc": "Grilled chicken with broccoli rabe"
            }
        ],
    }
}

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
    
    html = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>{restaurant['name']} Menu</title>
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
  <h1>{restaurant['name']} Menu</h1>
  {''.join(blocks)}
  <p class="note">Scan-to-View by TasteLens • Demo</p>
</body>
</html>
"""
    return html

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    menu_id = request.args.get('id', '')
    
    if not menu_id:
        return "<h1>Welcome to TasteLens</h1><p>Add ?id=italian1 to view a menu</p>"
    
    restaurant = menus.get(menu_id)
    
    if not restaurant:
        return "<h1>Menu not found</h1><p>Available menus: italian1</p>", 404
    
    html = render_menu(restaurant)
    return html
