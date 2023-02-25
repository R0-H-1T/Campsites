const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


const formattedDate = () => {
    d = new Date()
    cd = num => num.toString().padStart(2, 0)
    return cd(d.getDate())+" "+month[d.getMonth()]+" "+d.getFullYear() + 
             " at "+ cd(d.getHours())+":"+cd(d.getMinutes())
};


module.exports = formattedDate;