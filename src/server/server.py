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
        return {'hello': 'world nima'}
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

api.add_resource(Twitter, '/twitter')


if __name__ == '__main__':
    app.run(debug=True)

#
#HOST = ''                 # Symbolic name meaning the local host
#PORT = 50007              # Arbitrary non-privileged port
#s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#s.bind((HOST, PORT))
#s.listen(1)
#conn, addr = s.accept()
#print 'Connected by', addr
#while 1:
#    data = conn.recv(1024)
#    print data
#    if not data: break
#    conn.send(data)
#conn.close()


