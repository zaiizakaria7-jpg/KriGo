import Agency from "../models/Agency.js";

export const create = async (req, res) => {
  const agency = await Agency.create(req.body);
  res.json(agency);
};

export const getAll = async (req, res) => {
  const agencies = await Agency.find();
  res.json(agencies);
};

export const update = async (req, res) => {
  const agency = await Agency.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(agency);
};

export const remove = async (req, res) => {
  await Agency.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
