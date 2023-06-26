//dans ce fichier on socuppe de la creation de l application 
//des req,res en format json 
const express = require('express');
// je sais Exactement comment definir Mongoose
const mongoose = require('mongoose');
const path = require('path');
//securise/protege requetes http
const helmet = require("helmet")
const userRoutesVar = require('./routes/userRoutes');
const saucesRoutesVar = require('./routes/saucesRoutes');
const app = express();
//Securisation sur github
 require("dotenv").config()
 

//exporter le schema nomme thing
//const Thing = require('./models_schemas/Thing');mis dans routes/stuff.js

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.45w6ghf.mongodb.net?retryWrites=true&w=majority`,  
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  



// suppresssion cors par eefauts pour donner acces a tout le monde de faire des requetes
//pas de specifications specifiques en terme d Url on donne l acces a tout mes URL
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });
 //Permet d acceder au corp de la requete
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
 //enregistrer notre routeur pour toutes les demandes effectuées vers /api/stuff
 app.use('/api/auth', userRoutesVar);
 app.use('/api/sauces', saucesRoutesVar);



module.exports = app;