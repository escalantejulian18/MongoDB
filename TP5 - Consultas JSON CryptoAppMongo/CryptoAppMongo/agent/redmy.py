import requests
from pymongo import MongoClient

def get_db_connection(uri):
    client = MongoClient(uri) # conexion a mongo
    return client.money # devolvemos la conexion a la bd Money

API_URL = 'https://api.coinmarketcap.com/v1/ticker/' # URL del Json

def get_criptocurencies_from_api():
    r = requests.get(API_URL) # solicitud para extraer el json de la url con requests
    if r.status_code == 200: # ¿respesta? 200: ok
        result = r.json() # asignamos el json
        return result # devolvemos el json resultante
    raise Exception('API Error') # error de solicitud
    
def first_element(elements): # funcion devuelve el primer elemento del json
    return elements[0]

def get_hash(value):
    from hashlib import sha512
    return sha512(value.encode('utf-8')).hexdigest() #devuelve el valor ingresado en forma de codigo

def get_ticker_hash(ticker_data):
    from collections import OrderedDict #recuerda las entradas de orden se agregaron
    ticker_data = OrderedDict(
        sorted( ticker_data.items(), #ordena los elementos de un iterable dado en un orden específico
                key = first_element,
                reverse=False
        )
    )
    ticker_value = ''
    for _, value in ticker_data.items(): #recorremos el json y 
        ticker_value += str(value) #concatenamos todos los valores (transformados a string)
    return get_hash(ticker_value) #devolvemos los valores codificados

def check_exist_tickers(connection, ticker_data): # Chequeo la existencia de tickers
    tickerhash = get_ticker_hash(ticker_data) 
    if connection.data.find_one({'tickerhash' : tickerhash}):
        return True
    return False

def insert_ticker(connection, ticker_data=None): # funcion para insertar los ticker a mongo
    if not ticker_data:
        return False
    if check_exist_tickers(connection, ticker_data): #chequeo
        return False

    ticker_data['tickerhash'] = get_ticker_hash(ticker_data) #incorporamos el nuevo atributo
    ticker_data['rank'] = int(ticker_data['rank']) # convertimos a interos a estos atributos
    ticker_data['last_updated'] = int(ticker_data['last_updated'])

    connection.data.insert_one(ticker_data) #insertamos nuestra collection
    return True

#  Programa

if __name__ == "__main__":
    connection = get_db_connection('mongodb://localhost:27017/')
    tickers = get_criptocurencies_from_api()
    for ticker in tickers:
        insert_ticker(connection, ticker)
    print("Proceso de inserción finalizado...")
