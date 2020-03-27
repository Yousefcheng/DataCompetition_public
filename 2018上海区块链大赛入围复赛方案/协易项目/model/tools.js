const md5 = require('md5');
const multer = require('koa-multer');
let tools={
    multer(){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*»ñÈ¡ºó×ºÃû  ·Ö¸îÊý×é*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        });
        var upload = multer({ storage: storage });
        return upload;
    },
    md5(str){
        return md5(str)
    },

};

module.exports=tools;