import app from './app';
import {env} from './helpers/env.helper';
import mongoose from 'mongoose';

const PORT = env.PORT;

/// Start the server
const mongooseDbOptions = {
    autoIndex: true, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  }; //=> có thể theo dõi mongooseDbOptions trên githurt

const MongoDB_URI = env.MONGODB_URI

mongoose
  .connect(MongoDB_URI as string, mongooseDbOptions)
  .then(() => {
    console.log('Connected to mongoDB success !');
    app.listen(PORT, () => {
        console.log(`Sever is running on port http://localhost:${PORT}`);  
    });
  })
  .catch((err) => {
    console.error('Failed to Connect to MongooDB', err);
  });

