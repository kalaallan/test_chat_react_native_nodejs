const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const protect = require('../middleware/authMiddleware');


const router = express.Router();


router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({email});
    // On vérifie si l'utilisateur existe déjà
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Créer un nouvel utilisateur
    const user = new User({ email, password, name });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Vérifier le mot de passe
    if(user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, name: user.name, email: user.email, _id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User login failed' });
  }
});

router.get('/allUser', async (req, res) => {
  try {

    let allUsers = await User.find().select('-password');
    res.json(allUsers);

  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;  