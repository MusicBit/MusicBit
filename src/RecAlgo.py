#pip install spotipy --upgrade
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import random
from typing import NamedTuple
import time


# ----------------------------
# SET BPM HERE
BPM = 150
# ----------------------------

#These need to be replaced for others
CLIENT_ID = ''
CLIENT_SECRET = ''

#----------------------------------

class Song(NamedTuple):
    name: str
    artist: str
    id: str
    bpm: int
    uri: str
#------------------------------------
blackList=[]
scope = 'user-top-read user-modify-playback-state user-read-playback-state'
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=CLIENT_ID,client_secret=CLIENT_SECRET,redirect_uri='http://127.0.0.1:9090',scope=scope))

def getRecommendation():
    if len(blackList)==0:
        topSongs = sp.current_user_top_tracks(time_range='medium_term',limit=50)
        randTopSong=topSongs['items'][random.randint(0,49)]
        print("Chosen seed:",randTopSong['name'],'by',randTopSong['artists'][0]['name'])
        seedID=str(randTopSong['id'])
    else:
        seedID=blackList[len(blackList)-1]
    recommendations = sp.recommendations(seed_tracks={seedID},limit=20,target_tempo=BPM,min_tempo=BPM-10,max_temp=BPM+10)
    recIDs=[]
    for x in range(20):
        recIDs.append(recommendations['tracks'][x]['id'])

    songInfo=sp.audio_features(tracks=recIDs)
    songList=[]
    for k in range(20):
        flag=True
        curName=recommendations['tracks'][k]['name']
        curArtist=recommendations['tracks'][k]['artists'][0]['name']
        curID=recommendations['tracks'][k]['id']
        curBPM=songInfo[k]['tempo']
        curURI=recommendations['tracks'][k]['uri']
        if len(blackList)==0:
            songList.append(Song(curName,curArtist,curID,curBPM,curURI))
        else:
            for z in range(len(blackList)):
                if curID==blackList[z]:
                    flag=False
            if flag:
                songList.append(Song(curName,curArtist,curID,curBPM,curURI))
    closestBPM=0
    closestSong=0
    for j in range(len(songList)):
        if abs(songList[j].bpm-BPM)<abs(closestBPM-BPM):
            closestBPM = songList[j].bpm
            closestSong = j
    print('Closest Song:',songList[closestSong].name,'by',songList[closestSong].artist)
    print('    BPM',songList[closestSong].bpm)
    blackList.append(songList[closestSong].id)
    return songList[closestSong]


def playSong(song,device):
    dummyList=[]
    dummyList.append(song.uri)
    sp.start_playback(device_id=device,uris=dummyList)


def getDevice():
    result=sp.current_playback()
    return result['device']['id']


def nextCheck():
    print('checking playback')
    result=sp.current_playback()
    return result['item']['duration_ms']-result['progress_ms']



def qNextSong(song,device):
    result=sp.add_to_queue(uri=song.uri,device_id=device)


deviceID=getDevice()
print('Device Found:',deviceID)
songToPlay=getRecommendation()
playSong(songToPlay,deviceID)
flag=False
curentLoop=1
while True:
    timeRemaining=nextCheck()
    if timeRemaining<=30000 and flag==False:
        try:
            flag=True
            BPM=random.randint(80,170) ##USED FOR TESTING REMOVE LATER
            print('Random BPM:',BPM)
            songToPlay=getRecommendation()
            qNextSong(songToPlay,deviceID)
            curentLoop=curentLoop+1
            if curentLoop>20:
                blackList.remove(blackList[0])
                print('song removed from blacklist')
        except:
            print('Error Caught')
    if timeRemaining>30000:
        flag=False
        time.sleep(25)
    else:
        time.sleep(25)