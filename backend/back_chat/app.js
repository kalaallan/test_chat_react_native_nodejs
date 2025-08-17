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

app.use(cors());
app.use(express.json())
app.use('/api/auth', authRoutes);

const users = {};
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('register', (userId) => {
    users[userId] = socket.id; 
    Object.entries(users).forEach(([id, socketId]) => {
      console.log(`User ${id} is connected with socket ID: ${socketId}`);
    });
    
    console.log(`User ${userId} registered, socket ID: ${socket.id}`);
  });

  socket.on('sendMessage', (data) => {
    const recipientSocketId = users[data.receiverId];
    const senderSocketId = users[data.userId];
    console.log(`Message from ${data.userId} to ${data.receiverId}, recipient socket ID: ${recipientSocketId}`);
    console.log(`Message from ${data.userId} to ${data.userId}, sender socket ID: ${senderSocketId}`);
    if (recipientSocketId || senderSocketId) {
      io.to(recipientSocketId).emit('message', {
        message: data.message,
        userId: data.userId,
        receiverId: data.receiverId 
      });
      io.to(senderSocketId).emit('message', {
        message: data.message,
        userId: data.userId,
        receiverId: data.receiverId 
      });
    }else{
      console.log('Destinataire non trouvé!');
    }
  });

  let manualLogout = false;

  socket.on('logout',(userId) => {
    manualLogout = true;
    if (users[userId]) {
      delete users[userId];
      console.log(`User ${userId} logged out and removed from users list`);
    }
  });

  socket.on('disconnect', () => {
    if(!manualLogout) {          // Nettoyage amélioré
      Object.keys(users).forEach(userId => {
        if (users[userId] === socket.id) {
          delete users[userId];
        }
      });
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