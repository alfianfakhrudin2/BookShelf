let formMode = "CREATE";
let bookIdToEdit = "";
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("formAddBook");
  const checkbox = document.getElementById("isCompleted");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (formMode === "UPDATE") {
      editBook(bookIdToEdit);
    } else {
      addBook();
    } 

    submitForm.reset();
  });
  checkbox.addEventListener("change", function () {
    if (checkbox.checked === true) {
      document.getElementById("isCompleted").innerText = "Selesai dibaca";
      addBookToCompleted(bookIdToEdit); // Tambahkan buku ke daftar "Sudah Selesai Dibaca"
    } else {
      document.getElementById("isCompleted").innerText = "Belum selesai dibaca";
    }
  });

  function addBook() {
    const { titleBook, authorBook, yearBook } = getFormData();
    const bookIsComplete = checkbox.checked; // Ambil status checkbox
    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      titleBook,
      authorBook,
      yearBook,
      bookIsComplete
    );
    books.push(bookObject); // Tambahkan buku ke dalam array books

    showAlert("Buku berhasil ditambahkan", "success");

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function showAlert(text, icon) {
  Swal.fire({
    text: text,
    icon: icon,
  });
}

function confirmDeleteBook(bookData) {
  Swal.fire({
    text: `Apakah Anda yakin ingin menghapus buku ${bookData.title}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus buku",
  }).then((result) => {
    if (result.isConfirmed) {
      removeBookFromCompleted(bookData.id);
      showAlert("Buku berhasil dihapus", "success");
    }
  });
}

function getFormData() {
  const titleBook = document.getElementById("inputTitle").value;
  const authorBook = document.getElementById("inputAuthor").value;
  const yearBook = document.getElementById("inputYear").value;
  return { titleBook, authorBook, yearBook };
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookIsComplete = checkbox.checked;
  const id = +new Date();
  const bookObject = generateBookObject(
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsComplete
  );
  books.push(bookObject);
  saveDataToStorage();
}

function addBook() {
  const { titleBook, authorBook, yearBook } = getFormData();

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    authorBook,
    yearBook,
    false
  );
  books.push(bookObject);

  showAlert("Buku berhasil ditambahkan", "success");

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

// function addBook() {
//         const bookTitle = document.getElementById("inputBookTitle").value;
//         const bookAuthor = document.getElementById("inputBookAuthor").value;
//         const bookYear = document.getElementById("inputBookYear").value;
//         const bookIsComplete = checkbox.checked;
//         const id = +new Date();
//         const bookObject = generateBookObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete);
//         books.push(bookObject);
//         saveDataToStorage();
//     }

document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById("unreadBooks");
  unreadBookList.innerHTML = "";

  const finishedReadList = document.getElementById("finishedReading");
  finishedReadList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookList(bookItem);
    if (!bookItem.isCompleted) {
      unreadBookList.append(bookElement);
    } else {
      finishedReadList.append(bookElement);
    }
  }
});

function makeBookList(bookObject) {
  const bookTitle = document.createElement("p");
  bookTitle.classList.add("mb-0", "fw-bold", "fs-5");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("mb-0");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.classList.add("mb-0", "text-muted");
  bookYear.innerText = bookObject.year;

  const bookInfoSection = document.createElement("div");
  bookInfoSection.append(bookTitle, bookAuthor, bookYear);

  const card = document.createElement("div");
  card.classList.add(
    "bg-white",
    "p-3",
    "border",
    "rounded",
    "mb-2",
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "book-item"
  );
  card.style.backgroundColor = bookObject.isCompleted ? "#f1f8e9" : "#fde2e4"; // Mengatur warna latar belakang sesuai status selesai atau belum

  card.append(bookInfoSection);
  card.setAttribute("id", `book-${bookObject.id}`);

  const buttonSection = document.createElement("div");

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("btn", "fs-2");
    undoButton.innerHTML =
      '<span class="iconify" data-icon="bi:arrow-counterclockwise" data-inline="false" style="font-size: 1.5rem; color: green;"></span>'; // Menggunakan ikon 'bi:arrow-counterclockwise' dari Iconify dengan ukuran sedang dan warna hijau

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    buttonSection.append(undoButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("btn", "fs-2");
    checkButton.innerHTML =
      '<span class="iconify" data-icon="bi:check-circle" data-inline="false" style="font-size: 1.5rem; color: green;"></span>'; // Menggunakan ikon 'bi:check-circle' dari Iconify dengan ukuran sedang dan warna hijau

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    buttonSection.append(checkButton);
  }

  const penButton = document.createElement("button");
  penButton.classList.add("btn", "fs-2");
  penButton.innerHTML =
    '<span class="iconify" data-icon="bi:pencil" data-inline="false" style="font-size: 1.5rem; color: yellow;"></span>'; // Menggunakan ikon 'bi:pencil' dari Iconify dengan ukuran sedang dan warna kuning

  penButton.addEventListener("click", function () {
    event.stopPropagation();
    setFormFieldToUpdate(bookObject);
  });

  buttonSection.append(penButton);

  const trashButton = document.createElement("button");
  trashButton.classList.add("btn", "fs-2");
  trashButton.innerHTML =
    '<span class="iconify" data-icon="bi:trash" data-inline="false" style="font-size: 1.5rem; color: red;"></span>'; // Menggunakan ikon 'bi:trash' dari Iconify dengan ukuran sedang dan warna merah

  trashButton.addEventListener("click", function () {
    confirmDeleteBook(bookObject);
  });

  buttonSection.append(trashButton);

  card.append(buttonSection);

  return card;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function setFormFieldToUpdate(bookObject) {
  const inputTitle = document.getElementById("inputTitle");
  inputTitle.value = bookObject.title;

  const inputAuthor = document.getElementById("inputAuthor");
  inputAuthor.value = bookObject.author;

  const inputYear = document.getElementById("inputYear");
  inputYear.value = bookObject.year;

  formMode = "UPDATE"; // Mengubah mode menjadi "UPDATE" saat melakukan perubahan
  bookIdToEdit = bookObject.id;

  const submitButton = document.getElementById("submitBtn"); // Ambil tombol submit

  // Ubah teks tombol menjadi "Update Data"
  submitButton.innerText = "Update Data";
}

function editBook(bookId) {
  const bookIndex = books.findIndex((item) => item.id === bookId);

  if (bookIndex === -1) return null;

  const { titleBook, authorBook, yearBook } = getFormData();

  books[bookIndex].title = titleBook;
  books[bookIndex].author = authorBook;
  books[bookIndex].year = yearBook;

  showAlert("Buku berhasil diedit", "success");
  document.dispatchEvent(new Event(RENDER_EVENT));

  const submitButton = document.getElementById("submitBtn"); // Ambil tombol submit

  // Ubah teks tombol menjadi "Submit" setelah melakukan update
  submitButton.innerText = "Submit";

  formMode = "CREATE"; // Kembalikan mode ke "CREATE" setelah update
  bookIdToEdit = "";

  saveData();
}



const searchTitle = document.getElementById("searchTitle");
searchTitle.addEventListener("keyup", searchBook);

function searchBook() {
  const findTitle = searchTitle.value.toLowerCase();
  const bookItem = document.querySelectorAll(".book-item");

  bookItem.forEach((item) => {
    const textItem = item.firstChild.textContent.toLowerCase();

    if (textItem.indexOf(findTitle) != -1) {
      item.setAttribute("style", "display: block;");
    } else {
      item.setAttribute("style", "display: none !important;");
    }
  });
}
