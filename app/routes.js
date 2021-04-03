module.exports = function(app, db, passport, ObjectId) {


/********************
=====Base routes=====
*********************/

    // Load root index ===================================================
    app.get('/', function(req, res) {
      res.render('index.ejs', {
        message: req.flash('loginMessage')
      })
      // res.redirect('/dashboard')
    })

    app.get('/cashier', function(req, res) {
      db.collection('orders').find({complete: false}).toArray((err, result) => {
        if(err) return console.log(err)
        console.log(result)
        res.render('cashier.ejs', {
          drinks: result
        })
      })

    })

    app.get('/barista', isLoggedIn, (req, res) => {
      db.collection('orders').find({clear: false}).toArray((err, result) => {
        if(err) return console.log(err)
        res.render('barista-dash.ejs' , {
          drinks: result
        })
      })
    })

    app.get('/manager', isLoggedIn, (req, res) => {
      db.collection('orders').find().toArray((err, result) => {
        if(err) return console.log(err)
        res.render('manager.ejs' , {
          drinks: result
        })
      })
    })

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
      res.render('signup.ejs', {
        message: req.flash('signupMessage')
      })
    })



    /**************************
    =====Dashboard routes=====
    **************************/

    app.post('/order', (req, res) => {
      console.log('************ORDER*********')
      console.log(req.body)
      db.collection('orders').insertOne({
        name: req.body.name,
        drink: req.body.drink,
        complete: false,
        barista: '',
        clear: false,
      }, (err, result) => {
        if(err) return console.log(err)
        console.log('new order saved')
        res.redirect('/cashier')
      })
    })

    app.put('/complete', isLoggedIn, (req, res) => {
      console.log(`Completing order ${req.body._id}`)
      let baristaNew = !req.body.complete? req.user.local.email : ''
      db.collection('orders').findOneAndUpdate({
        _id: ObjectId(req.body._id)
      }, {
        $set: {
          complete: !req.body.complete,
          barista: baristaNew
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if(err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/clear', isLoggedIn, (req, res) => {
      console.log(`Clearing order ${req.body._id}`)
      db.collection('orders').findOneAndUpdate({
        _id:ObjectId(req.body._id)
      }, {
        $set: {
          clear: true
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/barista')
      })
    })

    app.get('/dashboard', function(req, res) {
      db.collection('foodAid').find().toArray((err, result) => {
        if(err) return console.log(err)
        res.render('dashboard.ejs', {
          foodaid: result,
          title: 'Dashboard'
        })
      })
    })



    app.put('/request', function(req, res) {
      db.collection.findOneAndUpdate({
        _id:req.body._id
      }, {
        $set:
          {
            status: 'request',
            requestor: req.body.userID
          }
      }, {
        sort: {_id: -1},
        upsert:true
      }, (err, result) => {
        if(err) return res.send(err)
        res.send(result)
      })
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/barista', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login-manager', passport.authenticate('local-login', {
        successRedirect : '/manager', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/barista', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
