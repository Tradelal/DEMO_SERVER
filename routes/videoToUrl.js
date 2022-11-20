const express = require('express');
const router = express.Router();
const videoModel = require("../model/video.model");
const { google } = require("googleapis");
const path = require('path');
const fs = require('fs');

router.post('/videotoUrl', async (req, res) => {
    const { fileUrl, videoTitle } = req.body;
    var filePath;


    const newVideo = await videoModel.create({
        videoTitle,
        videoStatus: false
    });

    res.status(200).json({ message: "Meeting added! 🟢" });

    const CLIENT_ID = '821652065653-m9an524mbq29p0mq5sto2lv6m73v0tpa.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

    const REFRESH_TOKEN = '1//04Tzp6RVnCVySCgYIARAAGAQSNwF-L9IrmwGW3NGIBjXVfqIJuiRTFnpKr4Y4V4KicRxP7SX32JwBrYSzmLYwaEMBsRLNEG5h2qo';

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
    });

    var resultText = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
        resultText += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    // upload function

    try {
        const response = await drive.files.create({
            requestBody: {
                name: resultText,
                mimeType: 'image/jpg',
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(fileUrl),
            },
        });

        filePath = response.data.id;

        const fileId = filePath;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink',
        });

        const video = await videoModel.findOneAndUpdate({ videoTitle: videoTitle }, { videoUrl: result.data.webViewLink, videoStatus: true }, {
            new: true
        });
    } catch (error) {
        console.log(error.message);
    }

})

module.exports = router