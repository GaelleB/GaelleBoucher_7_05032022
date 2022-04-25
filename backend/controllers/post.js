const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Post } = require('../models/post');
const models = require('../models');

// Création d'un post
exports.createPost = (req, res) => {
    // Gestion de l'image
    let imagePost = null
    if(req.file) {
        imagePost = `${req.protocol}://${req.get('host')}/images/post${req.file.filename}`
    };
    const newPost = {
        UserId: req.tokenUserId,
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imagePost
    };
    models.Post.create(newPost) 
            .then((post) => res.status(201).json(post))
            .catch(error => res.status(400).json({ error }));
        
};

// Affichage d'un post
exports.getOnePost = (req, res) => {
    const headerAuth = req.headers['authorization'];
    models.Post.findOne({
        where: { id : req.params.id },
        include: [
            {
                model: models.User,
                as: "User",
                attributes: ["prenom", "nom"],
            },
            { model: models.Comment },
            { model: models.Like },
        ],
    })
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
}

// Affichage de tous les posts
exports.getAllPosts = (req, res) => {
    models.Post.findAll({  
        order: [["id", "DESC"]],
    })
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
};

// Modification d'un post (contenu et image)
exports.modifyPost = (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.id;
    const title = req.body.title;
    const content = req.body.content;

    if (req.file) {
        models.Post.findOne({ where: { id: postId } })
        .then((post) => {
        if (post.userId !== userId) {
        res.status(400).json({
            error: new Error("Requête non autorisée"),
        });
        }
        const filename = post.image.split("/images/")[1];
        if (post.image !== null) {
        fs.unlink(`images/${filename}`, (error) => {
            if (error) throw error;
        });
        }
        })
        .catch((error) => res.status(500).json({ error }));
    }
    const updatePost = req.file
    ? {
        title: title ? title : post.title,
        content: content ? content : post.content,
        image: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
        }`,
    }
    : { ...req.body };
    models.Post.update(
        {
        ...updatePost,
        id: postId,
        },
        { where: { id: postId } }
    )
    .then(() => {
        return res.status(200).json({ message: "Post modifié !" });
    })
    .catch((error) => {
        return res.status(400).json({ error });
    });
};

// Suppression d'un post
exports.deletePost = (req, res) => {
    models.Post.findOne(
        { where: { id: req.params.id } }
    )
    .then(post => {
        if(post.imageUrl != null) {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if(err) throw err;
            })
        };
        models.Post.destroy({ where: { id: req.params.id } })
            .then(() => res.status(201).json({ message: "Post supprimé"}))
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Like & Dislike
exports.likeStatus = (req, res) => {
	const like = req.body.like
	const userId = req.body.userId

	// Recherche du post sélectionné
	Post.findOne({ _id: req.params.id })
		.then((post) => {
			// Vérification de l'ID utilisateur avec .find
			let userLike = post.usersLiked.find((id) => id === userId)
			let userDislike = post.usersDisliked.find((id) => id === userId)

			console.log('Statut : ', like)

			// Fonction pour le like/dislike
			switch (like) {
				// +1 (like)
				case 1:
					post.likes += 1
					post.usersLiked.push(userId)
					break

				// Annule -1
				case 0:
					if (userLike) {
						post.likes -= 1
						post.usersLiked = post.usersLiked.filter((id) => id !== userId)
					}
					if (userDislike) {
						post.dislikes -= 1
						post.usersDisliked = post.usersDisliked.filter(
							(id) => id !== userId
						)
					}
					break

				// +1 (dislike)
				case -1:
					post.dislikes += 1
					post.usersDisliked.push(userId)
			}
			// Sauvegarde du post avec .save
			post.save()
				.then(() => res.status(201).json({ message: 'Post sauvegardé' }))
				.catch((error) => res.status(400).json({ error }))
		})
		// Erreur server
		.catch((error) => res.status(500).json({ error }))
}