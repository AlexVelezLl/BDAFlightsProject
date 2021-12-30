const express = require('express');
const router = express.Router();

const flightController = require('../controllers/flight');

router.get('/', flightController.getAll);

router.get('/:id', flightController.getOne);

router.post('/', flightController.create);

router.put('/:id', flightController.update);

router.delete('/:id', flightController.delete);

module.exports = router;
