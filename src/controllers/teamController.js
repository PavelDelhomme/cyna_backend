const { TeamMember } = require('../models');

exports.list = async (req, res) => {
  const members = await TeamMember.findAll();
  res.json(members);
};

exports.create = async (req, res) => {

  const { id, ...data } = req.body;
  const member = await TeamMember.create(data);
  res.status(201).json(member);
};

exports.update = async (req, res) => {
  const member = await TeamMember.findByPk(req.params.id);
  if (!member) return res.status(404).json({ error: 'Not found' });
  await member.update(req.body);
  res.json(member);
};

exports.remove = async (req, res) => {
  const member = await TeamMember.findByPk(req.params.id);
  if (!member) return res.status(404).json({ error: 'Not found' });
  await member.destroy();
  res.json({ success: true });
};