const express = require('express');
const app = express();
const router = express.Router();

const { RelatedImagesController, RootController } = require('./controllers');

router.route('/').get(RootController.show);

router.use('/api/getRelatedImages', RelatedImagesController.all);

module.exports = router;
