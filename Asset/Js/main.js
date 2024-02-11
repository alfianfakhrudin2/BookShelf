const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById("belumDibaca");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("sudahDibaca");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Disimpan!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(MOVED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Dipindahkan!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(DELETED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Dihapus!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});
