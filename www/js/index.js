// refer to lecturer demo week 10
let db = null//declare a variable name db and put it as null
let print = function (title, message)
{
    console.log(title.toUpperCase(), message)
}
let printError = function (error)
{
    console.log('Db Error', JSON.stringify(error))
}
let printTransactionError = function (tx, error)
{
    console.log('TX Error', JSON.stringify(error))
}
let initialize = function ()//create function called initialize  
{
    db = window.sqlitePlugin.openDatabase // open database function and store into variable db
            (
                    {
                        name: 'myvehicleapp.db',
                        location: 'default'
                    },
                    createTables, // call createTables function
                    printError
                    )
}
let createTables = function (db) //create function call createTables
{
    db.transaction
            (
                    function (tx)
                    {
                        tx.executeSql // execute sql query
                                (//create table vehiclerecord query if not exist in database
                                        "CREATE TABLE IF NOT EXISTS `vehiclerecord` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `brand` TEXT, `model` TEXT, `distant` INTEGER, `date` TEXT, `time` TEXT, `price` INTEGER, `Part` TEXT, `shop` TEXT)",
                                        [],
                                        function (tx, rs) {
                                            print('CRUD', 'OK')
                                        },
                                        printTransactionError
                                        )
                    },
                    printError,
                    function () {
                        print('Create Table', OK)
                    }
            )
}// create table vehiclerecord if the table is not exist. 
document.addEventListener('deviceready', initialize, false)
let saveRecord = function ()//declare function saveRecord
{//declare variable and store data according to id
    let brand = document.getElementById('brand').value
    let model = document.getElementById('model').value
    let distance = document.getElementById('distance').value
    let date = document.getElementById('date').value
    let time = document.getElementById('time').value
    let price = document.getElementById('price').value
    let part = document.getElementById('part-change').value
    let repair = document.getElementById('repair-shop').value
    if (brand === '' || model === '' || distance === '' || date === '' || time === '' || price === '' || repair === '')
    {//validation for the required field
        alert('All mandatory field are required.', 'Error')
        return
    }

    if (db === null) {//test if db is declared and open
        alert('Database not available.', 'DB Error')
        return
    }
    saveRecordToDatabase(brand, model, distance, date, time, price, part, repair)//passing data to function saveRecordToDatabase
}

let saveRecordToDatabase = function (brand, model, distance, date, time, price, part, repair)//receiving data from function saveRecord
{
    db.transaction
            (
                    function (tx)
                    {
                        tx.executeSql // execute sql query
                                (//insert data into table vehicle
                                        "INSERT INTO `vehiclerecord` VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?)",
                                        [brand, model, distance, date, time, price, part, repair],
                                        function (tx, rs)
                                        {//clear field
                                            document.getElementById('brand').value = ''
                                            document.getElementById('model').value = ''
                                            document.getElementById('distance').value = ''
                                            document.getElementById('date').value = ''
                                            document.getElementById('time').value = ''
                                            document.getElementById('price').value = ''
                                            document.getElementById('part-change').value = ''
                                            document.getElementById('repair-shop').value = ''
                                            alert('Record Saved.', 'Saved')
                                        },
                                        printTransactionError
                                        )
                    },
                    printError,
                    function () {
                        print('saveRecordToDatabase', 'OK')
                    }
            )
}
let InputClear = function ()
{//clear field
    document.getElementById('brand').value = ''
    document.getElementById('model').value = ''
    document.getElementById('distance').value = ''
    document.getElementById('date').value = ''
    document.getElementById('time').value = ''
    document.getElementById('price').value = ''
    document.getElementById('part').value = ''
    document.getElementById('shop').value = ''
}
let showRecords = function ()//declare showRecords function
{
    if (db === null)
    {//test if database is declared and open
        alert('Database not available.', 'DB Error')
        return
    }
    db.transaction
            (
                    function (tx)
                    {
                        tx.executeSql // execute sql query
                                (//select query from table vehiclerecord
                                        "SELECT `id`, `brand`, `model`, `distant`, `date`, `time`, `price`, `Part`, `shop` FROM `vehiclerecord`  ORDER BY `brand` ASC",
                                        [],
                                        function (tx, rs)
                                        {
                                            let list = $('#list')//declare variable list and find element id by list
                                            for (let i = 0; i < rs.rows.length; i++)//for loop base on table length
                                            {//declare variable and store data obtained from table plus html td form
                                                let brand = $('<td></td>').text(rs.rows.item(i).brand)
                                                let model = $('<td></td>').text(rs.rows.item(i).model)
                                                let distant = $('<td></td>').text(rs.rows.item(i).distant)
                                                let date = $('<td></td>').text(rs.rows.item(i).date)
                                                let time = $('<td></td>').text(rs.rows.item(i).time)
                                                let price = $('<td></td>').text(rs.rows.item(i).price)
                                                let id = rs.rows.item(i).id
                                                let deleto = $('<td><button class="black" onclick="sqldelete(' + id + ')">delete</button></td>')
                                                let location = "'edit'"
                                                let update = $('<td><button class="green" onclick="openPage(' + location + ')">Update</button></td>')
                                                let item = $('<tr></tr>')
                                                        .append(brand)
                                                        .append(model)
                                                        .append(distant)
                                                        .append(date)
                                                        .append(time)
                                                        .append(price)
                                                        .append(update)
                                                        .append(deleto)
                                                list.append(item)//append all above form in this list
                                                console.log("\n")
                                                print("Record", (i + 1))
                                                print("ID", rs.rows.item(i).id)
                                                print("Email", rs.rows.item(i).brand)
                                                print("Credit", rs.rows.item(i).model)

                                            }
                                        },
                                        printTransactionError
                                        )
                    },
                    printError,
                    function () {
                        print('Show Records', 'OK')
                    }
            )
}
//www.w3school.com
let  myFunction = function () { // declare funtion myFunction

    var input, filter, table, tr, td, i, txtValue; //declare variable 
    input = document.getElementById("brand"); // get value from element id "brand" and store into variable input
    filter = input.value.toUpperCase(); // convert value from value to uppercase and store into filter
    table = document.getElementById("viewrecord");//getting value element id "viewrecord"  store into variable table
    tr = table.getElementsByTagName("tr");//getting element from variable table which find the tagname "tr" and store into variable tr
    for (i = 0; i < tr.length; i++) {//make a for loop according to tr length
        td = tr[i].getElementsByTagName("td")[0];  //getting element from variable tr which find the tagname "td" and store into variable td
        if (td) {
            txtValue = td.textContent || td.innerText; //getting value from td and store into variable txtvalue
            if (txtValue.toUpperCase().indexOf(filter) > -1) { //comparing txtvalue in uppercase with varible filter
                tr[i].style.display = "";// show the tr by using style.display = ""
            } else {
                tr[i].style.display = "none"; // hide the tr by using style.display = "none"
            }
        }
    }
}
//www.sqlite.com
let sqldelete = function (id) { //declare function sqldelete and obtain id from where it being called
    db.transaction(function (tx) {
        var executeQuery = "DELETE FROM vehiclerecord where id=?"; // execute sql query
        tx.executeSql(executeQuery, [id],
                function (tx, rs) // function run successfully will show alert below
                {
                    alert('Delete Succefully');
                    window.page.reload(true);
                },
                function (printError) { //if function fail to run will show alert below
                    alert('Delete Failed');
                });
    })
}

