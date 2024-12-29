const mysql=require("mysql2");
const db=require("../config");
let connection =mysql.createConnection(db);
connection.connect((err)=>{
    if(err){
        console.log(err);
    }
    console.log("connected");
})
module.exports=connection.promise();