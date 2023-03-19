require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000 | process.env.PORT;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken")
const Employee = require('../models/Employee');
const Employeer = require('../models/Employeer');


// Body-parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


exports.getAuth = tryCatch(async(req,res)=>{
    console.log(req.user)
    res.json({
        status:"success"
    })
})

exports.getCallback = tryCatch(async(req,res)=>{
    
    // console.log(req.user.emails[0].value)
    const employee = await Employee.find({email:req.user.emails[0].value});
    // const employeer = await Employeer.find({email:req.user.emails[0].value});

    if(employee)
    {
        
        // console.log("here 1")
        
        const accessToken = jwt.sign({employee},process.env.ACCESS_TOKEN);
        localStorage.setItem('status', 'employee');

        return res.cookie("access_token",accessToken).json({
            status:"Successful as employee",
            token:accessToken,
            data:employee
        })
    }
    const employeer = await Employeer.find({email:req.user.emails[0].value});
    if(employeer)
    {
    // console.log("here 2")

        const accessToken = jwt.sign({employeer},process.env.ACCESS_TOKEN);
        localStorage.setItem('status', 'employeer');

        return res.cookie("access_token",accessToken).json({
            status:"Successful as employee",
            token:accessToken,
            data:employeer
        })
    }

    res.json({
        status:"failure, user not found"
    })  
  
})