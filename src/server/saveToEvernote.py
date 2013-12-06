from evernote.api.client import EvernoteClient
from evernote.edam.type.ttypes import Note
from evernote.edam.error.ttypes import EDAMUserException,EDAMSystemException,EDAMNotFoundException
def saveToEvernote(history):
    EN_URL = 'https://sandbox.evernote.com'

    dev_token = "S=s1:U=8d5df:E=14a1ce2575a:C=142c5312b5c:P=1cd:A=en-devtoken:V=2:H=c3fba302a245ad5e2aa489bc02b3b873"
    client = EvernoteClient(token=dev_token)
    userStore = client.get_user_store()
    note_store = client.get_note_store()

    note = Note()
    note.title = "chat history"
    note.content = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">'
    note.content += '<en-note>'+history+'</en-note>'
    note = note_store.createNote(note)
    print history


    def getUserShardId(authToken, userStore):
	"""
	Get the User from userStore and return the user's shard ID
	"""
	try:
		user = userStore.getUser(authToken)
	except (EDAMUserException, EDAMSystemException), e:
		print "Exception while getting user's shardID:"
		print type(e), e
		return None

	if hasattr(user, 'shardId'):
		return user.shardId
	return None


    def shareSingleNote(authToken, noteStore, userStore, noteGuid, shardId=None):
	"""
	Share a single note and return the public URL for the note
	"""
	if not shardId:
		shardId = getUserShardId(authToken, userStore)
		if not shardId:
			raise SystemExit

	try:
		shareKey = noteStore.shareNote(authToken, noteGuid)
	except (EDAMNotFoundException, EDAMSystemException, EDAMUserException), e:
		print "Error sharing note:"
		print type(e), e
		return None

	return "%s/shard/%s/sh/%s/%s" % \
		(EN_URL, shardId, noteGuid, shareKey)




    return shareSingleNote(dev_token, note_store, userStore, note.guid, shardId=None)

