const myLibrary = [];
const bookTableBody = document.querySelector('tbody');

class Book {

  constructor(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
    this.id = crypto.randomUUID();
  }

  info() {
    const read = (this.haveRead) ? 'read already' : 'not read yet';
    return `${this.title} by ${this.author}, ${this.pages} pages, ${read}. id: ${this.id}`;
  }

  display() {
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

    let delImg = document.createElement('img');
    delImg.setAttribute('src', './assets/trash-bin-svgrepo-com.svg');
    delImg.setAttribute('height', '16px');
    delImg.setAttribute('alt', 'Delete row');

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
  for (let book of myLibrary) {
    book.display();
  }
}

displayBooks();

const form = document.querySelector('form');
const submit = document.querySelector('form button');

submit.addEventListener('click', (e) => {

  e.preventDefault();
  
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

  const newBookButton = document.querySelector('.new');
  newBookButton.textContent = 'New book';

})

const newBookButton = document.querySelector('.new');
newBookButton.addEventListener('click', () => {
  form.classList.toggle('active');
  if (form.classList.contains('active')) {
    newBookButton.textContent = 'Cancel';
  } else {
    newBookButton.textContent = 'New book';
  }
})

function deleteBook(id) {
  let countBefore = myLibrary.length;
  ndx = myLibrary.findIndex(b => b.id === id);
  myLibrary.splice(ndx, 1);
}

// ========================================================================= //
class InputValidation {

  static formMap = new Map();

  constructor(selector, fldTitle = '', listenEvent = 'change') {
    // usage example:
    //   new InputValidation('#mail', 'Email address', 'input');

    this.fld = document.querySelector(selector);
    this.errorFld = document.querySelector(`${selector} + span.error`);
    if (fldTitle) {
      this.fldTitle = fldTitle;
    } else {
      this.fldTitle = titleise(this.fld.name);
    }
    this.listenEvent = listenEvent;

    this.lowerTitle = function () {
      return this.fldTitle.toLowerCase();
    };

    this.indefArticleTitle = function () {
      if ('aeiou'.includes(this.lowerTitle()[0])) {
        return `an ${this.lowerTitle()}`;
      } else {
        return `a ${this.lowerTitle()}`;
      }
    };

    this.msgs = ({
      'valueMissing': `You need to enter ${this.indefArticleTitle()}.`,
      'typeMismatch': `Entered value needs to be an ${this.fld['type']} address.`,
      'patternMismatch': `Entered ${this.lowerTitle()} doen't match its required pattern.`,
      'tooShort': `${this.fldTitle} should be at least ${this.fld.minLength} characters; you entered ${this.fld.value.length}.`,
      'tooLong': `${this.fldTitle} should be no more than ${this.fld.maxLength} characters; you entered ${this.fld.value.length}.`,
      'rangeUnderflow': `${this.fldTitle} should be at least ${this.fld.min}; you entered ${this.fld.value}.`,
      'rangeOverflow': `${this.fldTitle} should be no more than ${this.fld.max}; you entered ${this.fld.value}.`,
      'customError': ''
    });

    this.overrideMsgs = new Map();
    this.customValidation = false;

    this.showError = function () {
      for (const condition in this.fld.validity) {
        if (this.fld.validity[condition]) {
          if (this.overrideMsgs.has(condition)) {
            this.errorFld.textContent = this.overrideMsgs.get(condition);
          } else {
            this.errorFld.textContent = this.msgs[condition];
          }
        }
      }
      // Add the `active` error class
      this.errorFld.className = "error active";
    }

    InputValidation.formMap.set(selector, this);

    this.fld.addEventListener(listenEvent, (event) => {
      if (this.customValidation) {
        this.customValidation();
      }
      if (event.target.validity.valid) {
        this.errorFld.textContent = ""; // Remove the message content
        this.errorFld.className = "error"; // Removes the `active` class
      } else {
        // If there is an error, show the correct message
        this.showError();
      }
    });

  }

  /*
    static {
      const form = document.querySelector("form");
      form.addEventListener("submit", (event) => {
        for (const input of formMap.values()) {
          if (!input.fld.validity.valid) {
            // display an appropriate error message
            input.showError();
            // prevent form submission
            event.preventDefault();
          }
        }
      });
    }
   */
  // Non-standard messages and validation

  /*   static setOverrideMsg = function (selector, eCode, msg) {
      // usage example
      //  InputValidation.setOverrideMsg('#postcode', 'patternMismatch', 'Postcode must be 4 numeric digits');
      const input = formMap.get(selector);
      input.overrideMsgs.set(eCode, msg);
    }
  
    static repeatFieldMatch = function (firstFieldSelector, secondFieldSelector, eMsg) {
      // usage example
      //  InputValidation.repeatFieldMatch('#password', '#repeat-pw', `Passwords don't match`);
      const f1 = formMap.get(firstFieldSelector).fld;
      const f2Inp = formMap.get(secondFieldSelector);
      const f2 = f2Inp.fld;
      f2Inp.customValidation = function () {
        if (f2.value === f1.value) {
          f2.setCustomValidity('');
        } else {
          f2.setCustomValidity(eMsg);
        }
      };
      setOverrideMsg(secondFieldSelector, 'customError', eMsg);
    }
   */
}

function titleise(text) {
  let result = text.toLowerCase();
  result.replace('-', ' ');
  result.replace('_', ' ');
  result = result[0].toUpperCase() + result.slice(1);
  return result;
}

// ========================================================================= //
let x = new InputValidation('#title', 'Book title', 'input');
x = new InputValidation('#author', 'Author', 'input');
x = new InputValidation('#pages', 'Number of pages');
