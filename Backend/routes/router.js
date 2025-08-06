const express = require('express')
const router = express();

// Routes
router.use('/contact', require('./contactUsRoute'));
router.use('/customized-bookings', require('./customizedBookingsRoute'));
router.use('/package-bookings', require('./packageBookingsRoute'));
router.use('/auth', require('./authRoute'));
router.use('/user', require('./userRoute'));
router.use('/services', require('./servicesRoutes'));
router.use('/service-categories', require('./serviceCategoryRoutes'));
router.use('/deals', require('./dealsRoute'));
router.use('/availability', require('./availabilityRoute'));

module.exports = router;