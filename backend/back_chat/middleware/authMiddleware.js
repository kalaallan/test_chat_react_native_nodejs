const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  console.log('Request Headers:', req.headers);
  const token = req.headers['Authorization']?.replace('Bearer ', '');
  if(!token){
    return res.status(401).json({ error: 'No token provided, access denied' });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  }catch(err){
    return res.status(403).json({ error: 'Invalid token, access denied' });
  }


};

module.exports = protect;
