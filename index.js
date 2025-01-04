const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BMI Calculator</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .container { max-width: 400px; margin: auto; }
        form { display: flex; flex-direction: column; gap: 10px; }
        input, button { padding: 10px; font-size: 16px; }
        button { background-color: #007BFF; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #0056b3; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>BMI Calculator</h1>
        <form action="/calculate-bmi" method="POST">
          <label for="weight">Weight (kg):</label>
          <input type="number" id="weight" name="weight" step="0.1" min="0" required>
          <label for="height">Height (m):</label>
          <input type="number" id="height" name="height" step="0.01" min="0" required>
          <button type="submit">Calculate BMI</button>
        </form>
      </div>
    </body>
    </html>
  `);
});
app.post("/calculate-bmi", (req, res) => {
    const { weight, height } = req.body;

    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.send(`
      <h3>Please provide valid positive numbers for weight and height.</h3>
      <a href="/">Back</a>
    `);
    }

    const bmi = (weight / (height * height)).toFixed(2);
    let category;

    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
    } else {
        category = "Obese";
    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Calculator BMI</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .underweight { color: blue; }
        .normal-weight { color: green; }
        .overweight { color: orange; }
        .obese { color: red; }
      </style>
    </head>
    <body>
      <h3>Your BMI is: ${bmi}</h3>
      <h3>You are categorized as: <span class="${category.toLowerCase().replace(" ", "-")}">${category}</span></h3>
      <a href="/">Back</a>
    </body>
    </html>
  `);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const nodemailer = require("nodemailer");

const sendEmail = async () => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "olzhaskarabekov97@gmail.com",
                pass: "Olzhas06"
            }
        });

        const mailOptions = {
            from: "olzhaskarabekov97@gmail.com",
            to: "olzhaskarabekov97@gmail.com",
            subject: "your BMI",
            text: "Hello! This is a result about your BMI.",
            attachments: [
                {
                    filename: "",
                    content: ""
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};