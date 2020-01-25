/**
 * Remove any null or undefined values from the provided object.
 *
 * @param {Object} obj Input object
 * @returns {Object} New object cleared of any null or undefined values
 */
function cleanObject(obj) {
  let cleaned = {};

  mapObject(obj, (element, key) => {
    if (element !== null && typeof element !== 'undefined') {
      cleaned[key] = element;
    }
  });

  return cleaned;
}

/**
 * Loop over an object and perform a callback on each element in the
 * provided object.
 *
 * @param {Object} obj Input object
 * @param {Function} cb Function to perform against each element
 * @returns {Object} New object with updated values
 */
function mapObject(obj, cb) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = cb(obj[key], key);

    return acc;
  }, {});
}

/**
 * Remove a given key from provided object
 *
 * @param {Object} obj Input object
 * @param {String} key Key to omit from given object
 */
function omit(obj, key) {
  const { [key]: _, ...rest } = obj;

  return rest;
}

module.exports = {
  cleanObject,
  mapObject,
  omit
};
