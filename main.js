// Book Class for instantiating a Book!

class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class for maintaing UI display, add, remove, showAlert, etc

class UI{
    // Static classes for UI as we are not going to change it!

    static displayBooks(){
        // Taking books from the local Storage
        const books = Store.getBooks();

        // Looping through the books and adding it to bookList
        books.forEach((book) => UI.addBookToList(book));
    }

    // Add a book to book-list mthd:
    static addBookToList(book){
        const list = document.getElementById('book-list');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style='font-size: 20px; font-weight:500'>${book.title}</td>
            <td style='font-size: 20px'>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class="btn btn-sm btn-danger delete">X</a></td>`
        list.appendChild(row);
    }

    // Clear fields after adding books: 
    static clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    // Showing different alerts!
    static showAlert(mssg, className){
        // creating a div element where we will show our alerts
        const div = document.createElement('div');
        div.className = `alert alert-${className} fade show`;
        div.appendChild(document.createTextNode(mssg));

        // Where to insert div element in our app
        const container = document.getElementById('main-container');
        const form = document.getElementById('book-form');
        console.log(form,container,div);
        // placing div in container div before form element!
        container.insertBefore(div, form);

        // Removing alerts after specific time!
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    // Delete a book:
    static deleteBook(book){
        // check if the selected target has a class of 'delete'
        if(book.classList.contains('delete')){
            book.parentElement.parentElement.remove();
        }
    }
}


// Store class for local storage

class Store{
    // get books stored in local storage
    static getBooks(){
        let books;

        // check for books not stored in local storage? 
        //             create empty books : add those books to books
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    // adding books to local storage
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        // adding to local storage
        localStorage.setItem('books', JSON.stringify(books));
    }

    // removing book from local storage on deleting a book
    static removeBook(isbn){
        const books = Store.getBooks();
        // looping through the books to find proper book-isbn to remove
        books.forEach((book,index) => {
            if(book.isbn === isbn){
                // delete that 1 book from the mentioned index
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Search function
function searchBook(val){
    const books = document.getElementById('book-list');
    const values = books.querySelectorAll('tr');
    const regex = /[\s]+/g ;
    values.forEach((value) => {
        const text = value.innerText.replace(regex, "").toLowerCase();
        if(text.indexOf(val) != -1){
            value.style.display = 'table-row';
        }else{
            value.style.display = 'none';
        }
    }) 
}


// Adding Events

// Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Adding a Book
document.getElementById('book-form').addEventListener('submit',
    (e) => {
        e.preventDefault();

        // grab title,auhtor,isbn values
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;

        // Instantiate Book if all fields- title,author,isbn are filled
        if(title==='' || author==='' || isbn===''){
            UI.showAlert('Please fill all the fields to Add a BooK!', 'danger');
        }
        else{
            const book = new Book(title, author, isbn);
            UI.addBookToList(book);
            Store.addBook(book);
            UI.showAlert('BooK added to BooKList!', 'success');
            UI.clearFields();
        }
    });

// Removing a Book
document.getElementById('book-list').addEventListener('click',
    (e) => {
        UI.deleteBook(e.target);
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        UI.showAlert('BooK Removed', 'success');
    }) 

// Searching Book
document.getElementById('search').addEventListener('keyup', 
    (e) => {
        searchBook(e.target.value.toLowerCase());
    })

document.getElementById('search-btn').addEventListener('click',
    (e) => {
        e.preventDefault();
        if (e.target.previousElementSibling.value !== ''){
            searchBook(e.target.previousElementSibling.value.toLowerCase());
        }else{
            UI.showAlert('Empty search', 'info');
        }     
    })