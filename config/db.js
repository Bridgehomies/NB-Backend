<<<<<<< HEAD
// config/db.js - Optimized for Vercel (serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'nabeera' // optional: specify DB name
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

=======
// config/db.js

const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
>>>>>>> 6b1badc66a0c621422d201cdb2e2925adbebd945
module.exports = connectDB;