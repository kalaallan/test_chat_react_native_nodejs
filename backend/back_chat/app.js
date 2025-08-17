const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
dotenv.config(); // chargement des variables d'environnement

const app = express()
const port = 5000
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes);

const users = {};

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // Enregistrer l'utilisateur avec son email (userId) lors de sa connexion
  socket.on('register', (userId) => {
    // Enregistrer le `userId` (email) et associer avec `socket.id`
    users[socket.id] = userId;
    console.log(`User ${userId} registered with socket id: ${socket.id}`);
  });

  // Envoi du message au destinataire
  socket.on('sendMessage', (data) => {
    console.log('Message reçu:', data);
    
    // Trouver le socket du destinataire à partir du `receiverId`
    const recipientSocketId = users[data.receiverId];  
    console.log(`Message envoyé à ${data.receiverId}`);// Récupérer l'ID du destinataire
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message', {
        message: data.message,
        userId: data.userId,
      });
      console.log(`Message envoyé à ${data.receiverId}`);
    } else {
      console.log('Destinataire non trouvé!');
    }
  });

  // Déconnexion de l'utilisateur et suppression du `userId` dans `users`
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    for (const [userId, id] of Object.entries(users)) {
      if (id === socket.id) {
        delete users[userId];
        console.log(`User ${userId} removed from active users list`);
        break;
      }
    }
  });
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))


// lancement du serveur
server.listen(process.env.PORT || port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});