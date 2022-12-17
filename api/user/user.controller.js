const userService = require('../services/user.service');
const sessionManager = require('../../helper/sessionManager');

exports.login = async (req, res, next) => {
        
     
    let session = req.session;
    
    let previousSessionExpired = await sessionManager.sessionExpired(session,req.body.email)
        userService.authenticate(req.body, previousSessionExpired)
        .then(async (user) => {
            if(user && user.token){
                sessionManager.createSession(req,session,user)    
            }
            
            user && user.token ? res.json(user) : user && user.status?res.json(user):res.status(401).json({ message: 'Email or password is incorrect' })
        })
        .catch(err => next(err));
       
 
};


  exports.create = (req, res, next) => {
      userService.create(req.body)
          .then(user => user._id ? res.json(user) : res.status(user.status?user.status:409).json(user))
          .catch(err => next(err));

  };

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

  
exports.emailRegistration = (req, res, next) => {

    userService.checkEmailRegistration(req.params.email)
      .then((u) =>(
        u ? null : res.json({ msg: 'Email address not registered.' }),
        !u ? null : res.json({ authenticated:false,activated: u.password ? true : false, userId: u.id, email: u.email })
      )).catch(err=>{
        next(err)
      })
  };

exports.initialiseApp = (req,res,next) =>{
const id = req.params.id
   if(id !="undefined"){
    sessionManager.store.get(id,(err,sess)=>{
        if(sess){
        return res.json({
            authenticated: true, authenticatedUser: {email:sess.key.email,id:sess.key._id,user_id:sess.key._id,role:sess.key.role}
            })
        }
       })
    }else{
    return res.json({
        authenticated: false, authenticatedUser: null
        })
    }
   
}