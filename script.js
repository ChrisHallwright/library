const myLibrary = [];
const bookTableBody = document.querySelector('tbody');

function Book(title, author, pages, haveRead) {
  if (!new.target) {
    throw Error('You must use the "new" operator when calling this constructor function');
  }
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.haveRead = haveRead;
  this.id = crypto.randomUUID();

  this.info = function () {
    const read = (this.haveRead) ? 'read already' : 'not read yet';
    return `${this.title} by ${this.author}, ${this.pages} pages, ${read}. id: ${this.id}`;
  }

  this.display = function () {
    let row = document.createElement('tr');
    row.setAttribute('data-id', this.id);
    let tableArray = [
      this.title,
      this.author,
      this.pages,
      this.haveRead ? 'Yes' : 'no']
    let td;
    for (let i = 0; i < 4; i++) {
      td = document.createElement('td');
      td.textContent = tableArray[i];
      row.appendChild(td);
    }
    bookTableBody.appendChild(row);
  }
}

function addBookToLibrary(title, author, pages, haveRead) {
  const newBook = new Book(title, author, pages, haveRead);
  myLibrary.push(newBook);
  return newBook;
}

addBookToLibrary('The Hobbit', 'J.R.R.Tolkein', 156, false);
addBookToLibrary('The Natural Contract', 'Michel Serres', 517, false);
addBookToLibrary('Biogea', 'Michel Serres', 395, false);
addBookToLibrary('Think like a Mountain', 'Aldo Leopold', 156, false);
addBookToLibrary('Sand Talk', 'Tyson Yunkaporta', 280, true);
addBookToLibrary('Patterns of Commoning', 'The Commons Strategies Group', 336, false);

function displayBooks() {
  for (let i = 0; i < myLibrary.length; i++) {
    myLibrary[i].display();
  }
}

displayBooks();

const submit = document.querySelector('form button');
submit.addEventListener('click', (e) => {
  const title = document.querySelector('#title');
  const author = document.querySelector('#author');
  const pages = document.querySelector('#pages');
  const haveRead = document.querySelector('#have_read');
  if (!title.value || !author.value || !pages.value) {
    alert('Please complete the book details before adding');
    return;
  }
  let newBook = addBookToLibrary(
    title.value, author.value, pages.value, haveRead.checked);

  newBook.display();

  title.value = '';
  author.value = '';
  pages.value = ''
  haveRead.checked = false;

  e.preventDefault();
})
