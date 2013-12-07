from flask import Flask
from flask.ext.restful import reqparse, abort, Api, Resource
from twitter import *
import tweepy
from decorator import crossdomain
from saveToEvernote import saveToEvernote



app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('content', type=str)

class Twitter(Resource):
    #def get(self):
    #    return {'twitter': 'post method only'}

    @crossdomain(origin='*')
    def post(self):
        args = parser.parse_args()
        content= args['content']
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        api = tweepy.API(auth)
        api.update_status(content)

        return 'posted',202

class Delete(Resource):

    @crossdomain(origin='*')
    def post(self):
        args = parser.parse_args()
        id = args['content']
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        try:
            api = tweepy.API(auth)
            result = api.search(id)
            for tweet in result:
                api.destroy_status(tweet.id)
        except:
            pass

        return 'deleted',204





class History(Resource):
    #def get(self):
    #    return {'history': 'post method only'}

    @crossdomain(origin='*')
    def post(self):
        args = parser.parse_args()
        content= args['content']
        content = [line.strip() for line in content.split('\n') if line.strip()]
        url = saveToEvernote(content)
        print url
        return url,201

class HelloWorld(Resource):
    def get(self):
        return "this is the server for chatapp. https://github.com/shellyan/cs-339-chatapp"

api.add_resource(HelloWorld, '/')
api.add_resource(History, '/history')
api.add_resource(Twitter, '/twitter')
api.add_resource(Delete, '/delete')




if __name__ == '__main__':
    app.run(debug=True)




