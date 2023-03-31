const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary');
const formattedDate = require('../functions');
//const final_result = require('../functions');
const User = require('../models/user');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {  // order does matter here, if this
    res.render('campgrounds/new');              //    was after /:id it would try to math the new with id
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;

    const reqfiles = req.files.map( f => (f.mimetype));
    const checkFile = (item) => {
        if (item.slice(0, 5) !== 'image'){
            return false
        }
        let res = item.slice(6);
    
        if (res == 'jpeg' || res == 'jpg' || res == 'png'){
            return true
        }else{
            return false
        }
    }   
    const final_result = (file_arr) => {
        let result = file_arr.map(f => checkFile(f))
        return result.includes(false)
    }
    if (final_result(reqfiles) == true){
        req.flash('error', 'Accepted files types are jpeg, png, jpg only');
        return res.redirect('/campgrounds/new');
    }

    campground.images = req.files.map(f=> ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    campground.created_at = formattedDate();
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampgrounds = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}



module.exports.authorscampgrounds = async(req, res) => {
    //console.log('Hittting this route')
    const { username } = req.params;
    //console.log("Username: " + username)
    try{
        const person = await User.find({username: username});
        //console.log(person[0]._id);
        const campgrounds = await Campground.find({author: person[0]._id});
        //console.log(campgrounds)
        //console.log('hello')
        res.render('campgrounds/authors_camps', {campgrounds, person} );
    }catch(e){
        console.log(e)
    }
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    campground.geometry = geoData.body.features[0].geometry;

    const imgs = req.files.map(f=> ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated a campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect('/campgrounds')
}