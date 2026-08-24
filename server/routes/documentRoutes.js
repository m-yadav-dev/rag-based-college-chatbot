const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.js');
const { uploadDocument, getDocuments } = require('../controllers/documentController.js');

// Routes
router.get('/', getDocuments);
router.post('/upload', upload.single('file'), uploadDocument);

module.exports = router;
