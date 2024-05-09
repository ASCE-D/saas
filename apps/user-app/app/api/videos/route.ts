import { NextRequest, NextResponse } from 'next/server';
// pages/api/videoStats.ts
import axios from 'axios';

async function fetchStatsFromYouTube(videoId: string) {
  const API_KEY = "AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo"; // Replace with your actual API key
  const STAT_URL = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await axios.get(STAT_URL);
    console.log(response)

    return response.data;
  } catch (error) {
    console.error(`Error fetching stats for video ${videoId}:`, error);
    throw error;
  }
}

export  async function GET(req: NextRequest , res:NextResponse) {
  if (req.method === 'GET') {
    const BASE_URL = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=valorant%20clutch%20moment&key=AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo";
    try {
      const response = await axios.get(BASE_URL);
      const videosData = response.data;
  
      const videoStats = videosData.items.map((video:any) => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        console.log(videoId)
        return { videoId, title };
        
      });
  
      await Promise.all(
        videoStats.map(async (videoStat:any) => {
          const statsData = await fetchStatsFromYouTube(videoStat.videoId);
  
          if (statsData.items && statsData.items.length > 0) {
            const statistics = statsData.items[0].statistics;
  
            const videoStatsObject = {
              videoId: videoStat.videoId,
              title: videoStat.title,
              viewCount: parseInt(statistics.viewCount),
              likeCount: parseInt(statistics.likeCount),
              // Add other statistics fields as needed
            };
  
            // Instead of ctx.db.videoStats.create({ data: videoStatsObject });
            // You can save to a database or return the data directly
  
            // For example, to send the data as JSON:
            // res.status(200).json(videoStatsObject);
          } else {
            console.error(`Stats not found for video ${videoStat.videoId}`);
            // Handle the missing stats case appropriately
          }
        })
      );
  
      // Return the videoStats array after processing
     return NextResponse.json(videoStats);
    } catch (error) {
      console.error('Error fetching data from YouTube:', error);
      NextResponse.json({ error: 'Internal Server Error' });
    }
  } else {
   console.log("error")
  }
}
