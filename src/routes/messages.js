const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const messagesFile = path.join(__dirname, '../data/messages.json');

// Récupère les messages par type (mails, tickets, autres)
router.get('/:type', (req, res) => {
  try {
    const all = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    const arr = all[req.params.type] || [];
    res.json(arr);
  } catch (err) {
    console.error('Error reading messages:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Crée un nouveau message dans le type donné
router.post('/:type', (req, res) => {
  try {
    const all = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    const arr = all[req.params.type] || [];
    const nextId = arr.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    const newMsg = { id: nextId, ...req.body };
    arr.push(newMsg);
    all[req.params.type] = arr;
    fs.writeFileSync(messagesFile, JSON.stringify(all, null, 2), 'utf-8');
    res.status(201).json(newMsg);
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Met à jour un message existant
router.put('/:type/:id', (req, res) => {
  try {
    const all = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    const arr = all[req.params.type] || [];
    const idx = arr.findIndex(m => m.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Message non trouvé' });
    arr[idx] = { ...arr[idx], ...req.body };
    all[req.params.type] = arr;
    fs.writeFileSync(messagesFile, JSON.stringify(all, null, 2), 'utf-8');
    res.json(arr[idx]);
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Supprime un message
router.delete('/:type/:id', (req, res) => {
  try {
    const all = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
    let arr = all[req.params.type] || [];
    arr = arr.filter(m => m.id !== +req.params.id);
    all[req.params.type] = arr;
    fs.writeFileSync(messagesFile, JSON.stringify(all, null, 2), 'utf-8');
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router; 