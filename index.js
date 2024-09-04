const express = require('express');
const cors=require('cors')
const dotenv=require('dotenv')
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const projectRoutes=require('./routes/projects')
const componentRoutes=require('./routes/component')
const subComponentRoutes=require('./routes/subcomponents')
const app = express();
dotenv.config()
app.use(express.json());
app.use(cors())
mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    // Initialize GridFSBucket
    app.locals.bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
})
.catch(err => console.log(err));


// Use Routes
 
app.use('/api/projects',projectRoutes)
app.use('/api/component',componentRoutes)
app.use('/api/subComponent',subComponentRoutes)
app.get('/', async (req, res) => {
    console.log('API is working');
    res.send('Welcome to the API!');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
