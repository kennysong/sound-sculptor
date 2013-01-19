import os
import jinja2
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/tween')
def hello():
    return render_template('tweentest.html')

@app.route('/modals')
def modals():
	return render_template('modals.html')

@app.route('/callback')
def modals():
	return render_template('callback.html')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
