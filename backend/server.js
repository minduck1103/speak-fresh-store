const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const connectDB = require('./config/db');
connectDB();
const app = require('./app');

const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
    () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
}); 