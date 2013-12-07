__author__ = 'shellyan'

# == OAuth Authentication ==
#
# This mode of authentication is the new preferred way
# of authenticating with Twitter.

# The consumer keys can be found on your application's Details
# page located at https://dev.twitter.com/apps (under "OAuth settings")
consumer_key="jirJSDlasEBd6MEeXc4hsA"
consumer_secret="8xfno82XzgfJaSNXsS3u0kuIj8RaKuNBsYHbrIavkzs"

# The access tokens can be found on your applications's Details
# page located at https://dev.twitter.com/apps (located
# under "Your access token")
access_token="2231696286-WWXIn8HhCVQ4L44XU7Z1kBgy7JZqSNE6VtXmjaZ"
access_token_secret="jvXX6MpqihlHA0h0pMmwT3S33C44hDuEUShxZSJ06iza8"


#auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
#auth.set_access_token(access_token, access_token_secret)
#api = tweepy.API(auth)

# If the authentication was successful, you should
# see the name of the account print out
#print api.me().name

# If the application settings are set for "Read and Write" then
# this line should tweet out the message to your account's
# timeline. The "Read and Write" setting is on https://dev.twitter.com/apps
#api.update_status('Updating using OAuth authentication via Tweepy!')
