const express = require('express');
const app = express();
const router = express.Router();

const { RelatedImagesController, RootController } = require('./controllers');
const { isXhrRequest } = require('./middleware');

router.use((req, res, next) => {
  res.locals = {
    apiUrl: req.protocol + '://' + req.get('host')
  };

  next();
});

router.route('/').get(RootController.show);

router.post(
  '/api/getRelatedImages',
  [isXhrRequest],
  RelatedImagesController.all
);

module.exports = router;
