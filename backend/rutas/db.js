const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mi_base_datos', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

module.exports = conectarDB;