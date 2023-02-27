const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


const formattedDate = () => {
    d = new Date()
    cd = num => num.toString().padStart(2, 0)
    return cd(d.getDate())+" "+month[d.getMonth()]+" "+d.getFullYear() + 
             " at "+ cd(d.getHours())+":"+cd(d.getMinutes())
};


module.exports = formattedDate;



// let my_str = 'mime/jpeg';
// const res = my_str.slice(5)

// if (res == 'jpeg' || res == 'jpg' || res == 'png'){
//   console.log('It is an image')
// }else{
//   console.log('It is not an image')
// }


// const checkFile = (item) => {
//     if (item.slice(0, 5) !== 'image'){
//         return false
//     }
//     let res = item.slice(6);

//     if (res == 'jpeg' || res == 'jpg' || res == 'png'){
//         return true
//     }else{
//         return false
//     }
// }



// const final_result = (file_arr) => {
//     let result = file_arr.map(f => checkFile(f))
//     return result.includes(false)
// }

// module.exports = final_result;