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
    if (!agency) {
      return res.status(404).json({ message: "Agence non trouvée" });
    }
    res.json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
        return res.status(400).json({ message: "Statut invalide. Utilisez 'active' ou 'suspended'." });
    }

    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!agency) {
      return res.status(404).json({ message: "Agence non trouvée" });
    }

    res.json({ message: `Agence ${status === 'active' ? 'activée' : 'suspendue'} avec succès`, agency });
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

module.exports = { create, getAll, update, updateStatus, remove };