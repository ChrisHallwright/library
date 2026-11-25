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
      return fldTitle.toLowerCase();
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

  // Non-standard messages and validation

  static setOverrideMsg = function (selector, eCode, msg) {
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

}

function titleise(text) {
  let result = text.toLowerCase();
  result.replace('-', ' ');
  result.replace('_', ' ');
  result = result[0].toUpperCase() + result.slice(1);
  return result;
}


export default InputValidation;