var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Baby Rhymes' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact us @Baby Rhymes'});
});

router.get('/mobile', function(req, res, next) {
  	var isAndroidDevice = false;

  	if(req.configJson.locals.os === 'AndroidOS'){
  		isAndroidDevice = true;
  	}
  	else{
  		isAndroidDevice = false;
  	}

  	if(isAndroidDevice){
  		res.redirect('https://play.google.com/store/apps/details?id=com.baby.android&hl=en');
  	}
  	else{
  		res.render('mobile', { title: 'Contact us @Baby Rhymes'});	
  	}
  	
});

router.post('/contact', function(req, res, next) {
  // Lets' save them in future, as of now just fake it...
  res.render('contact', { title: 'Contact us @Baby Rhymes',resSaved:true });
});

module.exports = router;
