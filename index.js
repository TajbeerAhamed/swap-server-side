const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middle Wares //
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Swap Server site is Running')
})

app.listen(port, () => {
    console.log(`Swap Server site is Running on ${port}`);
})