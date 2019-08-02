var mysql = require("mysql")
var inquirer = require("inquirer")
var arrayToTable = require('array-to-table')


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
})

connection.query("SELECT * FROM products", function(err, res){
    // takes response and creates a table
    console.log(arrayToTable(res))
    inquirer.prompt([
        {
            name: "q1",
            message: "Enter the ID of the product you would like to purchase.",
            type: "input"
        },
        {
            name: "q2",
            message: "Enter desired quantity. ",
            type: "input"
        }
    ]).then(function(answers){
        for (var i=0; i < res.length; i++){
            if(answers.q1 == res[i].item_id){
                if( answers.q2 > res[i].stock_quantity){
                    console.log("\nInsufficient quantity! \nOnly " + res[i].stock_quantity + " available. \n\nOrder not placed.\n")
                    connection.end()
                } else {          
                    var newQuantity = res[i].stock_quantity - answers.q2
                    var amtCharged = res[i].price * answers.q2
                    var name = res[i].depart_name
                    var id = res[i].item_id

                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: id}], function(err,res){
                        if (err) throw err
                        console.log("\nPuchased: " + name)
                        console.log("Charged: $" + amtCharged)
                        console.log("Left in Stock: " + newQuantity + "\n") 
                        connection.end()
                    })
                }
            } 
        }
    })
})

