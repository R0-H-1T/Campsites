const inDep=require('./in')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const {places, descriptors} = require('./seedHelpers')
const formattedDate = require('../functions')

// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }

require('dotenv').config();


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';




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




//https://res.cloudinary.com/dfhnujxxm/image/upload/v1638438787/YelpCamp/fily0t0ignya8tlq9fj3.jpg


const seeDB = async()=>{
    await Campground.deleteMany({});

    for(let i=0;i<6;i++){
        const random1000=Math.floor(Math.random() * 300) //any number below 1000
        //console.log(random1000)
        const price=Math.floor(Math.random()*1000)+500
        const camp=new Campground({
            author: '61a5985b281afc4f54c734c5',
            created_at: formattedDate(),
            location: `${inDep[random1000].city}`,    
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. At distinctio dolore architecto excepturi quasi! Et reprehenderit, ea quae sed modi porro facere? Sapiente libero odit temporibus ratione, excepturi a aliquam?',
            price,
            geometry: { 
                "type" : "Point", 
                "coordinates" : [
                    inDep[random1000].lng,
                    inDep[random1000].lat
                ] 
            },
            images:  [
                {
                  url: 'https://res.cloudinary.com/dfhnujxxm/image/upload/v1638185861/YelpCamp/vzdqkp6cewnccr3mr8wg.jpg',
                  filename: 'YelpCamp/vzdqkp6cewnccr3mr8wg'
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