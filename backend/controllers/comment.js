const Comment = require('../models/comment');

// Création d'un commentaire
exports.createComment = (req, res) => {
    const newComment = {
        userId: req.body.userId,
        content: req.body.content,
        postId : req.params.postId
    };
    Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Commentaire créé" }))
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'un commentaire
exports.getOneComment = (req, res, next) => {
    console.log("console log getOneComment  " +(req.body));
    Comment.findAll({
        where: { postId : req.params.postId },
    })
    .then(comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

// Affichage de tous les commentaires
exports.getAllComments = (req, res, next) => {
    console.log("console log getPostAllComments  " +(req.body));
    models.Comment.findAll({
        where: {postId : req.params.postId},
        order: [["createdAt", "DESC"]]
    })
    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

// Modification d'un commentaire
exports.modifyComment = (req, res, next) => {
    console.log("console log modifyComment  " +(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwt.getUserId(headerAuth);
    const role = jwt.getRoleUser(headerAuth);
    models.Comment.findOne({ where: { id: req.params.id }})
        .then(comment => {
            if (userId === comment.userId || role === 0) {
                const modifyComment = {content: req.body.content};
                Comment.update(modifyComment , { where: { id: req.params.id } })
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

// Suppression d'un commentaire
exports.deleteComment = (req, res) => {
    Comment.destroy(
        { where: { id: req.params.id } }
    )
    .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
    .catch(error => res.status(500).json({ error }));
};