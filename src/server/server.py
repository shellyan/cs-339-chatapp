from flask import Flask
from flask.ext.restful import reqparse, abort, Api, Resource
from twitter import *
from decorator import crossdomain
app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('content', type=str)



class Twitter(Resource):
    def get(self):
        return {'twitter': 'post method only'}
    @crossdomain(origin='*')
    def post(self):
        args = parser.parse_args()
        content= args['content']
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        api = tweepy.API(auth)
        api.update_status(content)
        print content
        return 'posted',201


class History(Resource):
    def get(self):
        return {'history': 'post history'}
    @crossdomain(origin='*')
    def post(self):
        from saveToEvernote import saveToEvernote
        args = parser.parse_args()
        content= args['content']
        url = saveToEvernote(content)
        print url
        return url,201

class HelloWorld(Resource):
    def get(self):
        return 'this is the server for chatapp. https://github.com/shellyan/cs-339-chatapp'

api.add_resource(HelloWorld, '/')
api.add_resource(Twitter, '/twitter')
api.add_resource(History, '/history')


if __name__ == '__main__':
    app.run(debug=True)




