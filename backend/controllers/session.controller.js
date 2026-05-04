import { Session, Match, Mentee, User, Mentor } from '../models/index.js';

// 1. Mentee Proposes
export const proposeSession = async (req, res) => {
  try {
    const { match_id, requested_date, meeting_event, mentee_agenda } = req.body;
    
    // Safety check: Does this match exist?
    const match = await Match.findByPk(match_id);
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });

    const newSession = await Session.create({
      match_id,
      requested_date,
      meeting_event,
      mentee_agenda,
      status: 'negotiating',
      is_date_agreed: false, // Reset explicitly
      is_event_agreed: false
    });

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Mentor Reviews
export const reviewSessionProposal = async (req, res) => {
  try {
    const { session_id } = req.params;
    const { 
      is_date_agreed, 
      is_event_agreed, 
      mentor_feedback, 
      study_goal, 
      meeting_link, 
      materials_note, 
      status // We take status from the body now
    } = req.body;

    const session = await Session.findByPk(session_id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // 1. Prepare Update Object
    const updateData = {
      is_date_agreed,
      is_event_agreed,
      mentor_feedback,
      study_goal,
      meeting_link,
      materials_note
    };

    // 2. Logic: Status Management
    // If the frontend explicitly sends 'completed', we terminate.
    if (status === 'completed') {
      updateData.status = 'completed';
    } 
    // Otherwise, check if it meets 'confirmed' criteria
    else if (is_date_agreed && is_event_agreed && study_goal) {
      updateData.status = 'confirmed';
    } 
    // Default back to negotiating if criteria aren't met
    else {
      updateData.status = 'negotiating';
    }

    await session.update(updateData);

    // 3. Fetch fresh version with associations for the UI
    const updatedSession = await Session.findByPk(session_id, {
      include: [{ 
        model: Match, 
        as: 'match',
        include: [
          { 
            model: Mentee, 
            include: [{ model: User, as: 'user', attributes: ['usr_name'] }] 
          }
        ]
      }]
    });

    let message = "Negotiation updated.";
    if (updatedSession.status === 'confirmed') message = "Session officially set!";
    if (updatedSession.status === 'completed') message = "Session terminated successfully.";

    res.status(200).json({ 
      success: true, 
      message,
      data: updatedSession 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the most recent active/negotiating session for a match
export const getActiveSession = async (req, res) => {
  try {
    const { match_id } = req.params;

    const session = await Session.findOne({
      where: { 
        match_id,
        // Include 'completed' so the mentee can still access the ID for the rating modal
        status: ['negotiating', 'confirmed', 'completed'] 
      },
      order: [['createdAt', 'DESC']], 
      include: [
        {
          model: Match,
          as: 'match',
          include: [
            { 
              model: Mentor,
              attributes: { exclude: ['mentor_embedding'] },
              include: [{ model: User, as: 'user', attributes: ['usr_name'] }],
            },
            { 
              model: Mentee, 
              include: [{ model: User, as: 'user', attributes: ['usr_name'] }] 
            }
          ]
        }
      ]
    });

    if (!session) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};