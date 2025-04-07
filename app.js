

//load youtube IFrame player API

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const videoCardContainer = document.querySelector('.video-container');
const videoPlayerSection  =  document.getElementById('videoPlayerSection');
const mainVideoContainer = document.getElementById('mainVideoContainer');


let api_key = "AIzaSyAwtDxYp04PzZLKXKPbDoj87yOjOAJosD0";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";





let youtubePlayer;


window.addEventListener('load', () => {
    fetchVideos();
});

function fetchVideos() {
    fetch(video_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 100,
        regionCode: 'IN'
    }))
    .then(res => res.json())
    .then(data => {
        data.items.forEach(item => {
            getChannelIcon(item);
        });
    })
    .catch(err => console.error("Fetch Videos Error:", err));
}

function getChannelIcon(video_data) {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    })
    .catch(error => {
        console.error("Channel Icon Fetch Error:", error);
    });
}

const makeVideoCard = (data) => {
    const videoCard = document.createElement('div');
    videoCard.className = 'video';
    videoCard.innerHTML = `
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="thumbnail">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="channel icon"/>
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    `;


    videoCard.addEventListener('click',()=>{
        currentVideoData = data;

        openVideoPlayer(data.id)

    })


    videoCardContainer.appendChild(videoCard);
};



function openVideoPlayer(videoId){

    videoPlayerSection.style.display  = 'block';
    mainVideoContainer.style.display ='none';

    document.querySelector('.filters').style.display = 'none';

    //intitialize the youtube player

    if(!youtubePlayer){
        youtubePlayer = new YT.Player('videoPlayer', {

            height : '500',
            width:'100%',
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'rel' : 0
            }


        })
    }else{
        youtubePlayer.loadVideoById(videoId);
    }



    console.log(currentVideoData)



    document.getElementById('videoTitle').textContent = currentVideoData.snippet.title
    document.getElementById('channelIconDetail').src = currentVideoData.channelThumbnail 
    document.getElementById('channelTitleDetail').textContent = currentVideoData.snippet.channelTitle;
    document.getElementById('video-description').textContent = currentVideoData.snippet.description;

}
