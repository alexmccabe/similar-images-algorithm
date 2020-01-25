const express = require('express');
const app = express();
const router = express.Router();

const { RelatedImagesController, RootController } = require('./controllers');
const { isXhrRequest } = require('./middleware');

router.route('/').get(RootController.show);

router.use(
  '/api/getRelatedImages',
  [isXhrRequest],
  RelatedImagesController.all
);

module.exports = router;
