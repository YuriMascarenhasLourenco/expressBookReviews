const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password, email} = req.body;
  if(!username || !password || !email){
    return res.status(400).json({message: "Username, password, and email are required"});
  }if(users.find(user => user.username === username)){
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({username,password,email});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
 public_users.get('/',function (req, res) {
 
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());  
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: "No books found for the given author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: "No books found with the given title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});
// Task 10: Get all books (async/await)
public_users.get('/async-books', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 2));
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details by ISBN (Promise)
public_users.get('/async-isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
  };
  getBookByISBN(isbn)
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Get books by author (async/await)
public_users.get('/async-author/:author', async (req, res) => {
  const author = req.params.author;
  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const filtered = Object.values(books).filter(book => book.author === author);
      if (filtered.length > 0) {
        resolve(filtered);
      } else {
        reject("No books found for this author");
      }
    });
  };
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 13: Get books by title (Promise)
public_users.get('/async-title/:title', (req, res) => {
  const title = req.params.title;
  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const filtered = Object.values(books).filter(book => book.title === title);
      if (filtered.length > 0) {
        resolve(filtered);
      } else {
        reject("No books found with this title");
      }
    });
  };
  getBooksByTitle(title)
    .then(books => res.status(200).json(books))
    .catch(err => res.status(404).json({ message: err }));
});



module.exports.general = public_users;
