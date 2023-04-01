const User = require('../models/user');
const Campground = require('../models/campground');

// var passport = require("passport");
// var LocalStrategy= require("passport-local");
// var passportLocalMongoose = require("passport-local-mongoose");

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!!');
        res.redirect('/campgrounds');
        })
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.yourcampgrounds = async(req, res) => {
    const person = req.user._id; 
    if(person){
        const campgrounds = await Campground.find({author: person});
        res.render('users/yourcamp', { campgrounds });
    }
}

module.exports.showProfile = async(req, res) => {
    const person = req.user._id; 
    if (person){   
        const myProfile = await User.findById(person)
        res.render('users/myprofile', { myProfile});

    }   
}



module.exports.updateProfile = async(req, res) => {
    try{

       
        
        
        const id  = req.user._id;
        console.log(id)
        //console.log({ ...req.body.user1})
        // const oldUser = await User.findOne({ username: req.body.user1.email })
        // await oldUser.setPassword(newPassword);
        // await oldUser.save();


        const { email, username } = req.body.user1;
        console.log(email)
        console.log(username)
        try{
            const person = await User.findByIdAndUpdate(id, { email, username })
            await person.save()
        }catch(error){
            console.log(error)
            req.flash('error', 'Invlid username or email');
            return res.redirect('/profile');
            // console.log(error)
            // req.flash('success', 'Welcome to YelpCamp!!');

        }
        


        //the password is not getting saved
        //password not getting uploaded
        //rest is working
        //for now the username will get updated but not the password!
        console.log('Saved')
        User.findById(id)
        .then(foundUser => {
            foundUser.setPassword(req.body.user1.password)
                .then(() => {
                    console.log('password changed');
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        });

        req.flash('success', 'Successfully updated your profile');
        res.redirect(`/campgrounds`)
    }catch(e){
        console.log(e.message)
        //res.redirect('/campgrounds')
    }

}


module.exports.logout = (req, res) =>{
    req.logOut();
    req.flash('success', 'GoodBye!');
    res.redirect('campgrounds');
}
