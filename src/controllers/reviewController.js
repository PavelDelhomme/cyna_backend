
exports.listReviews = async (req, res) => {
    const reviews = await Review.findAll();
    res.json(reviews);
};


exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.user.id;

        if (!rating || !comment) {
            return res.status(400).json({ error: "Note et commentaire requis." });
        }
        
        const review = await Review.create({
            user_id: userId,
            rating,
            comment,
            reviewDate: new Date()
        });

        res.status(201).json(review);
    } catch (err) {
        console.error("Erreur création review :", err);
        res.status(500).json({ error: err.message });
    }
};
