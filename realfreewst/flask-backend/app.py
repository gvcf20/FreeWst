# app.py
from flask import Flask, jsonify
import yfinance as yf
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Welcome to the Flask API!'

@app.route('/api/data')
def get_data():

    ticker = 'AAPL'
    data = yf.download(ticker, period='1y')
    print(data)
    result = data.to_json(orient='split')

    return result

if __name__ == '__main__':
    app.run(debug=True)
