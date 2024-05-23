const books = [];
const RENDER_EVENT = "render-books";
const STORAGE_KEY = "myBooks";
const SAVED_EVENT = "save-books";

const isStorageExist = () => {
    return typeof Storage !== "undefined";
};

const addBook = () => {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = parseInt(document.getElementById("inputBookYear").value);
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
    
    if (findBookByTitle(bookTitle)) {
        alert("Buku sudah ada dalam daftar!");
        return;
    }

    const newBook = bookObject(bookTitle, bookAuthor, bookYear, isCompleted);
    books.push(newBook);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
};

const findBookByTitle = (title) => {
    return books.find(book => book.title === title);
};

// Bagian kode lainnya...


const generateId = () => {
    return +new Date();
};

const bookObject = (title, author, year, isComplete = false) => {
    return {
        id: generateId(),
        title,
        author,
        year,
        isComplete,
    };
};

const saveBook = () => {
    if (isStorageExist()) {
        const parsedMyBooks = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsedMyBooks);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, () => {
    const completedBooks = document.getElementById("completeBookshelfList");
    completedBooks.innerHTML = "";
    const unCompleteBooks = document.getElementById("unCompleteBookshelfList");
    unCompleteBooks.innerHTML = "";
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            unCompleteBooks.append(bookElement);
        } else {
            completedBooks.append(bookElement);
        }
    }
});

const editBook = (bookId) => {
    const book = findBook(bookId);
    if (book === null) return;

    document.getElementById("inputBookTitle").value = book.title;
    document.getElementById("inputBookAuthor").value = book.author;
    document.getElementById("inputBookYear").value = book.year;
    document.getElementById("inputBookIsComplete").checked = book.isComplete;
    // Memperbarui tombol submit untuk menjadi tombol Update
    toggleFormMode(true);
    const submitButton = document.getElementById("bookSubmit");
    submitButton.innerText = "Update";
    submitButton.removeEventListener("click", addBook);
    submitButton.addEventListener("click", () => updateBook(bookId));
};

const updateBook = (bookId) => {
    const bookIndex = findIndex(bookId);
    if (bookIndex === -1) return;

    const updatedBook = {
        id: bookId,
        title: document.getElementById("inputBookTitle").value,
        author: document.getElementById("inputBookAuthor").value,
        year: document.getElementById("inputBookYear").value,
        isComplete: document.getElementById("inputBookIsComplete").checked,
    };

    books[bookIndex] = updatedBook;

    resetForm();

    toggleFormMode(false);
    document.getElementById("bookSubmit").innerText = "Submit";
    document.getElementById("bookSubmit").removeEventListener("click", updateBook);
    document.getElementById("bookSubmit").addEventListener("click", addBook);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBook();
};

const makeBook = (bookObject) => {
    const title = document.createElement("h3");
    title.innerHTML = bookObject.title;
    title.classList.add("book_title");
    const author = document.createElement("p");
    author.innerHTML = `Penulis: ${bookObject.author}`;
    const year = document.createElement("p");
    year.innerHTML = `Tahun: ${bookObject.year}`;
    const bookItem = document.createElement("div");
    bookItem.classList.add("book_item");
    bookItem.append(title, author, year);
    const action = document.createElement("div");
    action.classList.add("action");
    const container = document.createElement("article");
    container.classList.add("book_container");
    container.append(bookItem, action);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () => {
        editBook(bookObject.id);
    });

    const completeButton = document.createElement("button");
    completeButton.innerText = bookObject.isComplete ? "Undo" : "Selesai";
    completeButton.addEventListener("click", () => {
        if (bookObject.isComplete) {
            undoBookFromCompleted(bookObject.id);
        } else {
            addBookToComplete(bookObject.id);
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => {
        const confirmDeleteButton = document.getElementById("confirmDeleteButton");
        confirmDeleteButton.onclick = () => deleteBook(bookObject.id);
        $('#confirmDeleteModal').modal('show');
    });

    action.append(editButton, completeButton, deleteButton);

    return container;
};

const resetForm = () => {
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
};

const loadBooks = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};

const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

const findIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
};

const addBookToComplete = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
};

const undoBookFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
};

    const deleteBook = (bookId) => {
const bookIndex = findIndex(bookId);
if (bookIndex === -1) return;


$('#confirmDeleteModal').modal('show');


$('#confirmDeleteButton').on('click', function() {

    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();


    $('#confirmDeleteModal').modal('hide');
});
};


const searchButton = document.getElementById("searchSubmit");
const searchBookTitleInput = document.getElementById("searchBookTitle");
const searchResultsContainer = document.getElementById("searchResults");

document.addEventListener("DOMContentLoaded", () => {
    const submit = document.getElementById("inputBook");
    submit.addEventListener("submit", (event) => {
        event.preventDefault();
        addBook();
        resetForm();
    });

    searchButton.addEventListener("click", () => {
        const searchTerm = searchBookTitleInput.value.toLowerCase();
        const searchResults = books.filter((book) =>
            book.title.toLowerCase().includes(searchTerm)
        );

        displaySearchResults(searchResults);
    });

    searchBookTitleInput.addEventListener("input", () => {
        const searchTerm = searchBookTitleInput.value.trim();
        if (searchTerm.length > 0) {
        
            searchButton.disabled = false;
        } else {
        
            searchButton.disabled = true;
        }
    });

    function displaySearchResults(results) {
        searchResultsContainer.innerHTML = "";

        if (results.length === 0) {
            searchResultsContainer.innerHTML =
                "<p>Tidak ada hasil yang ditemukan.</p>";
            return;
        }

        results.forEach((book) => {
            const bookElement = makeBook(book);

            const actionButtons = bookElement.querySelector(".action");
            actionButtons.style.display = "none";

            searchResultsContainer.appendChild(bookElement);
        });
    }

    if (isStorageExist()) {
        loadBooks();
    }


    if (searchBookTitleInput.value.trim().length === 0) {
        searchButton.disabled = true;
    }
});



function toggleFormMode(editMode) {
    const submitButton = document.getElementById("bookSubmit");
    const inputForm = document.getElementById("inputBook");
    if (editMode) {

        inputForm.dataset.mode = "edit";
    } else {

        inputForm.dataset.mode = "add";
    }
}