require('dotenv').config();

const express = require('express');
const path = require('path');
const routes = require('./server/routes');

const port = process.env.PORT || process.env.port || '8000';
const app = express();

const paths = {
  static: path.join(__dirname, 'public'),
  tmp: path.join(__dirname, 'tmp'),
  views: path.join(__dirname, 'views')
};

app.set('paths', paths);
app.set('views', paths.views);
app.set('view engine', 'ejs');
app.use('/static', express.static(paths.static));
app.use(routes);

app.listen(port, () => {
  console.log(`App available at http://localhost:${port}`);
});

/**
potentially loop over each item and try and match score for score

1.jpg: [{flower: 0.9}, {badger: 0.5}, {mousemate: 0.1}]
2.jpg: [{flower: 0.89}, {mousemat: 0.15}, {traschan: 0.05}]

In this instance mousemate and flower are in both and within a _range_ so that
we can reasonably assume they're related
*/
