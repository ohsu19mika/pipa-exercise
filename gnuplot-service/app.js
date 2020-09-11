const express = require("express");
const body_parser = require("body-parser");
const gnuplot = require("gnuplot");

const {Base64Encode} = require("base64-stream");

const app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));


app.post("/", (req,res,next) => {
    const formula = req.body.formula;
    console.log(formula);

    gnuplot()
    .set("term png")
    .unset("output")
    .plot(formula, {end:true})
    .pipe(new Base64Encode())
    .pipe(res);

});

app.listen(80);