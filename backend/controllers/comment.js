const models = require('../models/');

// Création d'un commentaire
exports.createComment = (req, res) => {
    console.log("newComment")
    const newComment = {
        userId: req.body.userId,
        content: req.body.content,
        postId: req.body.postId
    };
    models.Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Commentaire créé" }))
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'un commentaire
exports.getOneComment = (req, res, next) => {
    console.log("getOneComment");
    models.Comment.findAll({
        where: { postId: req.body.postId },
        include: [{ model : models.User }],
        order: [["createdAt", "DESC"]]
    })
    .then(comment => res.status(200).json(comment))
    .catch( error => res.status(400).json({error}))
};

  // Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    models.Comment.findOne(
        { where: { id: req.params.id } }
    )
    .then(comment => {
        if (userId === userId || role === 0) 
        {
            comment.destroy({ where: { id: req.params.id } })
            res.status(200).json({message : 'Commentaire supprimé !'})
        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};