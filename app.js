require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');



// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// setting the spotify-api goes here:


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get('/', function (req, res, next) {
    res.render('index')
});


app.get('/artist-search', (req, res, next) => {
    const { artist } = req.query;
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', { artists : data.body.artists.items })
  })
  .catch(error => console.log('The error while searching artists occurred: ', error));
})



app.get('/albums/:id', (req, res, next) => {
  const { id } = req.params;
  spotifyApi.getArtistAlbums(id)
.then(data => {
  console.log('Albums', data.body);
  res.render('albums', { albums: data.body.items })
}) 
.catch(error => console.error(error))
})



app.get('/albums/:albumId/tracks', (req, res, next) => {

  const { albumId } = req.params;
  spotifyApi.getAlbumTracks(albumId)
.then(data => {
  console.log(data.body);
  res.render('viewtracks', {tracks: data.body.items})
}) 
.catch(error => console.error(error))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
