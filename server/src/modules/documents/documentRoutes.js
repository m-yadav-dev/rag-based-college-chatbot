const express = require('express');
const router = express.Router();
const upload = require('../../../middlewares/upload');
const requireAuth = require('../../../middlewares/requireAuth');
const { uploadDocument, getDocuments, deleteDocument, renameDocument } = require('./documentController');

// Inline Admin Auth Middleware
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
};

// Routes
router.get('/', requireAuth, getDocuments);
router.post('/upload', requireAuth, requireAdmin, upload.single('file'), uploadDocument);
router.delete('/:id', requireAuth, requireAdmin, deleteDocument);
router.patch('/:id/rename', requireAuth, requireAdmin, renameDocument);

module.exports = router;
