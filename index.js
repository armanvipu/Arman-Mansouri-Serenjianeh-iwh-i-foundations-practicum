const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HS_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-42381374';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const params = {
        properties: 'name,author,summary',
        limit: 100
    };

    try {
        const response = await axios.get(url, { headers, params });
        const records = response.data.results;
        res.render('homepage', { title: 'Books | HubSpot Practicum', records });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.send("Something goes wrong with fetching books' records");
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Book Form' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-42381374';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const data = {
        properties: {
            name: req.body.name,
            author: req.body.author,
            summary: req.body.summary
        }
    };

    try {
        await axios.post(url, data, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Something goes wrong with creating book record');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));