const Busboy = require('busboy');

const data = require('../data.json');
const { cleanObject, mapObject, omit } = require('../../utils/object');

/**
 * Find out if a given object is a potential match to the uploaded image.
 *
 * @param {Object} itemData Object containing Google Cloud Vision
 *                         API information for that image.
 * @param {Array} imageData Uploaded image data.
 * @returns {Boolean}
 */
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

function findPossibleMatches(imageData, imageFilename) {
  if (!imageData) {
    return {};
  }
  // Remove the uploaded image data from the provided image data "pool"
  const removedImageData = omit(data, imageFilename);

  // Loop through "pool" and try to find some possible matches
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

  // Remove any keys from the "pool" that don't have data
  return cleanObject(filteredData);
}

/**
 * Here we would likely make a call to a service that would make a request
 * to the Google Cloud Vision API. Since this has not been implemented as the
 * data is already provided, we simply return the image data.
 *
 * @param {Object} image Uploaded multipart/form-data image
 * @returns {Object} Google Cloud Vision API response data
 */
function getImageData(image, imageFilename) {
  // Pseudo-code
  // return CloudVisionService.sendImage(image)

  return Promise.resolve(data[imageFilename]);
}

// function flatten(data) {
//   return Object.keys(data).map(key => {
//     return { filename: key, data: data[key] };
//   });
// }

// const flattened = flatten(data);

// console.log(flattened);

function all(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file, filename) => {
    getImageData(file, filename)
      .then(data => findPossibleMatches(data, filename))
      .then(data => {
        const responseData = Object.keys(data).map(item => {
          const url = req.protocol + '://' + req.get('host');
          return `${url}/static/images/${item}`;
        });

        res.send(responseData);
      });
  });

  return req.pipe(busboy);
}

module.exports = { all };
