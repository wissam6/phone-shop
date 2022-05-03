const express = require('express');
const app = express();
//const router = require('express').Router();
//router.post(etc)

app.listen(3000);

app.get('/', (req,res) => {
    console.log('listening');
});