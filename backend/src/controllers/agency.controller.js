const Agency = require("../models/Agency");

const create = async (req, res) => {
  try {
    const agency = await Agency.create(req.body);
    res.json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Agency.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getAll, update, remove };