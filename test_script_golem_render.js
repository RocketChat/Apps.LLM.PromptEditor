const express = require('express');
const path = require('path');
const cors = require('cors')


const app = express();
const port = process.env.PORT || 8080;

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors());
app.use(cors({ origin: 'http://localhost:3000' }));
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
