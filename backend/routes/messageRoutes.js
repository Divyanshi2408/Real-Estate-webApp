const express = require("express");
const Message = require("../models/Message");
const Property = require("../models/Property");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", authenticateToken, async (req, res) => {
    try {
        const properties = await Property.find({ ownerId: req.user.id }).select("_id");
        const propertyIds = properties.map((property) => property._id);

        // Fetch messages but exclude replies (isReply: true)
        const messages = await Message.find({ 
            propertyId: { $in: propertyIds },
            isReply: { $ne: true }  // Exclude replies
        })
        .populate("senderId", "name email")
        .populate("propertyId", "title");

        // Group messages by propertyId
        const groupedMessages = {};
        messages.forEach((msg) => {
            const propId = msg.propertyId._id.toString();
            if (!groupedMessages[propId]) {
                groupedMessages[propId] = [];
            }
            groupedMessages[propId].push({
                _id: msg._id,
                sender: msg.senderId.name,
                email: msg.senderId.email,
                message: msg.message,
                propertyTitle: msg.propertyId.title,
                timestamp: msg.createdAt,
            });
        });

        res.status(200).json(groupedMessages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📩 Send a message to a property owner
router.post("/", authenticateToken, async (req, res) => {
    const { propertyId, message } = req.body;

    try {
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const newMessage = new Message({
            propertyId,
            senderId: req.user.id,
            message,
        });

        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// 📩 Reply to a message

// router.post("/reply/:messageId", authenticateToken, async (req, res) => {
//     const { replyMessage } = req.body;
//     const { messageId } = req.params;

//     try {
//         const originalMessage = await Message.findById(messageId);

//         if (!originalMessage) {
//             return res.status(404).json({ message: "Message not found" });
//         }

//         if (!originalMessage.senderId) {
//             return res.status(400).json({ message: "Original message does not have a senderId" });
//         }

//         // Ensure replies array exists
//         if (!originalMessage.replies) {
//             originalMessage.replies = [];
//         }

//         // Create the reply message with receiverId
//         const reply = new Message({
//             propertyId: originalMessage.propertyId,
//             senderId: req.user.id, // Owner replying
//             receiverId: originalMessage.senderId, // Reply goes to original sender
//             message: `Reply: ${replyMessage}`,
//             isReply: true,
//             parentMessage: messageId,
            
//         });

//         await reply.save();

//         // Store reply reference in the original message
//         originalMessage.replies.push(reply._id);
//         await originalMessage.save();

//         res.status(201).json({ message: "Reply sent successfully", reply });
//     } catch (error) {
//         console.error("Error in reply API:", error);
//         res.status(500).json({ message: error.message });
//     }
// });

router.post("/reply/:messageId", authenticateToken, async (req, res) => {
    const { replyMessage } = req.body;
    const { messageId } = req.params;

    try {
        const originalMessage = await Message.findById(messageId);

        if (!originalMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Determine who is replying and who should receive it
        const isOwnerReplying = req.user.id.toString() === originalMessage.receiverId.toString();
        const receiverId = isOwnerReplying ? originalMessage.senderId : originalMessage.receiverId;

        // Create reply message
        const reply = new Message({
            propertyId: originalMessage.propertyId,
            senderId: req.user.id, 
            receiverId,
            message: replyMessage,
            isReply: true,
            parentMessage: originalMessage._id,
        });

        await reply.save();

        // Store reply reference in the original message
        originalMessage.replies.push(reply._id);
        await originalMessage.save();

        res.status(201).json({ message: "Reply sent successfully", reply });
    } catch (error) {
        console.error("Error in reply API:", error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/user", authenticateToken, async (req, res) => {
    try {
        // Fetch messages sent by the logged-in user
        const userMessages = await Message.find({ senderId: req.user.id })
            .populate("propertyId", "title") // Populate property title
            .lean();

        // Find replies where the logged-in user is the receiver
        const messageIds = userMessages.map(msg => msg._id);
        const replies = await Message.find({ parentMessage: { $in: messageIds } })
            .populate("senderId", "name email")  // ✅ Populate sender info
            .lean();

        // Attach replies to their corresponding messages
        const messagesWithReplies = userMessages.map(msg => ({
            ...msg,
            replies: replies.filter(reply => reply.parentMessage.toString() === msg._id.toString())
        }));

        res.status(200).json(messagesWithReplies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user messages", error: error.message });
    }
});




router.get("/replies/:messageId", authenticateToken, async (req, res) => {
    const { messageId } = req.params;

    try {
        const replies = await Message.find({ parentMessage: messageId })
            .populate("senderId", "name email")  // ✅ Populate sender info
            .lean();

        if (!replies || replies.length === 0) {
            return res.status(404).json({ message: "No replies found for this message." });
        }

        res.status(200).json(replies);
    } catch (error) {
        console.error("Error fetching replies:", error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
