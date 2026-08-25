const express = require('express');
const router = express.Router();
const upload = require('../../../middlewares/upload');
const { uploadDocument, getDocuments } = require('./documentController');

// Routes
router.get('/', getDocuments);
router.post('/upload', upload.single('file'), uploadDocument);

module.exports = router;
