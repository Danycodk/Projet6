//  Creation d un schema/modelededonnees
//qui va nouspermettre delire d enregistrer de modifier  les DATA dans la base de donnee
const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true},
  description: { type: String, required: true },
  mainPepper: { type: String, required: true},
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true},
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true},
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true},
})
//nous exportons ce schéma en tant que modèle Mongoose appelé « Thing »
module.exports = mongoose.model('Sauces', saucesSchema);