const express = require('express');
const path = require('path');
const {
    createBook,
    updateBook,
    listBooks,
    getBook,
    deleteBook
} = require('./book');
const app = express();

// Ambil port dari environment variable
// Dengan nilai default 8000
const PORT = process.env.PORT || 8000;

// Path ke directory public
// Yang bakal kita jadikan public
// Sehingga user bisa akses CSS dan Javascript
// Di browser
const PUBLIC_DIRECTORY = path.join(__dirname, 'public');

// Set format request
app.use(express.urlencoded({ extended: true }));

// Set PUBLIC_DIRECTORY sebagai
// Static files di express
app.use(express.static(PUBLIC_DIRECTORY));

// Memberi tau express kalau kita mau
// Pake EJS sebagai view engine
app.set('view engine', 'ejs');

// GET /?name=Fikri
app.get('/', (request, response) => {
    response.render('index', {
        name: request.query.name || 'Guest',
    });
});

// GET /books
app.get('/books', (request, response) => {
    const books = listBooks();
    response.render('books/index', {
        books,
    });
});

app.post('/books/create', (request, response) => {
    const book = createBook(request.body);
    response.redirect(200, '/books/' + book.id);
});

// GET /books/create
app.get('/books/create', (request, response) => {
    response.render('books/create');
})

// GET /books/:id
app.get('/books/:id', (request, response) => {
    const book = getBook(request.params.id);

    if (!book) return response.status(404).send("Book not found");

    response.render("books/:id/index", book);
});

// GET /books/:id/update
app.get('/books/:id/update', (request, response) => {
    const book = getBook(request.params.id);
    if (!book) return response.status(404).send("Book not found");

    response.render("books/:id/update", book);
});

// POST /books/:id/update
app.post('/books/:id/update', (request, response) => {
    const book = getBook(request.params.id);
    if (!book) return response.status(404).send('Book not found');

    updateBook(book.id, request.body);

    response.redirect(200, '/books/' + book.id);
});

// GET /books/:id/delete
app.get('/books/:id/delete', (request, response) => {
    const book = getBook(request.params.id);
    if (!book) return response.status(404).send('Book not dound!');

    deleteBook(book.id);

    response.redirect(200, '/books');
});

app.listen(PORT, () => {
    console.info(`Express berjalan di http://localhost:${PORT}`)
});