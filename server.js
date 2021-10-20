const express = require('express');
const app = express();
const fs = require('fs');

const albums = require("./albums.json");

const getAllAlbums = (req, res) => {
    res.status(200).send(albums);
}

const getAlbumById = (req, res) => {
    const id = parseInt(req.params.id);
    const albumFound = albums.find((a) => a.albumId === id);
    if (albumFound) {
        res.status(200).send(albumFound);
    } else {
        res.status(404).send("Sorry!, We cannot find this Album!")
    }
}

const createNewAlbum = (req, res) => {
    const newAlbum = req.body

    const maxId = Math.max(...albums.map((a) => a.albumId))

    const sameAlbum = albums.find((name) => name.collectionName.toLowerCase() === newAlbum.collectionName.toLowerCase())
    
    if (sameAlbum) {
        res.status(400).send("The Album already exist!!");
    } else {
        newAlbum.albumId = maxId + 1;
        albums.push(newAlbum);
    }

    fs.writeFileSync("./albums.json", JSON.stringify(albums, null, 4));
    res.status(200).send(albums)
}

const deletedAlbum = (req, res) => {
    const albumId = parseInt(req.params.id);

    const foundAlbum = albums.find((a) => a.albumId === albumId);

    if (foundAlbum) {
        albums.splice(albums.indexOf(foundAlbum), 1)
        fs.writeFileSync("./albums.json", JSON.stringify(albums, null, 4));
        res.status(200).send(albums)
    } else {
        res.status(404).send("Sorry!, We cannot find the given id!!")
    }
}

const updateAlbum = (req, res) => {
    const albumId = parseInt(req.params.id);

    const findingId = albums.find((a) => a.albumId === albumId);

    findingId.collectionName = req.body.collectionName;

    fs.writeFileSync("./albums.json", JSON.stringify(albums, null, 4));

    res.status(200).send(albums)
}

app.use(express.json());
app.get("/albums", getAllAlbums);
app.get("/albums/:id", getAlbumById);
app.post("/albums", createNewAlbum);
app.delete("/albums/:id", deletedAlbum);
app.put("/albums/:id", updateAlbum);

app.listen(3000, () => console.log("Server is up and running at port 3000"))