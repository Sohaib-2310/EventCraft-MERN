const express = require('express');
const cors = require('cors');
const router = require('./routes/router')
require('./db/db')

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
// app.get('/', (req, res) => {
//     res.send('Server is running successfully...');
// });

app.use('/api', router);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
