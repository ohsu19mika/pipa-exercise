const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
//const btoa = require("btoa");

const formula_schema = new mongoose.Schema({
  formula: {
    type: String,
    required: true,
  },
  plot_image: {
    type: String,
    required: true,
  },
});

const formula_model = mongoose.model("formula", formula_schema);
const PORT = process.env.PORT || 80;
const app = express();

app.use(
  body_parser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res, next) => {
  formula_model.find({}).then((formulas) => {
    res.write(`    
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Plot formula</title></head>
    <body>`);

    formulas.forEach((formula) => {
      res.write(formula.formula + "<br>");
      if (formula.plot_image) {
        res.write(`<img style='display:block; width:300px;height:300px;' src='${formula.plot_image}'/>` + "<br>");
      }
      res.write("<br><hr><br>");
    });

    res.write(
      `
        <form action="/formula" method="POST">
            <input type="text" name="formula">
            <button type="submit">Plot formula</button>
        </form>
    </body>
    </html>
    `
    );
    res.end();
  });
});

app.post("/formula", (req, res, next) => {

  const plot_request = {
    formula: req.body.formula
  };
  console.log(plot_request);

  axios.post('http://gnuplot-service', plot_request, {
      responseType: 'arraybuffer'
    })
    .then((response) => {
      // const image_base64 = btoa(
      //   new Uint8Array(response.data)
      //   .reduce((data, byte) => data + String.fromCharCode(byte), '')
      // );

      const image_src = `data:image/png;base64,${response.data}`;
      //console.log("image_src:", image_src);

      let new_formula = new formula_model({
        formula: req.body.formula,
        plot_image: image_src
      });

      new_formula.save().then(() => {
        res.redirect("/");
      });
    });

});

//const mongoose_url = "mongodb://mongodb:27017/appdb";
const mongoose_url = "mongodb://mongodb/appdb";

console.log(mongoose_url);

mongoose
  .connect(mongoose_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Mongoose connected");
    console.log("Start Express server");
    app.listen(PORT);
  });