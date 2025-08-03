const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/contact', require('./routes/contactUsRoute'));
app.use('/api/customized-bookings', require('./routes/customizedBookingsRoute'));
app.use('/api/package-bookings', require('./routes/packageBookingsRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/services', require('./routes/servicesRoutes'));
app.use("/api/service-categories", require("./routes/serviceCategoryRoutes"));
app.use('/api/deals', require('./routes/dealsRoute'));
app.use('/api/availability', require('./routes/availabilityRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
