/* importing the sauce model and the file system plugin */

const Sauce = require('../models/sauce');
const fs = require('fs');

/* Creating the get all sauces controllers who returns all the sauces in the database when fetched  */

exports.getAllSauces = (req, res ,next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/* Creating the controller who gets a specific sauce for individual products pages */

exports.getOneSauce = (req, res ,next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/* Creating the create sauce controller who saves a sauce with the user  */

exports.createSauce = (req, res ,next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

/* Creating the modify sauce controller who updates a sauce object in the database with the informations entered by the user */

exports.modifySauce = (req, res ,next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if(sauce.userId != req.auth.userId) {
                res.status(401).json({ message : "Non authorisé"});
            } else {
                Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

/* Creating the delete sauce controller who deletes a sauce object */

exports.deleteSauce = (req, res ,next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non authorisé' });
            } else {
                const fileName = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileName}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() =>  res.status(200).json({ message: 'Objet supprimé !'}))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

/* Creating the controller who handles the like system */

exports.likeSauce = (req, res ,next) => {
    switch(req.body.like) {
        case 1:
                Sauce.updateOne({ _id: req.params.id },  {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
                .then(() => res.status(200).json({ message: 'Objet liké!' }))
                .catch(error => res.status(400).json({ error }));
            break;
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },  {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                            .then(() => res.status(200).json({ message: 'Like supprimé'}))
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },  {$inc: {likes: 1}, $pull: {usersDisliked: req.body.userId}})
                            .then(() => res.status(200).json({ message: 'Dislike supprimé'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(500).json({ error }));
            break;
        case -1:
                Sauce.updateOne({ _id: req.params.id }, {$inc: {likes: -1}, $push: {usersDisliked: req.body.userId}})
                .then(() => res.status(200).json({ message: 'Objet disliké!' }))
                .catch(error => res.status(400).json({ error }));
            break;
    }
};