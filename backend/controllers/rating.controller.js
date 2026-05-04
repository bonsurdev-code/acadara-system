import { Rating, Session, Match } from '../models/index.js';

export const submitRating = async (req, res) => {
    try {
        const { session_id, rating, comment } = req.body;
        const mentee_id = "MNT-" + req.user.usr_id;

        // 1. Verify session exists and belongs to this mentee
        const session = await Session.findOne({
            where: { session_id },
            include: [{ 
                model: Match, 
                as: 'match',
                where: { mentee_id } 
            }]
        });

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found or unauthorized." });
        }

        // 2. Create the rating
        await Rating.create({
            session_id,
            mentor_id: session.match.mentor_id,
            mentee_id: session.match.mentee_id,
            score: rating,
            comment
        });

        res.status(201).json({ 
            success: true, 
            message: "Rating submitted and mentorship completed successfully." 
        });

    } catch (error) {
        console.error("Rating Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};