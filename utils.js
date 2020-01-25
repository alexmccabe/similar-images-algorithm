function mapObject(object, cb) {
  return Object.keys(object).reduce((acc, key) => {
    acc[key] = cb(object[key], key);

    return acc;
  }, {});
}

function omit(object, key) {
  const { [key]: _, ...rest } = object;

  return rest;
}

module.exports = {
  mapObject,
  omit
};
