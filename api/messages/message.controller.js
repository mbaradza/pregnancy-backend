const messageService = require("../services/message.service");

exports.create = (req, res, next) => {
    messageService.create(req.body)
        .then(message => res.status(201).json(message))
        .catch(err => next(err));
};

exports.getAll = (req, res, next) => {
    messageService.getAll()
        .then(messages => res.json(messages))
        .catch(err => next(err));
};

exports.getOne = (req, res, next) => {
    messageService.getOne(req.params.id)
        .then(message => message ? res.json(message) : res.status(404).json({ message: 'not found'}))
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    messageService.update(req.params.id, req.body)
        .then((message)=> res.json(message))
        .catch(err => next(err));
};

exports.delete = (req, res, next) => {
    messageService.delete(req.params.id)
        .then(()=> res.json({}))
        .catch(err => next(err));
};

