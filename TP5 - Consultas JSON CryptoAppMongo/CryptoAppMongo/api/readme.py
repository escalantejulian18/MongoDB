#Estructura base del API-REST
from pymongo import MongoClient
from flask import Flask, jsonify, render_template,request,redirect,url_for
from bson.json_util import dumps

def get_db_connection(uri):
    client = MongoClient(uri)
    return client.money

app = Flask(__name__)

connection = get_db_connection('mongodb://localhost:27017/')

def get_documents():
    params = {}
    name = request.args.get('name', '')
    limit = request.args.get('limit', 0)
    if name:
        params.update({'name': name})
    cursor = connection.data.find(params, {'_id': 0, 'ticker_hash': 0}).limit(limit)
    return list(cursor)

def get_top20():
    params = {}
    name = request.args.get('name', '')
    limit = request.args.get('limit', 0)
    if name:
        params.update({'name': name})
    cursor = connection.data.find(params, {'_id': 0, 'ticker_hash': 0}).limit(20)
    return list(cursor)

def get_first():
    params = {}
    name = request.args.get('name', '')
    limit = request.args.get('limit', 0)
    if name:
        params.update({'name': name})
    cursor = connection.data.find(params, {'_id': 0, 'ticker_hash': 0}).limit(1)
    return list(cursor)

@app.route("/")
@app.route('/index')
def index():
    title = "All Tickers"
    documents = get_documents()
    a1="active"
    return render_template('index.html',a1=a1,documents=documents,t=title)

@app.route('/topv')
def topv():
    title = "Top 20 Tickers"
    documents = get_top20()
    a2="active"
    return render_template('topv.html',a2=a2,documents=documents,t=title)

@app.route('/first')
def first():
    title = "Top First Tickers"
    documents = get_first()
    a3="active"
    return render_template('first.html',a2=a3,documents=documents,t=title)

@app.route("/search", methods=['GET'])
def search():
    title = "Ticker Searched"
    key=request.values.get("key")
    documents = connection.data.find({'name':key})
    return render_template('search.html',documents=documents,t=title)

@app.route("/remove", methods=['GET'])
def remove():
    title = "Ticker Removed"
    key=request.values.get("key")
    connection.data.remove({"name":key})
    return redirect("/")

# Programa

if __name__ == "__main__":
    app.run(debug=True)