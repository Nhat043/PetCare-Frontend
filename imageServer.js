const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

// Ensure image/posts directory exists
const uploadDir = path.join(__dirname, 'image', 'posts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config for unique filenames
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'postimg-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: 'No file uploaded' });
    }
    // Return the image URL relative to the server
    const imageUrl = `/image/posts/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

// Serve images statically
app.use('/image/posts', express.static(uploadDir));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Image server running at http://localhost:${PORT}`);
    console.log(`Serving images from ${uploadDir}`);
}); 