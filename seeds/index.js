const cities=require('./cities')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const {places, descriptors} = require('./seedHelpers')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';




mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection //to shorten code a bit, else u'd have to write mongoose.connection everytime
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", ()=>{
    console.log('Database Connected')
})


const sample=(array)=>  array[ Math.floor( Math.random() * array.length) ]







const seeDB = async()=>{
    await Campground.deleteMany({});

    for(let i=0;i<6;i++){
        const random1000=Math.floor(Math.random()*1000) //any number below 1000
        const price=Math.floor(Math.random()*20)+10
        const camp=new Campground({
            author: '61a7c925a3d595e504a2cd6e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. At distinctio dolore architecto excepturi quasi! Et reprehenderit, ea quae sed modi porro facere? Sapiente libero odit temporibus ratione, excepturi a aliquam?',
            price,
            geometry: { 
                "type" : "Point", 
                "coordinates" : [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] 
            },
            images:  [
                {
                  url: 'https://res.cloudinary.com/dfhnujxxm/image/upload/v1638185861/YelpCamp/igzk4arjqrcocg7psyx7.jpg',
                  filename: 'YelpCamp/igzk4arjqrcocg7psyx7'
                }
                // {
                //     url: 'https://res.cloudinary.com/dfhnujxxm/image/upload/v1638196438/YelpCamp/hl20qu2qbtyg05pe0dgb.jpg',
                //     filename: 'YelpCamp/hl20qu2qbtyg05pe0dgb.jpg'
                // }
              ]
        })
        await camp.save()
    }
}

seeDB().then(()=>{
    mongoose.connection.close()
})