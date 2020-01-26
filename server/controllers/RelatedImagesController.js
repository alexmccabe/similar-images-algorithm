const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

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

function all(req, res, next) {
  const busboy = new Busboy({
    headers: req.headers,
    limits: { files: 1, fileSize: 50000 }
  });

  /**
   * There are some things missing from this handler:
   * 1. File type validation. We should only allow images
   * 2. Set file extension after up
   * 3. Delete file after uploading
   * 4. Handle if user aborts request mid-upload (should delete file)
   */
  busboy.on('file', async (fieldname, file, filename) => {
    const tmpDir = req.app.get('paths').tmp;
    let filePath = `${tmpDir}/${Date.now()}`;

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    file.pipe(fs.createWriteStream(filePath));

    await getImageData(file, filename)
      .then(data => findPossibleMatches(data, filename))
      .then(data => {
        const responseData = Object.keys(data).map(item => {
          const url = req.protocol + '://' + req.get('host');
          return `${url}/static/images/${item}`;
        });

        res.send({ data: responseData });
      });
  });

  return req.pipe(busboy);
}

module.exports = { all };
