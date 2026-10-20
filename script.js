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

  let delImg = document.createElement('img');
  delImg.setAttribute('src', './assets/trash-bin-svgrepo-com.svg');
  delImg.setAttribute('height', '16px');
  delImg.setAttribute('alt', 'Delete row');

  this.display = function () {
    let row = document.createElement('tr');
    row.setAttribute('data-id', this.id);

    let colArray = [
      this.title,
      this.author,
      this.pages,
      this.haveRead ? 'Yes' : 'no']
    let td;
    for (let i = 0; i < colArray.length; i++) {
      td = document.createElement('td');
      td.textContent = colArray[i];
      row.appendChild(td);
    }

    // Append delete button per book display row
    td = document.createElement('td');

    let delBtn = document.createElement('button');
    delBtn.setAttribute('type', 'button');
    delBtn.appendChild(delImg);
    delBtn.classList.add('del-btn');
    delBtn.addEventListener('click', (e) => {
      if (window.confirm(`Are you sure you want to DELETE "${this.title}"`)) {
        deleteBook(td.parentElement.dataset.id);
        row.remove();
      }
    })
    td.appendChild(delBtn);

    row.appendChild(td);
    // ------------------------------------------

    // Append haveRead toggle button per book display row
    td = document.createElement('td');

    let readToggleBtn = document.createElement('button');
    readToggleBtn.setAttribute('type', 'button');
    readToggleBtn.textContent = 'Switch read status';
    readToggleBtn.classList.add('read-toggle-btn');
    readToggleBtn.addEventListener('click', (e) => {
      if (this.haveRead) {
        this.haveRead = false;
        row.children.item(3).textContent = 'no';
      } else {
        this.haveRead = true;
        row.children.item(3).textContent = 'Yes';
      }
    })
    td.appendChild(readToggleBtn);

    row.appendChild(td);
    // ------------------------------------------

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

const form = document.querySelector('form');
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
  form.classList.remove('active');

  title.value = '';
  author.value = '';
  pages.value = ''
  haveRead.checked = false;

  e.preventDefault();
})

const newBookButton = document.querySelector('.new');
newBookButton.addEventListener('click', () => {
  form.classList.toggle('active');
})

function deleteBook(id) {
  let countBefore = myLibrary.length;
  ndx = myLibrary.findIndex(b => b.id === id);
  myLibrary.splice(ndx, 1);
}
