import { Message, Match, Mentee, Mentor } from "../models/index.js";

export const sendMessage = async (req, res) => {
  try {
    const { match_id, content } = req.body;
    const usr_id = req.user.usr_id;

    // 1. Identify the sender's role-based ID
    const mentee = await Mentee.findOne({ where: { usr_id } });
    const mentor = await Mentor.findOne({ where: { usr_id } });
    const sender_id = mentee ? mentee.mentee_id : mentor.mentor_id;

    // 2. Security Check: Ensure the user belongs to this match
    const match = await Match.findByPk(match_id);
    if (!match || (match.mentee_id !== sender_id && match.mentor_id !== sender_id)) {
      return res.status(403).json({ success: false, message: "Unauthorized to message in this chat." });
    }

    // 3. Create Message
    const newMessage = await Message.create({
      match_id,
      sender_id,
      content
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { match_id } = req.params;
    const usr_id = req.user.usr_id;

    // Identify user to verify participation
    const mentee = await Mentee.findOne({ where: { usr_id } });
    const mentor = await Mentor.findOne({ where: { usr_id } });
    const viewer_id = mentee ? mentee.mentee_id : mentor.mentor_id;

    const messages = await Message.findAll({
      where: { match_id },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};