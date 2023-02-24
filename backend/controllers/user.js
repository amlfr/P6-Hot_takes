/* Importing the user model,environment variables, the bcrypt and jsonwebtoken tools */

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

/* Creating the signup controller, who salts the passwords before saving the user in the database it then sends back either a success or an error message */

exports.signup = (req, res, next) => {
    const passwordRegex = /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[0-9])).{8,}$/;
    if (passwordRegex.test(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
                })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(400).json({message: "Le mot de passe n'est pas assez fort. Veuillez utilisez une lettre majuscule et miniscule ainsi qu'un chiffre." })
    }  
};

/* Creating and the login controller who checks the information received against the users in the database. It uses bcrypt to compare passwords and doesn't tell the users on which input and error was made. It also assings a jswebtoken to the user.  */

exports.login = (req, res , next) => {
    User.findOne({ email: req.body.email })
       .then(user => {
           if (!user) {
               return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
           }
           bcrypt.compare(req.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                       return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                   }
                   res.status(200).json({
                       userId: user._id,
                       token: jwt.sign(
                        { userId: user._id },
                        process.env.JWT_KEY,
                        { expiresIn: '24h' }
                       )
                   });
               })
               .catch(error => res.status(500).json({ error }));
       })
       .catch(error => res.status(500).json({ error }));
};