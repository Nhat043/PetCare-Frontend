const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Tạo tên file unique với timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Chỉ cho phép upload hình
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép upload file hình!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

// Middleware để serve static files
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse JSON và form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route để upload hình
app.post('/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: 'Không có file được upload' });
        }

        // Tạo URL để truy cập file
        const imageUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.json({ success: false, message: 'Lỗi khi upload file' });
    }
});

// Route để lưu bài viết
app.post('/save', (req, res) => {
    try {
        const { title, content_html } = req.body;

        // Tạo thư mục posts nếu chưa có
        const postsDir = path.join(__dirname, 'posts');
        if (!fs.existsSync(postsDir)) {
            fs.mkdirSync(postsDir, { recursive: true });
        }

        // Tạo file HTML cho bài viết
        const timestamp = Date.now();
        const filename = `post-${timestamp}.html`;
        const filepath = path.join(postsDir, filename);

        const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="content">
        ${content_html}
    </div>
    <p><small>Được tạo lúc: ${new Date().toLocaleString('vi-VN')}</small></p>
</body>
</html>`;

        fs.writeFileSync(filepath, htmlContent, 'utf8');

        res.json({
            success: true,
            message: 'Bài viết đã được lưu thành công!',
            filename: filename,
            filepath: filepath
        });
    } catch (error) {
        console.error('Save error:', error);
        res.json({ success: false, message: 'Lỗi khi lưu bài viết' });
    }
});

// Route để xem danh sách bài viết
app.get('/posts', (req, res) => {
    try {
        const postsDir = path.join(__dirname, 'posts');
        if (!fs.existsSync(postsDir)) {
            return res.json({ posts: [] });
        }

        const files = fs.readdirSync(postsDir)
            .filter(file => file.endsWith('.html'))
            .map(file => ({
                filename: file,
                url: `/posts/${file}`,
                created: fs.statSync(path.join(postsDir, file)).mtime
            }))
            .sort((a, b) => b.created - a.created);

        res.json({ posts: files });
    } catch (error) {
        console.error('List posts error:', error);
        res.json({ posts: [] });
    }
});

// Serve các file HTML trong thư mục posts
app.use('/posts', express.static(path.join(__dirname, 'posts')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`Thư mục uploads: ${uploadDir}`);
    console.log(`Thư mục posts: ${path.join(__dirname, 'posts')}`);
}); 