const express = require("express");

const app = express();
const port = 3004;
const mysql = require("./connection").con;
// configuration

app.set("view engine","hbs");
// app.set("views","view");  if we changed views name
app.use(express.static(__dirname + "/public"));

//routing
app.get("/",(req,res)=>{
    res.render("index");
});

app.get('/add',(req,res)=>{
    res.render("add");
});

app.get('/search',(req,res)=>{
    res.render("search");
});
app.get('/update',(req,res)=>{
    res.render("update");
});
app.get('/delete',(req,res)=>{
    res.render("delete");
});
// app.get('/view',(req,res)=>{
//     res.render("view");
// });

app.get('/addstudent',(req,res)=>{
    // fetching data from form
    // res.send(req.query)
    const {name,phone,email,gender} = req.query;

    //sanitization XSS..
    let qry = "select * from persons ";
    mysql.query(qry,(err,results)=>{
        if(err)
            throw err;
        else{
            mysql.query("select phoneno from persons where phoneno=?",phone,(err,results)=>{
                if(results && results.length){
                    res.render("add",{checkmesg:true});
                }
                else{
                    //insert query
                    let qry2 = "insert into persons values(?,?,?,?)";
                    mysql.query(qry2,[name,phone,email,gender],(err,results)=>{
                        if(results.affectedRows>0){
                            res.render("add",{mesg:true});
                        }
                    })
                }     
            });
        }

    })
});

app.get("/searchstudent",(req,res)=>{

    const {phone} = req.query;
    let qry = "select * from persons where phoneno=?";
    mysql.query(qry,[phone],(err,results)=>{
        if(err)
            throw err;
        else{
            if(results.length>0){
                res.render("search",{mesg1:true,mesg2:false,});
            }else{
                res.render("search",{mesg1:false,mesg2:true});
            }
        }
    });
});

app.get("/updatesearch",(req,res)=>{
    const {phone} = req.query;
    let qry = "select * from persons where phoneno=?";
    mysql.query(qry,[phone],(err,results)=>{
        if(err)
            throw err;
        else{
            if(results.length>0){
                res.render("update",{mesg1:true,mesg2:false,data:results});
            }else{
                res.render("update",{mesg1:false,mesg2:true});
            }
        }
    });
});

app.get("/updatestudent",(req,res)=>{
    const {phone,name,gender} = req.query;
    let qry = "update persons set username=?, gender=? where phoneno=?";
    mysql.query(qry,[name,gender,phone],(err,results)=>{
        if(err) throw err;
        else{
            if(results.affectedRows>0){
                res.render("update",{umesg:true});
            }
        }
    });
});

app.get("/removestudent", (req, res) => {

    // fetch data from the form
    const { phone } = req.query;

    let qry = "delete from persons where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {
                res.render("delete", { mesg1: false, mesg2: true })
            }
        }
    });
});

app.get("/view",(req,res)=>{
    const {phone} = req.query;
    let qry = "select * from persons";
    mysql.query(qry,(err,results)=>{
        if(err) throw err
        else{
            if(results.length>0){
                res.render("view",{data:results});
            }else{
                res.render("view",{mesg:true});
            }
        }
    })
})

app.listen(port,(err)=>{
    if(err)
    throw err
    else
    console.log("running");
});