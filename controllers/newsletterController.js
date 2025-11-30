import Newsletter from "../models/Newsletter.js";

export const subscribeUser = async (req, res) => {
  const { email } = req.body;

  try {
    // check if exists
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already subscribed." });
    }

    // create new email
    await Newsletter.create({ email });

    return res.status(200).json({
      message: "Successfully subscribed to newsletter!",
    });
  } catch (err) {
    console.error("Newsletter Error:", err);
    res.status(500).json({ message: "Server error, try again later." });
  }
};

export const getAllEmails = async (req, res) => {
  try {
    const emails = await Newsletter.find().sort({ createdAt: -1 });

    return res.status(200).json({
      count: emails.length,
      emails,
    });
  } catch (err) {
    console.error("Fetch Emails Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Newsletter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Email not found." });
    }

    return res.status(200).json({ message: "Email deleted successfully." });
  } catch (err) {
    console.error("Delete Newsletter Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


