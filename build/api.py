from flask import Flask
from flask_restful import Resource, Api, reqparse
import pandas as pd
import ast

app = Flask(__name__)
api=Api(app)
# Should the APIs call the relevant function, or just store data?


class fitbit(Resource):
	
	
	pass
	
	
class spotifytoken(Resource):
	
	
	pass
	
class spotifyDeviceID(Resource):
	def get(self):
		return 'test'
	
	pass
	
class test(Resource):
	def get(self):
		return 200
		
	
api.add_resource(fitbit, '/fitbit')
api.add_resource(spotifytoken, '/spotifytoken')
api.add_resource(spotifyDeviceID, '/device')
api.add_resource(test, '/test')

if __name__ == '__main__':
	# This prints an error on every run of the flask server - Production use is intended to be done through something like waitress
	# - For now, we just want to make sure this is working.
	app.run(host='0.0.0.0', port=8080)