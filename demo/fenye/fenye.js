const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const port = 8001
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getSearchRes', (req, res) => {
  // console.log(req);
  const params = req.query

  axios.get('http://47.103.29.206:3000/search', { params }).then((response) => {
    // console.log(response);
    // console.log(response.data.result.songs);
    const data = response.data.result
    // console.log(data);
    if (data.songCount === 0) {
      res.json({
        code: 200,
        songs: [],
        hasMore: false,
        songCount: 0,
      })
    } else {
      const songs = response.data.result.songs
      // 三元运算符 到最后是没有歌曲的 map会报错
      const handleSongs =songs? songs.map((item) => {
        // console.log(item.artists);
        return {
          id: item.id,
          songName: item.name,
          // singer:item.artists  一个对象，里面有一个及以上数组，每一个数组是一个歌手
          singer: item.artists.map((list) => {
            return list.name
          }).join('/')  //数组合并
        }
      }):[]
      res.json({
        code: 200,
        songs: handleSongs.filter((item,index,arr)=>{
          if(!(index%2==0||index%3==0)){
            return item
          } 
        }),
        hasMore: data.hasMore,
        songCount: data.songCount
      })
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/getSearchRes`)
})