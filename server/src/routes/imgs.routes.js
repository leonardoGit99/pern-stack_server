const { Router } = require('express'); // Extraemos Router de express y lo ejecutamos para que nos permita hacer el routing en nuestra app
const { createImg, createImgs, getImages } = require('../controllers/imgs.controllers');
const multer = require('multer');

const router = Router();
const upload = multer({ dest: 'public/' });

/* router.post('/images/single', upload.single('taskImage'), createImg);
router.post('/images/multiple', upload.array('imgs', 10), createImgs); */
router.get('/images/:id', getImages);
module.exports = router;