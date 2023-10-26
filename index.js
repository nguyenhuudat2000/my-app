import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/user.js';

const app = express();

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/auth', userRoutes);

app.use('/', (req, res) => {
  res.send('server is running');
})

const CONNECTION_URL = 'mongodb+srv://huudat09112000:huudat09112000@cluster0.yitaz.mongodb.net';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));