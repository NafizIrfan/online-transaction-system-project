var express = require('express');
var router = express.Router();
var User = require('../models/user');



// Route for login
router.get('/', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/', function (req, res, next) {
	User.findOne({email:req.body.email},function(err,data){
		if(data){

			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				console.log(data);

			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});


// route for registration
router.get('/register', function (req, res, next) {
	return res.render('register.ejs');
});


router.post('/register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;

	if(!personInfo.fullname || !personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf || !personInfo.balance){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							fullname:personInfo.fullname,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf,
							balance: personInfo.balance
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Registration Done.');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"Regestered, Please login."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

//route for logout
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

//Route for password reset
router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Password Updated');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});

});


// Route for dashboard
router.get('/dashboard', function (req, res, next) {
	console.log("dashboard");
	User.findOne({unique_id:req.session.userId},function(err,data){
		//console.log("data");
		//console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('dashboard.ejs', {"username":data.username});
		}
	});
});


//Route for user information
router.get('/profile', function (req, res, next) {
	console.log("profile information");
	User.findOne({unique_id:req.session.userId},function(err,data){
		//console.log("data");
		//console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"fullname":data.fullname,"username":data.username,"email":data.email,"balance":data.balance});
		}
	});
});

//Route for balance check
router.get('/balance', function (req, res, next) {
	console.log("balance check");
	User.findOne({unique_id:req.session.userId},function(err,data){
		//console.log("data");
		//console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('balance.ejs', {"username":data.username,"balance":data.balance});
		}
	});
});

//Route for deposit balance
router.get('/deposit', function (req, res, next) {
	console.log("deposit");
	User.findOne({unique_id:req.session.userId},function(err,data){
		//console.log("data");
		//console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('deposit.ejs', {"username":data.username,"balance":data.balance});
		}
	});
});

router.post('/deposit', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){

		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.balance) {
				var num1 = parseInt(data.balance);
				var num2 = parseInt(req.body.balance);
				var sum = Number(num1+num2);
			data.balance= Number(sum);

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log(data);
					console.log('Deposit Done');
					res.send({"Success":"Money deposit done"});

			});
		}else{
			res.send({"Success":"Plese try again"});
		}
		}
	});

});

//Route for withdraw balance
router.get('/withdraw', function (req, res, next) {
	console.log("withdraw");
	User.findOne({unique_id:req.session.userId},function(err,data){
		//console.log("data");
		//console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('withdraw.ejs', {"username":data.username,"balance":data.balance});
		}
	});
});

router.post('/withdraw', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){

		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.balance) {
				var num1 = parseInt(data.balance);
				var num2 = parseInt(req.body.balance);
				var sub = Number(num1-num2);
			data.balance= Number(sub);

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log(data);
					console.log('Withdraw Done');
					res.send({"Success":"Money withdrawal done"});
			});
		}else{
			res.send({"Success":"Plese try again"});
		}
		}
	});

});

// Route for contactpage
router.get('/contact', function (req, res, next) {
	console.log("contact");
	return res.render('contactInfo.ejs');

});


module.exports = router;
