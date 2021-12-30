const express = require('express');
const router = express.Router();

const passengerController = require('../controllers/passenger');

router.get('/', passengerController.getAll);

router.get('/:id', passengerController.getOne);

router.post('/', passengerController.create);

router.put('/:id', passengerController.update);

router.delete('/:id', passengerController.delete);

module.exports = router;
