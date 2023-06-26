const Sauces = require('../models_schemas/schemaSauces');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauces.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id
  }).then(
    //indique dans les require
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  //delete saucesObject._userId;
  const sauce = new Sauces({
      ...saucesObject,
     //S userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [' '],
      usersdisLiked: [' '],
  });
  sauce.save()
  .then(() => { res.status(201).json({message: `${sauce} enregistré !`})})
  .catch(error => {
    console.log(error)
    { res.status(400).json( { error })}
  })
};



exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  //delete saucesObject._userId;
  Sauces.findOne({_id: req.params.id})
      .then((sauces) => {
          if (sauces.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauces.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


exports.gotLike = (req, res, next) => {
  
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;


  Sauces.findOne({ _id: sauceId })
    .then(sauce => {
     
      const userIndexLiked = sauce.usersLiked.indexOf(userId);
      const userIndexDisliked = sauce.usersDisliked.indexOf(userId);

      if (like === 1) { // Si l'utilisateur aime la sauce
        if (userIndexLiked === -1) { 
          sauce.likes++;
          sauce.usersLiked.push(userId);

          console.log(sauce)
        } else { 

          console.log(sauce)
          return res.status(400).json({ error: 'Vous avez déjà liké cette sauce' });
        }
      } else if (like === -1) { // Si l'utilisateur n'aime pas la sauce
        if (userIndexDisliked === -1) {
          sauce.dislikes++;
          sauce.usersDisliked.push(userId);

          console.log(sauce)
        } else { //  disliké la sauce

          console.log(sauce)
          return res.status(400).json({ error: 'Vous avez déjà disliké cette sauce' });
        }
      } else if (like === 0) { // Si l'utilisateur annule son like ou dislike
        if (userIndexLiked !== -1) { 
          sauce.likes--;
          sauce.usersLiked.splice(userIndexLiked, 1);

          console.log(sauce)
        } else if (userIndexDisliked !== -1) { // Si l'utilisateur a déjà disliké la sauce
          sauce.dislikes--;
          sauce.usersDisliked.splice(userIndexDisliked, 1);
          
          console.log(sauce)
        } else { // Si l'utilisateur n'a pas encore liké ou disliké la sauce
          return res.status(400).json({ error: 'Vous n\'avez pas encore noté cette sauce' });
        }
      } else {
        return res.status(400).json({ error: 'La valeur de like doit être 1, -1 ou 0' });
      }

      
      Sauces.updateOne({ _id: sauceId }, sauce)
        .then(() => res.status(200).json({ message: 'Like/dislike enregistré avec succès' }))
        .catch(error => {
          console.log("Ici c est l erreur update des LIKES")
          res.status(400).json({ error })
        });
    })
    .catch(error => res.status(404).json({ error }));
};