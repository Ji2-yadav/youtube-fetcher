from flask import Flask, request, jsonify
from flask_cors import CORS
from googleapiclient.discovery import build
from google.oauth2 import service_account
from datetime import datetime
from pprint import pprint
import time
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your Google API credentials (replace 'your-credentials.json' with your actual credentials file)
api_service_name = "youtube"
api_version = "v3"
DEVELOPER_KEY = "AIzaSyB6OyuDSg7Ms3ALTT1fo-fhMmVgGI9afwg"

youtube_api = build(api_service_name, api_version, developerKey=DEVELOPER_KEY)

@app.route('/callback', methods=['POST'])
def callback():
    try:
        data = request.get_json()
        name = data.get('name')
        mobile = data.get('mb')
        print(name, mobile)
        time.sleep(2)
        result = "success"

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/analyze-video', methods=['POST'])
def analyze_video():
    try:
        data = request.get_json()
        video_link = data.get('videoLink')
        video_id = extract_video_id(video_link)

        video_metrics, channel_metrics = get_metrics(video_id)
        video_rank = get_video_rank(video_metrics, channel_metrics)
        video_metrics['rank'] = video_rank
        result = {
            'video_metrics': video_metrics,
            'channel_metrics' : channel_metrics
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_video_id(video_link):
    if 'youtube.com' in video_link:
        video_id = video_link.split('v=')[-1]
    elif 'youtu.be' in video_link:
        video_id = video_link.split('/')[-1]
    else:
        raise ValueError('Invalid YouTube video link')

    return video_id

def get_metrics(video_id):
    response = youtube_api.videos().list(
        part='snippet,statistics',
        id=video_id
    ).execute()

    video_data = response['items'][0]

    channel_id = video_data['snippet']['channelId']
    channel_metrics = get_channel_metrics(channel_id)
    video_metrics = get_video_metrics(video_data, channel_metrics['subscriberCount'])

    return video_metrics, channel_metrics


def calculate_earnings(metrics, subscribers):
    subscriber_count = int(subscribers)
    # subscriber_count = 100000000
    views = int(metrics['views'])
    comments = int(metrics['comments'])
    likes = int(metrics['likes'])

    earnings = min(subscriber_count, views) + 10 * comments + 5 * likes
    return earnings

def get_channel_metrics(channel_id):

    channel_response = youtube_api.channels().list(
        part='statistics',
        id=channel_id
    ).execute()
    channel_data = channel_response['items'][0]
    subscribers  = channel_data['statistics']['subscriberCount']
    top_videos_data = top_videos(channel_id, subscribers )

    # pprint(top_videos_data)
    channel_metrics = {
        'subscriberCount': subscribers,
        'top_data': top_videos_data
    }

    return channel_metrics

def get_video_metrics(video_data, subscribers):
    date = video_data['snippet']['publishedAt']
    youtube_date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    formatted_date = youtube_date.strftime("%B %d, %Y")
    metrics = {
        'title': video_data['snippet']['title'],
        'thumbnail': video_data['snippet']['thumbnails']['medium']['url'], 
        'likes': video_data['statistics']['likeCount'],
        'comments': video_data['statistics']['commentCount'],
        'views': video_data['statistics']['viewCount'],
        'uploadedDate': formatted_date
    }
    earnings = calculate_earnings(metrics, subscribers)
    metrics['earnings'] = earnings
    return metrics


def top_videos(channel_id, subscribers):
    try:
        videos_response = youtube_api.search().list(
            part='snippet',
            channelId=channel_id,
            order='viewCount',
            type='video',
            maxResults=5
        ).execute()

        top_videos_data = []
        for video_data in videos_response['items']:
            video_id = video_data['id']['videoId']
            
            video_response = youtube_api.videos().list(
                part='snippet,statistics',
                id=video_id
            ).execute()

            video_snippet = video_response['items'][0]['snippet']
            video_statistics = video_response['items'][0]['statistics']

            date = video_snippet['publishedAt']
            youtube_date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
            formatted_date = youtube_date.strftime("%B %d, %Y")
            video_info = {
                'title': video_snippet['title'],
                'thumbnail': video_snippet['thumbnails']['medium']['url'], 
                'views': video_statistics['viewCount'],
                'likes': video_statistics.get('likeCount', 0),
                'comments': video_statistics.get('commentCount', 0),
                'uploadedDate': formatted_date
            }
            earnings = calculate_earnings(video_info, subscribers)
            video_info['earnings'] = earnings

            top_videos_data.append(video_info)
        sorted_data = sorted(top_videos_data, key=lambda x: x['earnings'], reverse=True)
        for i, item in enumerate(sorted_data):
            item['rank'] = i + 1

        return sorted_data

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def get_video_rank(video_metrics, channel_metrics):
    rank = 0
    earnings = video_metrics['earnings']
    for i, item in enumerate(channel_metrics['top_data']):
        if(earnings<item['earnings']):
            rank +=1
    rank +=1
    return rank

if __name__ == '__main__':
    app.run(debug=True)
