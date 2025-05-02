const corsOptions = {
    origin: ['http://localhost:5173', 'https://speak-fresh-frontend.vercel.app'], // Allow both localhost and Vercel
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ]
};

module.exports = corsOptions; 