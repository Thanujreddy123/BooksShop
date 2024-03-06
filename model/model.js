// Get current list of the books
function getBooks() {
    const booklist = [
        {id: "978-1517538927", Title:"Gitanjali", price: 4.45,image:"book1.jpg"},
        {id: "978-1034159124", Title:"Songs of Kabir", price: 22.99,image:"book2.jpg"},
        {id: "978-8187075936", Title:"Four Chapters", price: 16.00,image:"book3.jpg"},
    ];
    return booklist;
}

// Search for the book with given id in list
function getBookById(id) {
    var booklist = getBooks();
    for (let book of booklist) {
        if (id === book.id) {
            return book;
        }
    }
}

// This will give the price of the a specific book based on the id
function getPrice(id) { 
    var price = 0;   
    var book = getBookById(id);
    price = book.price;
    return price;  
}

// Convert raw inputs into an order
function createOrder(quantity, books) {
    var order = {};
    order.quantityString = quantity.trim(); //this is the new variable to save the value 
    order.quantity = parseInt(quantity.trim()); // Get the quantity and parse to a number
    order.id = books;                          // Get the ID
    // Get Title from ID (will need for reciept page)
    var book =  getBookById(order.id);
    if (book) { // Make sure this book exists 
        order.Title = getBookById(order.id).Title;  
        order.price=getBookById(order.id).price;
        order.image=getBookById(order.id).image;
    }
    return order;
}




// Validate order, returning list of errors. Will improve this as well.
function validateOrder(order) {
    var errors = []; // New (empty) list

    // Validate quantity field (must be number at least 1)
    if (isNaN(order.quantity) || order.quantity < 1) {  
        errors.QuantityIllegal = true;            
    }

    // Validate flavor (must be id in entity list)
    if (order.id === "0" || !getBookById(order.id)) { 
        errors.BookMissing = true;
    }
    return errors;
}


// Add total cost to order
function addCost(order) {
    order.total = getPrice(order.id) * order.quantity*1.0175;
    return order;
}

//This function is created to handle the errors and also display the errors on the same page
function getPrevious(order) {
    var previous = {}; // New (empty) object
    if (!order) { // No previous order so display defaults    
        previous.quantity = "1"; // Default quantity is 1
        
        previous.book = getBooks();     // Display initial list of donuts with none selected
    }
    else {  // Redisplay existing values 
        
        previous.quantity = order.quantityString; // Redisplay original quantity in form
        
        var books = getBooks(); // Get copy of donut list    
        for (let b of books) {
            if (order.id === b.id) { // Search for donut matching id of previous selection
                b.selected = "selected";  // Insert selected into option of selected flavor
            }
            else {
                b.selected = ""; 
            }        
        }
        previous.book = books;
    }
       
    return previous;
}

// Make function available publicly
module.exports = {getPrice, getBooks, getBookById, createOrder, validateOrder, addCost,getPrevious};