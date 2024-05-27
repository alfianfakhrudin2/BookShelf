const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    
    if (data !== null) {
        for (const book of data) {
           
            book.year = parseInt(book.year);
            books.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT)); 
}