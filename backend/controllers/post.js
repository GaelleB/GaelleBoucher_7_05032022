const fs = require('fs');
const models = require('../models');

// Création d'un post
exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content; 
    if(!title || !content) {
        res.status(400).json({ 'erreur': 'paramètre manquant' });
    }; 
    models.User.findOne({
        where: { id: userId }
    })
    .then(user => {
        if (req.file) { 
            models.Post.create({
                title : title,
                content: content,
                image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`,
                UserId: user.id,
                
            }).then( res.status(201).json({"message": "Nouveau post créé avec succès !"})
            ).catch(error => {
                console.log(error);
                res.status(400).json({erreur : erreur.message});
            });
        } else {  
            models.Post.create({
                title : title,
                content: content,
                UserId: user.id,
                
            }).then( res.status(201).json({"message": "Nouveau post créé avec succès !"})
            ).catch(error => {
                console.log(error);
                res.status(400).json({erreur : erreur.message});
            });
        };
    
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({erreur : erreur.message});
    });
};

// Affichage d'un post
exports.getOnePost = (req, res, nest) => {
    console.log("getOnePost  " + req.body)
    models.Post.findOne({
        where: { id : req.params.id },
        include: [{ model : models.User, 
            attributes: [ 'nom','prenom', 'id' ]          
        },
        ],
        })
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
}

// Affichage de tous les posts
exports.getAllPosts = (req, res, next) => {
    console.log("all post  " + req.body);
    models.Post.findAll({ 
        order: [["id", "DESC"]],
        include: [{ model : models.User,
            attributes: [ 'nom','prenom', 'id' ]
        }
        ]})

    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
};

// Affichage des posts d'un utilisateur
exports.getPostsUser = (req, res, next) => {
    models.Post.findAll({
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

// Modification post
exports.modifyPost = (req, res, next) => {
    if (req.file) {
        models.Post.findOne({ where: { id: req.params.id }})
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
                    models.Post.update(modifyPost , { where: { id: req.params.id } })
                        .then(() => res.status(200).json({message : 'Post modifié !'}))
                        .catch( error => res.status(400).json({error}));
                })} else {
                    const modifyPost = {
                        content: req.body.content,
                        updatedAt: Date.now(),
                        image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    };
                    models.Post.update(modifyPost , { where: { id: req.params.id } })
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
        models.Post.findOne({ where: { id: req.params.id }})
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

                        models.Post.update(modifyPost , { where: { id: req.params.id } })

                            .then(() => res.status(200).json({message : 'Post modifié !'}))
                            .catch( error => res.status(400).json({error}));
                    })
                } else {
                    const modifyPost = {
                        content: req.body.content,
                        createdAt: Date.now(),
                    };
            
                    models.Post.update(modifyPost , { where: { id: req.params.id } })
            
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

// Suppression post
exports.deletePost = (req, res, next) => {
    console.log("delete post   "+ req.body);

        models.Post.findOne({
            where: { id: req.params.id }
        })
        
        .then(post => {
            console.log("post FindOne    "   + req.params.id)
            console.log("userId    "   + userId);
            console.log("post user.id     " + post.userId)
            if (userId === post.userId || role === 0)
            
            {
                if (post.image != null) {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        models.Post.destroy({ where: { id: req.params.id } })

                        .then(() => res.status(200).json({message : 'Post supprimé !'}))
                        .catch( error => res.status(400).json({error}));
                    })
                
            
                } else {
                    models.Post.destroy({ where: { id: req.params.id } })

                    .then(() => res.status(200).json({message : 'Post supprimé !'}))
                    .catch( error =>{console.log(error); res.status(400).json({message :error.message}); });
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error =>{console.log(error); res.status(400).json({message :error.message}); });
}

//Like 
exports.likePost = async (req, res, next) => {
    console.log("console LIKE  " +(req.body));
	try {
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

//Dislike 
exports.dislikePost = async (req, res, next) => {
	try {
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