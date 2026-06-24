const favoriteModel = require('../models/favoriteModel')

async function toggleFavorite(req,res,next) {
    try {
        if (!req.session.account){
            return res.status(401).json({
                success:false,
                message: `Please login first ${req.session.account ? req.session.account.account_firstname : ''} to use the favorite feature!`,
                redirect: "/account/login"
            });
        }
        const inv_id = req.body.invId;
        const account_id = req.session.account.account_id;

        const result = await favoriteModel.toggleFavorite(account_id, inv_id);

        return res.status(200).json({
            success: true,
            liked: result.liked
        });

    } catch (error) {
        next(error)
    }
}

module.exports = {
    toggleFavorite,
}