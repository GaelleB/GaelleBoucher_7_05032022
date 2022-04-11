const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Post } = require('../models')

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

// Modification d'un post (contenu et image)
exports.modifyPost = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwt.getUserId(headerAuth);
    const role = jwt.getRoleUser(headerAuth);
    if (req.file) {
        Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.userId || role === 0) {
                if (post.image) {
                const filename = post.image.split('/images/posts/')[1];
                fs.unlink(`images/posts/${filename}`, () => {
                    const modifyPost = {
                        content: req.body.content,
                        updatedAt: Date.now(),
                        image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    };
                    Post.update(modifyPost , { where: { id: req.params.id } })
                        .then(() => res.status(200).json({message : 'Post modifié !'}))
                        .catch( error => res.status(400).json({error}));
                })} else {
                    const modifyPost = {
                        content: req.body.content,
                        updatedAt: Date.now(),
                        image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    };
                    Post.update(modifyPost , { where: { id: req.params.id } })
                        .then(() => res.status(200).json({message : 'Post modifié !'}))
                        .catch( error => res.status(400).json({error}));
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.userId || role === 0) {
                if (post.image && req.body.image === '') {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        const modifyPost = {
                            content: req.body.content,
                            createdAt: Date.now(),
                            image: ''
                        };
                        Post.update(modifyPost , { where: { id: req.params.id } })
                            .then(() => res.status(200).json({message : 'Post modifié !'}))
                            .catch( error => res.status(400).json({error}));
                    })
                } else {
                    const modifyPost = {
                        content: req.body.content,
                        createdAt: Date.now(),
                    };
                    Post.update(modifyPost , { where: { id: req.params.id } })
                        .then(() => res.status(200).json({message : 'Post modifié !'}))
                        .catch( error => res.status(400).json({error}));
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
    }
}

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

// Affichage d'un post
exports.getOnePost = (req, res, next) => {
    console.log("getOnePost  " + req.body)
    const headerAuth = req.headers['authorization'];
    const userId = jwt.getUserId(headerAuth);
    Post.findOne({
        where: { id : req.params.id },
            include: [{ 
                model : models.User, 
                attributes: [ 'nom','prenom', 'id' ]          
            }, 
            {model: models.Like,
                attributes: [ 'PostId', 'UserId' ]
            },
            {model: models.Dislike,
                attributes: [ 'PostId', 'UserId' ]
            }, 
            {model: models.Comment,
                attributes: [ 'content', 'id' , 'updatedAt','createdAt', 'UserId','PostId' ],
                include: [ { 
                model: models.User, 
                attributes: [ 'nom','prenom','id' ] 
            }] 
            }
        ],
    })
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
}

// Récupération de tous les posts d'un utilisateur
exports.getPostsUser = (req, res, next) => {
    Post.findAll({
        where: {
            userId : req.params.user.id
        },
        include: [{
            model : models.User,
        }],
        order: [["createdAt", "ASC"]],
    })
    .then( posts => res.status(200).json(posts))
    .catch( error => res.status(400).json({error}))
};

// Récupération de tous les posts
exports.getAllPosts = (req, res, next) => {
    console.log("all post  " + req.body);
    Post.findAll({ 
        order: [["id", "DESC"]],
        include: [{ model : models.User,
            attributes: [ 'nom','prenom', 'id' ]
        },
            { model: models.Like, 
                attributes: [ 'UserId' ] 
                }, 				
                {model: models.Dislike,
                attributes: ['UserId' ] 
                }, 
                {model: models.Comment,
                attributes: [ 'content', 'id' , 'updatedAt','createdAt', 'UserId','PostId' ],
                include: [ { model: models.User, 
                attributes: [ 'nom','prenom','id' ] 
                }] 
                }
        ]
    })
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
};

// Like
exports.likePost = async (req, res, next) => {
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
exports.dislikePost = async (req, res, next) => {
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