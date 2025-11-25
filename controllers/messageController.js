import messageModel from "../models/messageModel.js";

export const submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ msg: "All fields are required" });

    const newMessage = await messageModel.create({ name, email, message });

    res.status(201).json({ msg: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Message submission error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await messageModel.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Fetching messages failed:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
