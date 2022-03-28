const comment = require('../models/comment');
const post = require('../models/post');
const models = require('../models');

// Création d'un commentaire
exports.createComment = (req, res, next) => {
    console.log("console log create comment  " +(req.body));
    models.Comment.create({
        content: req.body.content,
        UserId: userId,
        PostId: req.body.postId
    })
        .then(() => res.status(201).json({message: 'Commentaire créé !'}))
        .catch( error => res.status(400).json({error}));
};

// Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    models.Comment.findOne({
        where: { id: req.params.id }
    })
    .then(Comment => {
        if (userId === Comment.userId || role === 0) 
        {
            models.Comment.destroy({ where: { id: req.params.id } })
            res.status(200).json({message : 'Commentaire supprimé !'})

        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};

// Affichage d'un commentaire
exports.getPostComments = (req, res, next) => {
    console.log("console log getPostComments  " +(req.body));
    models.Comment.findAll({
        where: { postId : req.params.postId },
        include: [{  model : models.User}],
        order: [["createdAt", "DESC"]]//
    })
    .then(comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

// Affichage de tous les commentaires
exports.getAllComments = (req, res, next) => {
    console.log("console log getPostAllComments  " +(req.body));
    models.Comment.findAll({
        include: [
            { model : models.User},
            { model : models.Post}],
        order: [["createdAt", "DESC"]]})

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

// Affichage de tous les commentaires
exports.getPostAllComments = (req, res, next) => {
    console.log("console log getAllComment  " +(req.body));
    models.Comment.findAll({
        include: [{
            model : models.User
        },{
            model : models.Post
        }],
        order: [["createdAt", "DESC"]],
    })
    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
}

// Mofifier un commentaire
exports.modifyComment = (req, res, next) => {
    console.log("console log modifyComment  " +(req.body));

    models.Comment.findOne({ where: { id: req.params.id }})
        .then(comment => {
            if (userId === comment.userId || role === 0) {
                const modifyComment = {content: req.body.content};
                models.Comment.update(modifyComment , { where: { id: req.params.id } })

                .then(() => res.status(200).json({message : 'Commentaire modifié !'}))
                .catch( error => res.status(400).json({error}));

            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error => res.status(400).json({error}))
};