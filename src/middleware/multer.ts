import multer from 'multer';
import path from 'path';

const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});



const upload = multer({ storage ,limits: { fileSize: 1000000 } });
export default upload


