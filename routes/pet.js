const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
// const paginate = require('express-paginate');
// const Mailchimp = require('mailchimp-api-v3');

// var utility = require('../utility/functions');


// var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

// //mysql db connection
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user:  process.env.DB_USER,
//     password:  process.env.DB_PASS,
//     database:  process.env.DB_NAME
// });

// // register email to mailchimp
// function verifyEmail(volunteer_name, volunteer_email){

//     console.log("mailchimp service start");

//     mailchimp.post('/lists/'+process.env.MAILCHIMP_LIST_UID+'/members', {
//         email_address : volunteer_email,
//         status : 'subscribed',
//         'merge_fields': {
//             'FNAME': volunteer_name
//         }
//       })
//       .then(function(results) {
//         console.log('email register success');
//       })
//       .catch(function (err) {
//         console.log('email register fail');
//       });


//     //   var options = {
//     //     host: 'us11.api.mailchimp.com',
//     //     path: '/3.0/lists/<myListID>/members',
//     //     method: 'POST',
//     //     headers: {
//     //         'Authorization': 'randomUser myApiKey',
//     //         'Content-Type': 'application/json',
//     //         'Content-Length': subscriber.length
//     //     }
//     // }

// }

//show simple first page
router.get('/', (req, res) => {
    res.render('landing', {
        breeds: "breed_data",
        countries: "country_data"
    });

});

router.get('/data_share', (req, res) => {
    res.render('data_share', {
        breeds: "breed_data",
        countries: "country_data"
    });

});

// //get json data and show census result
// router.get('/show', (req, res) => {
//     var fs = require('fs');
//     var latest_filename;

//     //get lastest file name
//     const cronjob_folder = 'public/cronjob/map/';

//     fs.readdir(cronjob_folder, (err, files) => {

//         latest_filename = files.sort()[files.length - 1];
//         console.log("latest filename: " + latest_filename);

//         fs.readFile('public/data/breed.txt', 'utf8', function (err, data) {
//             if (err) throw err;

//             //get breeds from file
//             var breed_data = data.split(',');

//             //get countries from json file
//             fs.readFile('public/data/country.json', 'utf8', function (err, data) {
//                 if (err) throw err;
//                 var json_data = JSON.parse(data);
//                 var country_json_data = json_data['data'];
//                 var country_data = [];

//                 for (var i = 0; i < country_json_data.length; i++) {
//                     country_data[i] = country_json_data[i]['name'];
//                 }

//                 //render to view
//                 res.render('first_census_result', {
//                     breeds: breed_data,
//                     countries: country_data,
//                     latest_filename: latest_filename
//                 });
//             });

//         });

//     });

// });


// //get json data and show census result
// router.post('/add', function (req, res) {

//     let name = req.body.username;
//     let email = req.body.email;
//     let animal_name = req.body.animal_name;
//     let breed = req.body.breed_data;
//     let country = req.body.country_data;
//     let comment = req.body.comment;
//     let photo_path = "";
//     let thumbnail_path = "";

//     if (email != "") {
//         req.checkBody('email', 'Email is not valid').isEmail();
//         let errors = req.validationErrors();
//         if (errors) {
//             email = "";
//             console.log("email is not valid");
//         }
//     }

//     console.log("name: " + name + ", animal: " + animal_name + ", breed: " + breed + ", email: " + email + ", country: " + country + ", comment: " + comment);

//     //upload image file
//     if (!req.files) {
//         console.log('No files were uploaded.');
//     } else {
//         console.log("file upload ");

//         // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//         let photoFile = req.files.photoFile;


//         if (photoFile != null) {
//             // photo_path = photoFile.name;
//             // thumbnail_path = photoFile.name;

//             let cur_time = new Date().getTime();
//             var upload_file_extension = path.extname(photoFile.name);
//             upload_file_extension = upload_file_extension.toLowerCase();

//             var image_extension_array = ['.jpg', '.bmp', '.png', '.gif'];

//             if (image_extension_array.indexOf(upload_file_extension) != -1) {

//                 photo_path = cur_time + upload_file_extension;

//                 console.log("uploaded filename: " + photo_path);

//                 // Use the mv() method to place the file somewhere on your server
//                 photoFile.mv('public/uploads/images/' + photo_path, function (err) {

//                     if (err)
//                         return res.status(500).send(err);

//                     console.log('start thumbnail image');

//                 });
//             }

//         }
//     }

//     //save to database
//     var cur_date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

//     var poll_record = [
//         [name, email, animal_name, breed, country, comment, photo_path, thumbnail_path, cur_date]
//     ];
//     connection.query("INSERT INTO poll (name, email, animal_name, breed, country, comment, photo_path, thumbnail_path, date) VALUES ?", [poll_record], function (err, result, fields) {
//         // if any error while executing above query, throw error
//         if (err) throw err;

//         console.log("insert data success");
//     });

//     if(email != ""){
//         //email verification using mailchimp
//         verifyEmail(name, email);
//     }

//     //show view page
//     res.redirect('/show');

// });


// // // git code, upload image and make thumbnail and save to database
// // router.post('/add', upload.single('photoFile'), (req, res) => {

// //     let cur_time = new Date().getTime();
// //     let upload_filename = cur_time + ".jpg";


// //         let name = req.body.username;
// //         let email = req.body.email;
// //         let animal_name = req.body.animal_name;
// //         let breed = req.body.breed_data;
// //         let country = req.body.country_data;
// //         let comment = req.body.comment;
// //         let thumbnail_path = "";

// //         if (email != "") {
// //             req.checkBody('email', 'Email is not valid').isEmail();
// //             let errors = req.validationErrors();
// //             if (errors) {
// //                 email = "";
// //                 console.log("email is not valid");
// //             }
// //         }

// //         let photo_path = req.file ? upload_filename : 'default.png';
// //         let imagePath = req.file ? req.file.path : null; // added

// //         _saveThumbnail(imagePath).then(() => { // edited arg
// //             //save to database
// //             var cur_date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

// //             var poll_record = [
// //                 [name, email, animal_name, breed, country, comment, photo_path, thumbnail_path, cur_date]
// //             ];
// //             connection.query("INSERT INTO poll (name, email, animal_name, breed, country, comment, photo_path, thumbnail_path, date) VALUES ?", [poll_record], function (err, result, fields) {
// //                 // if any error while executing above query, throw error
// //                 if (err) throw err;

// //                 console.log("insert data success");
// //             });
// //         });

// // });


// //get database data and show second detail page
// router.get('/detail', (req, res) => {

//     req.query.limit;

//     if(req.params.start_num == null)
//         var start_num = 0;
//     else
//         var start_num = req.params.start_num;

//     connection.query("SELECT count(*) as num_rows from poll", (err, rows, fileds) => {
        
//         var num_rows = rows[0]['num_rows'];

//         connection.query("SELECT * FROM poll ORDER BY date DESC LIMIT " + req.skip + ", " + req.query.limit, (err, results, fields) => {
//             if (err) {
//                 console.log(err)
//                 res.end()
//             }
    
//             const itemCount = results.length;
//             const pageCount = Math.ceil(num_rows / req.query.limit);
//             const currentPage = req.query.page;

//             //render to view
//             res.render('second', {
//                 rows: results,
//                 pageCount,
//                 itemCount,
//                 currentPage,
//                 pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
//             });
    
//         });
//     });
    

// });

// //cron job for daily backup
// router.get('/json_backup', (req, res) => {
//     utility.svg_cron();
// });

module.exports = router;
