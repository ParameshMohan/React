var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var mysql = require('mysql');
const bodyParser = require("body-parser");

var app= express();

app.use(bodyParser.json());

var coursesData = 
    {
        name: '',
        password: '',
       
    }

// GraphQL schema
var schema = buildSchema(`
type Query {

    validate(name : String, password :String )  : Course
}

type Course{
    name: String
    password: String
}
`);





var getData = function(args,err) {
    console.log("we are giving args ",args);
     var name1 = args.name;
     var password1 = args.password;

     
//mysql connection 
var mysqlConnection = mysql.createConnection({
    host : "ckoanbx1y4aq.ckoanbx1y4aq.eu-west-1.rds.amazonaws.com",
    user : "test",
    password : "P@ssw0rd_Test",
    database : "test",
    port: 3307,
    multipleStatements : true
});
mysqlConnection.connect((err)=>{
    if(err) {
        console.log("failed");
      //throw( err); 
    }
var sql = "SELECT * from Firsttable"
mysqlConnection.query(sql,(err, data, fields) => {
    if(err) console.log( err);
    console.log(JSON.stringify(data))


    //console.log('The solution is: ', data);
    console.log("this is data" ,data)
coursesData = JSON.stringify(data);

console.log('this is course data', coursesData);
   mysqlConnection.end();
})
});

    //  console.log(name1);
    //  console.log(password1);
     console.log(" course data coming from mysql ", coursesData);
     coursesData=JSON.parse(coursesData);
console.log("course name ", coursesData[0]);


 if (coursesData[0].name === name1  && coursesData[0].password === password1){
console.log("args is ",args );
console.log("course name ", coursesData[0]);

    return coursesData[0];
 }

else 
{
    return console.log('fail');
    //throw err;
    
}
    // var password1 = args.password 
//     if (args.name === 'admin' && args.password === 'admin') {
//       return coursesData.filter(course  => { if (name1 === courseData.name && password1 === courseData.password1){res.status(200).json({
//                         status: 'success',
//                         type: 'admin'
//                     }
                
//                 )}
      
//       else {
//         return coursesData.filter(course => res.status(401).json({
//         status: 'failure',
//         message: 'Not a valid user'
//     }))
// }
//      }
//                 );
//         }

//  if (args.name) {
//    var name1 = args.name;
//    console.log(coursesData);
//    var res= coursesData.filter(course => course.name === name1);
// console.log(res);
//    return res[0];
//  } else {
//  return coursesData;
//  }
   
    }
    //  if(username === 'driver1' && password === 'driver1') {
    //     return res.status(200).json({
    //         status: 'success',
    //         type: 'user'
    //     });
    // }
     


    
// var getCourses = function(args) {
//     if (args.topic) {
//         var topic = args.topic;
//         return coursesData.filter(course => course.topic === topic);
//     } else {
//         return coursesData;
//     }
// }

var root = {
    validate  : getData
    // courses: getCourses
};
// Create an express server and a GraphQL endpoint
// var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


// app.use((req, res, next) => {
//     req.mysqlDb = mysql.createConnection({
//       host     : 'ckoanbx1y4aq.ckoanbx1y4aq.eu-west-1.rds.amazonaws.com',
//       user     : 'test',
//       password : 'P@ssw0rd_Test',
//       database : 'test'
//     });
//     req.mysqlDb.connect();
//     next();
//   });

app.listen(9001, () => console.log('Express GraphQL Server Now Running On localhost:9001/graphql'));
