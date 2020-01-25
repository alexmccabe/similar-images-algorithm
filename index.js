const { mapObject, omit } = require('./utils');

function isItemPossibleMatch(itemData, imageData) {
  const possibleMatches = imageData.reduce((acc, item) => {
    if (itemData.mid === item.mid && itemData.score > 0.985) {
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
const imageFilename = '1.jpg';
const imageData = data[imageFilename];
const removedImageData = omit(data, imageFilename);
// const flattened = flatten(data);

// console.log(flattened);

const filteredData = mapObject(removedImageData, (dataItem, key) => {
  const possibleMatches = dataItem.reduce((acc, item) => {
    if (isItemPossibleMatch(item, imageData)) {
      acc.push(item);
    }

    return acc;
  }, []);

  return possibleMatches;
});

console.log(filteredData);

/**
potentially loop over each item and try and match score for score

1.jpg: [{flower: 0.9}, {badger: 0.5}, {mousemate: 0.1}]
2.jpg: [{flower: 0.89}, {mousemat: 0.15}, {traschan: 0.05}]

In this instance mousemate and flower are in both and within a _range_ so that
we can reasonably assume they're related
*/
