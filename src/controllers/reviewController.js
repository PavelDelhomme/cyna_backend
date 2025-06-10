const {
    Review, UserProfile, Product, Service, User
} = require('../models');

exports.listReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [{
                model: UserProfile,
                as: 'userProfile',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }]
            }],
            order: [['reviewDate', 'DESC']]
        });
        res.json(reviews);
    } catch (err) {
        console.error("[reviewController.js] Erreur listReviews :", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.findAll({
            where: { product_id: productId },
            include: [{
                model: UserProfile,
                as: 'userProfile',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }]
            }],
            order: [['reviewDate', 'DESC']]
        });
        
        // Ajouter un alias comment pour compatibilité frontend et adapter le nom d'utilisateur
        const reviewsWithComment = reviews.map(review => ({
            ...review.toJSON(),
            comment: review.description,
            userName: review.userProfile?.user?.name || 'Utilisateur anonyme'
        }));
        
        res.json(reviewsWithComment);
    } catch (err) {
        console.error("[reviewController.js] Erreur getReviewsByProduct :", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getReviewsByService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const reviews = await Review.findAll({
            where: { service_id: serviceId },
            include: [{
                model: UserProfile,
                as: 'userProfile',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }]
            }],
            order: [['reviewDate', 'DESC']]
        });
        
        // Ajouter un alias comment pour compatibilité frontend et adapter le nom d'utilisateur
        const reviewsWithComment = reviews.map(review => ({
            ...review.toJSON(),
            comment: review.description,
            userName: review.userProfile?.user?.name || 'Utilisateur anonyme'
        }));
        
        res.json(reviewsWithComment);
    } catch (err) {
        console.error("[reviewController.js] Erreur getReviewsByService :", err);
        res.status(500).json({ error: err.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { rating, comment, product_id, service_id } = req.body;
        const user_profile_id = req.user.user_profile?.id;

        if (!user_profile_id) {
            return res.status(400).json({ error: "Profil utilisateur requis pour laisser un avis." });
        }

        if (!rating || !comment) {
            return res.status(400).json({ error: "Note et commentaire requis." });
        }

        if (!product_id && !service_id) {
            return res.status(400).json({ error: "L'avis doit être associé à un produit ou un service." });
        }

        if (product_id && service_id) {
            return res.status(400).json({ error: "L'avis ne peut pas être associé à la fois à un produit et un service." });
        }

        // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit/service
        const existingReview = await Review.findOne({
            where: {
                user_profile_id,
                ...(product_id ? { product_id } : { service_id })
            }
        });

        if (existingReview) {
            return res.status(400).json({ error: "Vous avez déjà laissé un avis pour cet article." });
        }
        
        const review = await Review.create({
            user_profile_id,
            rating,
            description: comment, // Stocker le comment dans description
            product_id: product_id || null,
            service_id: service_id || null,
            reviewDate: new Date()
        });

        // Récupérer le review créé avec les informations de l'utilisateur
        const createdReview = await Review.findByPk(review.id, {
            include: [{
                model: UserProfile,
                as: 'userProfile',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }]
            }]
        });

        // Ajouter l'alias comment pour le frontend
        const reviewWithComment = {
            ...createdReview.toJSON(),
            comment: createdReview.description,
            userName: createdReview.userProfile?.user?.name || 'Utilisateur anonyme'
        };

        res.status(201).json(reviewWithComment);
    } catch (err) {
        console.error("Erreur création review :", err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const user_profile_id = req.user.user_profile?.id;
        
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "Avis non trouvé" });
        }

        // Vérifier que l'utilisateur est bien le propriétaire de l'avis
        if (review.user_profile_id !== user_profile_id) {
            return res.status(403).json({ error: "Vous ne pouvez modifier que vos propres avis" });
        }

        await review.update({
            rating: rating || review.rating,
            description: comment || review.description
        });

        // Récupérer le review mis à jour avec les informations de l'utilisateur
        const updatedReview = await Review.findByPk(review.id, {
            include: [{
                model: UserProfile,
                as: 'userProfile',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }]
            }]
        });

        // Ajouter l'alias comment pour le frontend
        const reviewWithComment = {
            ...updatedReview.toJSON(),
            comment: updatedReview.description,
            userName: updatedReview.userProfile?.user?.name || 'Utilisateur anonyme'
        };

        res.json(reviewWithComment);
    } catch (err) {
        console.error("[reviewController.js] Erreur updateReview :", err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            console.error("[reviewController.js] Review non trouvé");
            return res.status(404).json({ error: "Avis non trouvé" });
        };
        
        // Si ce n'est pas un admin, vérifier que l'utilisateur est le propriétaire
        if (req.user.role !== 'admin' && review.user_profile_id !== req.user.user_profile?.id) {
            return res.status(403).json({ error: "Vous ne pouvez supprimer que vos propres avis" });
        }

        await review.destroy();
        res.json({ message: "Avis supprimé" });
        console.log("[reviewController.js] Review supprimée");
    } catch (err) {
        console.error("[reviewController.js] Erreur lors de la suppression de la review", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getReviewStats = async (req, res) => {
    try {
        const { productId, serviceId } = req.params;
        const whereClause = productId ? { product_id: productId } : { service_id: serviceId };
        
        const reviews = await Review.findAll({
            where: whereClause,
            attributes: ['rating']
        });

        if (reviews.length === 0) {
            return res.json({
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });
        }

        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => {
            ratingDistribution[r.rating]++;
        });

        res.json({
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution
        });
    } catch (err) {
        console.error("[reviewController.js] Erreur getReviewStats :", err);
        res.status(500).json({ error: err.message });
    }
};