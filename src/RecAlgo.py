import requests
import json

# ----------------------------
# SET BPM HERE
BPM = 150
# ----------------------------

#These need to be replaced for others
CLIENT_ID = ''
CLIENT_SECRET = ''

#-------------------------------------------------------

AUTH_URL = 'https://accounts.spotify.com/api/token'
# POST
auth_response = requests.post(AUTH_URL, {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'scope': 'user-read-playback-state app-remote-control user-modify-playback-state user-read-currently-playing user-read-playback-position user-top-read user-read-recently-played',
})
# convert the response to JSON
auth_response_data = auth_response.json()

# save the access token
access_token = auth_response_data['access_token']
headers = {
    'Authorization': 'Bearer {token}'.format(token=access_token)
}

####THROWS ERROR 500#####
#needs fix
req1 = requests.get('https://api.spotify.com/v1/me/top/tracks',
                    headers=headers,
                    params={'limit': '1'})
print(req1)
#following code needs error 500 to  be fixed
#topSong=req1.json()
#topId = get id from json




#change to use topId as seed rather than genres when error 500 is fixed
# Request song list
req2 = requests.get('https://api.spotify.com/v1/recommendations',
                    headers=headers,
                    params={'limit': '1', 'market': 'US', 'seed_genres': 'punk', 'target_tempo': BPM})
songs = req2.json()
print('Recommendation:')
print(songs['tracks'][0]['name'], 'by', songs['tracks'][0]['artists'][0]['name'])
songName = songs['tracks'][0]['name']
songId = songs['tracks'][0]["id"]
# Request Info about song (for BPM)
req3 = requests.get('https://api.spotify.com/v1/audio-features/'+songId,
                    headers=headers)
songInfo = req3.json()
songBPM=songInfo['tempo']
print('    BPM:',songBPM)

