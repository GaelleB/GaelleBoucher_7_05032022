const models = require('../models/');

// Création d'un commentaire
exports.createComment = (req, res) => {
    const newComment = {
        uerId: req.body.userId,
        content: req.body.content,
        postId: req.body.postId
    };
    models.Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Commentaire créé" }))
        .catch(error => res.status(500).json({ error }));
};

  // Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    models.Comment.findOne(
        { where: { id: req.params.id } }
    )
    .then(Comment => {
        if (userId === userId || role === 0) 
        {
            Comment.destroy({ where: { id: req.params.id } })
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
exports.getOneComment = (req, res, next) => {
    models.Comment.findAll({
        where: { postId : req.params.postId },
        include: [{  model : models.User}],
        order: [["createdAt", "DESC"]]
    })
    .then(comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};