const registrantMessageService = require("../services/registrant_message.service");

exports.create = (req, res, next) => {
    registrantMessageService.create(req.body)
        .then(registrantMessage => res.json(registrantMessage))
        .catch(err => next(err));
};

exports.getAll = (req, res, next) => {
    registrantMessageService.getAll()
        .then(registrantMessages => res.json(registrantMessages))
        .catch(err => next(err));
};


exports.getOne = (req, res, next) => {
    registrantMessageService.getOne(req.params.id)
        .then(registrantMessage => registrantMessage ? res.json(registrantMessage) : res.status(404).json({ message: 'not found'}))
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    registrantMessageService.update(req.params.id, req.body)
        .then((registrantMessage)=> res.json(registrantMessage))
        .catch(err => next(err));
};

exports.delete = (req, res, next) => {
    registrantMessageService.delete(req.params.id)
        .then(()=> res.json({}))
        .catch(err => next(err));
};

