const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            content
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params; 
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 }); 
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};