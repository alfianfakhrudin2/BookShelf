const submitAction = document.getElementById("inputBook")

function checkStorage() {
  return typeof (Storage) !== undefined
}
function addBookList(data) {
  if (checkStorage()) {
    const inputBook = [];
    if (localStorage.getItem("books") !== null) {
      inputBook = JSON.parse(localStorage.getItem("books"))
    }
    inputBook.unshift(data)
    localStorage.setItem("books", JSON.stringify(inputBook))
  }
}

function getBookList() {
  if (checkStorage()) {
    return JSON.parse(localStorage.getItem("books") || [])
  } else {
    return []
  }
}

function generateID() {
  return +new Date()
}
submitAction.addEventListener("submit", function(event) {
  const booksData = getBookList();
  const bookId = generateID();
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const checkbox = document.getElementById("inputBookIsComplete").value;
  const incompleteList = document.querySelector("#incompleteBookshelfList");
  const completeList = document.querySelector("#completeBookshelfList");
  const newBooksList = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: checkbox,
  }
  
  addBookList(newBooksList);
  console.log(booksData);
})

window.addEventListener("load", function() {
  if (checkStorage()) {
    if (localStorage.getItem("books") !== null) {
      console.log(newBooksList)
    } else {
      console.log("kosong")
    }
  }
})