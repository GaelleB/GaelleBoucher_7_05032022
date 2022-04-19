const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Post } = require('../models');

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
    Post.create(newPost) 
            .then((post) => res.status(201).json(post))
            .catch(error => res.status(400).json({ error }));
        
};

// Affichage d'un post
exports.getOnePost = (req, res) => {
    console.log("getOnePost  " + req.body)
    const headerAuth = req.headers['authorization'];
    Post.findOne({
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

// Récupération de tous les posts
exports.getAllPosts = (req, res) => {
    console.log("all post  " + req.body);
    Post.findAll({  
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
    Post.update(
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
    Post.findOne({ where: { id: req.params.id } })
    .then(post => {
        if(post.imageUrl != null) {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if(err) throw err;
            })
        };
        Post.destroy({ where: { id: req.params.id } })
            .then(() => res.status(201).json({ message: "Post supprimé"}))
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Like
exports.likePost = async (req, res) => {
    console.log("console LIKE  " +(req.body));
	try {
        const headerAuth = req.headers['authorization'];
		const userId = jwt.getUserId(headerAuth);
		const postId = req.params.id;
		const user = await models.Like.findOne({
			where: { UserId: userId, PostId: postId }
		});
		if (user) {
			await models.Like.destroy(
				{ where: { UserId: userId, PostId: postId } },
				{ truncate: true, restartIdentity: true }
			);
			res.status(200).send({ messageRetour: "Neutre" });
		} else {
			await models.Like.create({
				UserId: userId,
				PostId: postId
			});
			res.status(201).json({ messageRetour: 'LIKE POST :)' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Erreur du serveur' });
	}
};

// Dislike
exports.dislikePost = async (req, res) => {
	try {
		const headerAuth = req.headers['authorization'];
		const userId = jwt.getUserId(headerAuth);
		const postId = req.params.id;
		const user = await models.Dislike.findOne({
			where: { UserId: userId, PostId: postId }
		});
		if (user) {
			await models.Dislike.destroy(
				{ where: { UserId: userId, PostId: postId } },
				{ truncate: true, restartIdentity: true }
			);
			res.status(200).send({ messageRetour: "Neutre" });
		} else {
			await models.Dislike.create({
				UserId: userId,
				PostId: postId
			});
			res.status(201).json({ messageRetour: 'DISLIKE POST :(' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Erreur du serveur' });
	}
};