'use strict'
const router = require('express').Router()
const { userController } = require('@controllers/user')
const { itemController } = require('@controllers/item')
const { ratingController } = require('@controllers/rating')
const { recommendationController } = require('@controllers/recommendation')

router.post('/add-user', userController.addUser)
router.post('/add-item', itemController.addItem)
router.post('/add-rating', ratingController.addRating)
router.post('/get-recommendations', recommendationController.getRecommendations)
router.post('/trigger-projection-and-knn', recommendationController.triggerProjectionAndKNN)
router.post('/set-unique-constraints', recommendationController.setUniqueConstraints)
router.post('/get-user-emails', userController.getUserEmails)
router.post('/recompute-content-similarity', recommendationController.recomputeContentSimilarity)
router.post('/get-item-page-recommendations', recommendationController.getItemPageRecommendations)
module.exports = router
