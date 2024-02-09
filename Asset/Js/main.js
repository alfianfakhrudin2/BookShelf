const Revent = "event";
const save = "save";
const update = "update";
const deleted = "delete";
const storage = "storage";
const book = "book";

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

//LOADING JS

document.addEventListener(Revent, function () {
    updateDataToStorage();
    const unfinishedBook = document.getElementById("incomplete");
    unfinishedBook.innerHTML = "";

    const finishedBook = document.getElementById("complete");
    finishedBook.innerHTML = "";

    for (const item of books){
        const newBook = makeBook(item.title, item.author, item.year, item.isComplete);
        newBook[bookId] = item.id;

        if (item.isComplete){
            finishedBook.append(newBook);
        } else {
            unfinishedBook.append(newBook);
        }
    }
});


//ADD BOOK JS
document.addEventListener(Revent, function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()){
        loadDataFromStorage();
    }
});

