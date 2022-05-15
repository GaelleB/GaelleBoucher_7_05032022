const jwt = require('jsonwebtoken');
const fs = require('fs');
const models = require('../models');

// Création d'un post
exports.createPost = (req, res) => {
    const newPost = {
        UserId: req.tokenUserId,
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imgPost
    };
    models.Post.create(newPost) 
        .then(() => res.status(201).json({ message: "Post créé !" }))
        .catch(error => res.status(500).json({ error }));
};

// Gestion de l'image
exports.imgPost = (req, res, next) => {
    const userId = req.user.userId;
    const postId = req.params.id;
    
    models.Post.findOne({
        where: { id: userId },
    })
        .then((post) => {
        if (post.image !== null) {
        const filename = post.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            models.Post.update(
            {
                image: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                }`,
            },
            { where: { id: userId } }
        )
            .then(() =>
                res.status(200).json({ message: "Photo mise à jour !" })
            )
            .catch((error) =>
                res.status(400).json({ error: "Modification impossible" })
            );
        })
        } else{
            models.Post.update(
            {
                image: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                }`,
            },
            { where: { id: userId } }
        )
            .then(() =>
                res.status(200).json({ message: "Photo mise à jour !" })
            )
            .catch((error) =>
                res.status(400).json({ error: "Modification impossible" })
            );
        }
    })
    .catch((error) => {
        res.status(500).json({ error: "Vérification impossible" });
    });
};

// Affichage d'un post
exports.getOnePost = (req, res) => {
    models.Post.findByPk(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(error => res.status(400).json({error}));
};

// Affichage de tous les posts
exports.getAllPosts = (req, res) => {
    models.Post.findAll({  
        order: [["id", "DESC"]],
    })
    .then(post => res.status(200).json(post))
    .catch(error => res.status(400).json({error}))
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
    models.Post.findOne({ where: { id: req.params.id } })
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

// Like
exports.likePost = async (req, res, next) => {
	try {
		const userId = req.tokenUserId;
		const postId = req.params.id;
		const user = await models.Like.findOne({
			where: { UserId: userId, PostId: postId }
		});
		if (user) {
			await models.Like.destroy(
				{ where: { UserId: userId, PostId: postId } },
				{ truncate: true, restartIdentity: true }
			);
			res.status(200).send({ message: "Neutre" });
		} else {
			await models.Like.create({
				UserId: userId,
				PostId: postId
			});
			res.status(201).json({ message: 'Like :)' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Erreur du serveur' });
	}
};

// Dislike 
exports.dislikePost = async (req, res, next) => {
	try {
		const userId = req.tokenUserId;
		const postId = req.params.id;
		const user = await models.Dislike.findOne({
			where: { UserId: userId, PostId: postId }
		});
		if (user) {
			await models.Dislike.destroy(
				{ where: { UserId: userId, PostId: postId } },
				{ truncate: true, restartIdentity: true }
			);
			res.status(200).send({ message: "Neutre" });
		} else {
			await models.Dislike.create({
				UserId: userId,
				PostId: postId
			});
			res.status(201).json({ message: 'Dislike :(' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Erreur du serveur' });
	}
};