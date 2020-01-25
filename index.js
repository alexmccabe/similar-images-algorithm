require('dotenv').config();

const express = require('express');
const path = require('path');
const routes = require('./server/routes');

const port = process.env.PORT || process.env.port || '8000';
const app = express();

const paths = {
  static: path.join(__dirname, 'public'),
  views: path.join(__dirname, 'views')
};

app.set('views', paths.views);
app.set('view engine', 'ejs');
app.use('/static', express.static(paths.static));
app.use(routes);

app.listen(port, () => {
  console.log(`App available at http://localhost:${port}`);
});

const { cleanObject, mapObject, omit } = require('./utils/object');

function isItemPossibleMatch(itemData, imageData) {
  const possibleMatches = imageData.reduce((acc, item) => {
    const scoreThreshold = 0.99;
    if (itemData.mid === item.mid && itemData.score > scoreThreshold) {
      acc.push(item);
    }

    return acc;
  }, []);

  if (possibleMatches.length) {
    return true;
  }

  return false;
}

function flatten(data) {
  return Object.keys(data).map(key => {
    return { filename: key, data: data[key] };
  });
}

const data = require('./data.json');
const imageFilename = '13.jpg';
const imageData = data[imageFilename];
const removedImageData = omit(data, imageFilename);
// const flattened = flatten(data);

// console.log(flattened);

const filteredData = mapObject(removedImageData, dataItem => {
  const possibleMatches = dataItem.reduce((acc, item) => {
    if (isItemPossibleMatch(item, imageData)) {
      acc.push(item);
    }

    return acc;
  }, []);

  if (possibleMatches.length) {
    return possibleMatches;
  }
});

// console.log(Object.keys(cleanObject(filteredData)).length);

/**
potentially loop over each item and try and match score for score

1.jpg: [{flower: 0.9}, {badger: 0.5}, {mousemate: 0.1}]
2.jpg: [{flower: 0.89}, {mousemat: 0.15}, {traschan: 0.05}]

In this instance mousemate and flower are in both and within a _range_ so that
we can reasonably assume they're related
*/
