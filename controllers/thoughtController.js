// Imports
const { User, Thought } = require("../models");

// Get all thoughts
const thoughtController = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      return res.status(200).json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get single thought
  async getThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      return res.status(200).json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Create thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findByIdAndUpdate(
        req.body.userId,
        { $addToSet: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );

      return res.status(200).json({ thought, user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      return res.status(200).json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      return res.status(200).json({
        message: "Thought & associated reactions successfully deleted",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Add reaction
  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true }
      );

      if (!reaction) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      return res.status(200).json(reaction);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete reaction
  async deleteReaction(req, res) {
    const { thoughtId, reactionId } = req.params;
    console.log('→ deleteReaction params:', { thoughtId, reactionId });

    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: Types.ObjectId(thoughtId) },             // ensure parent ID is cast too
        { 
          $pull: { 
            reactions: { reactionId: Types.ObjectId(reactionId) }  // ② cast & pull by your custom field
          } 
        },
        { new: true }                                    // return the doc *after* the pull
      );

      if (!updatedThought) {
        console.log('→ deleteReaction: thought not found');
        return res.status(404).json({ message: 'No thought (or reaction) with those IDs.' });
      }

      console.log(
        '→ remaining reactions:',
        updatedThought.reactions.map(r => r.reactionId.toString())
      );
      return res.json(updatedThought);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
  };

// Exports
module.exports = thoughtController;