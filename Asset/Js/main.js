const event = "event";
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
