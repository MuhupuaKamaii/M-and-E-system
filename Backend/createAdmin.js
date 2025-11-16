require('dotenv').config();

const bcrypt = require('bcrypt');
bcrypt.hash('Admin123', 10).then(console.log);