const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking');

router.get('/', bookingController.getAll);

router.get('/:id', bookingController.getOne);

router.post('/', bookingController.create);

router.put('/:id', bookingController.update);

router.delete('/:id', bookingController.delete);

module.exports = router;
