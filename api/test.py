from flask import Flask

app = Flask(__name__)

@app.route('/')
@app.route('/api/test')
def test():
    return "<h1>Python works!</h1>"
