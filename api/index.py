from flask import Flask, request

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    menu_id = request.args.get('id', '')
    
    if not menu_id:
        return "<h1>Test works!</h1><p>Try: ?id=italian1</p>"
    
    # Simple test menu
    if menu_id == "italian1":
        return """
        <html>
        <body>
            <h1>Casa Linga Menu</h1>
            <p>CASSALINGA - Classic Italian pasta</p>
            <p>POLLO RABE - Grilled chicken</p>
        </body>
        </html>
        """
    
    return "<h1>Menu not found</h1>"
