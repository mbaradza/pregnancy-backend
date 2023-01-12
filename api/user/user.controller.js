const userService = require('../services/user.service');

  exports.getAll = (req, res, next) => {
      userService.getAll()
          .then(users => { res.json(users); })
          .catch(err => next(err));
  };

  exports.getOne = (req, res, next) => {
      userService.getOne(req.params.id)
          .then(user => user ? res.json(user) : res.sendStatus(404))
          .catch(err => next(err));
  };

  exports.update = (req, res, next) => {
      userService.update(req.params.id, req.body)
          .then((user)=> res.status(201).json(user))
          .catch(err => next(err));
  };

  exports.delete = (req, res, next) => {
      userService.delete(req.params.id)
          .then(()=> res.json({}))
          .catch(err => next(err));
  };