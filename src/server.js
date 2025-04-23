const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Mount API routes here
// const userRoutes = require('./routes/api/userRoutes');
// app.use('/api/users', userRoutes);
// similarly for thoughtRoutes...

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
