class Display {
  constructor(display_id) {
    this.display_id = display_id;
  }
  update_display(display) {
    /* 
        Update text for a display element
        @param  new_num string to be displayed;
    */
    document.getElementById(this.display_id).textContent = display;
  }
  get_current_display() {
    /* 
        return current display
        @return contents of display if a number else NULL;
    */
    let current = document.getElementById(this.display_id).textContent;
    if (!current || 0 === current.length) {
      return null;
    }
    return current;
  }
  is_negative() {
    /* 
        return current display
        @return contents of display if a number else NULL;
    */
    let current = document.getElementById(this.display_id).textContent;
    return current.indexOf("-") != -1;
  }
}

class Calculator {
  constructor() {
    this.operator_table = {
      "+": this.add,
      "-": this.subtract,
      "*": this.multiply,
      "/": this.divide,
    };

    this.number_display = new Display("number");
    this.equation_display = new Display("equation");
    this.operator = null;
    this.total = null;
    this.clear_display = false;
    this.set_up_num_pad();
    this.set_up_operators();
  }

  add(num1, num2) {
    /* 
        Adds two numbers
        @param num1 First number
        @param num2 Second number
        @return Sum of num1 and num2;
    */
    return num1 + num2;
  }

  subtract(num1, num2) {
    /* 
        Subtracts two numbers
        @param num1 First number
        @param num2 Second number
        @return num1 - num2;
    */
    return num1 - num2;
  }

  multiply(num1, num2) {
    /* 
        Multiply two numbers
        @param num1 First number
        @param num2 Second number
        @return Product of num1 and num2;
    */
    return num1 * num2;
  }

  divide(num1, num2) {
    /* 
        Divide two numbers
        @param num1 First number
        @param num2 Second number
        @return Division of num1 and num2;
    */
    if (num2 == 0) {
      return 0;
    }
    return num1 / num2;
  }

  operate = (e) => {
    /* 
        Call back to perform an operation (add, subtract, divide, multiply)
        @param e Call Back Event
    */
    if (this.clear_display) {
      this.clear_display = false;
      this.number_display.update_display("");
    }
    // get current display value
    let display_value = this.number_display.get_current_display();

    // get operator value from the button clicked
    let operator = e.srcElement.value;
    console.log(display_value);
    // check if display doesnt contain a number
    if (display_value == null) {
      return; // exit early user clicked on an operator without a number
    }

    // is operator in the predefined dictionary
    if (operator in this.operator_table) {
      let equation_display = this.equation_display.get_current_display();

      if (this.total == null) {
        // After a clear event or the start of a calculator ... set total and clear display
        this.total = parseFloat(display_value);
        this.number_display.update_display("");
      } else if (this.operator == null) {
        // operator has not been previously clicked (after an = event)... clear screen
        this.number_display.update_display("");
      } else {
        let equation_string =
          this.total + e.srcElement.textContent + display_value;
        this.equal(); // perform operation
        this.clear_display = true;
        this.equation_display.update_display(equation_string);
      }
      this.operator = operator;
    }
  };

  equal = () => {
    /* 
        Perform current total
    */

    let display_value = this.number_display.get_current_display();
    if (display_value == null || this.operator == null) {
      // Current display is empty return
      return;
    }
    display_value = parseFloat(display_value);
    let equation_string = this.total + this.operator + display_value;
    this.total = this.operator_table[this.operator](this.total, display_value);
    this.number_display.update_display(this.total);
    this.equation_display.update_display(equation_string);

    // Clear current operator and dot flag
    this.operator = null;
    this.dot = false;
    this.clear_display = true;
  };

  update = (e) => {
    /* 
        Call back to perform add number to display
        @param e Call Back Event
    */

    // clear display flag set (example: after = event)
    if (this.clear_display) {
      this.clear_display = false;
      this.number_display.update_display("");
    }

    let display_value = this.number_display.get_current_display();
    let number_to_add = e.srcElement.value;

    if (display_value == null) {
      // display doesnt have a number just set display to clicked button value
      let sign = "";
      if (this.number_display.is_negative()) {
        sign = "-";
      }
      this.number_display.update_display(sign + number_to_add);
    } else {
      this.number_display.update_display(display_value + number_to_add);
    }
  };

  toggle_sign = () => {
    /* 
        Call back to toggle sign of number in number_display
    */
    if (this.clear_display) {
      this.clear_display = false;
      this.number_display.update_display("");
    }
    let new_value;
    let display_value = this.number_display.get_current_display();
    if (display_value == null) {
      display_value = "";
    }
    if (display_value.charAt(0) == "-") {
      new_value = display_value.substring(1);
    } else {
      new_value = "-" + display_value;
    }

    this.number_display.update_display(new_value);
    // No previous operator and total is not null
    if (this.operator == null && this.total != null) {
      this.total = new_value;
    }
  };

  clear = () => {
    /* 
        Call back to clear number_display
    */
    this.number_display.update_display("");
    this.dot = false;
  };
  all_clear = () => {
    /* 
        Call back to clear number display and memory
    */
    this.clear_display = false;
    this.operator = null;
    this.total = null;
    this.dot = false;

    this.number_display.update_display("");
    this.equation_display.update_display("");
  };

  add_dot = () => {
    /* 
        Call back to add a dot
    */
    let display_value = this.number_display.get_current_display();

    if (display_value == null) {
      display_value = 0;
    }
    display_value = display_value.toString();
    if (display_value.indexOf(".") != -1) {
      return;
    }
    this.number_display.update_display(display_value + ".");
  };

  set_up_num_pad() {
    /* 
        Setup event listeners for numpad
    */

    let numpad = document.querySelectorAll(".numpad");

    for (var i = 0; i < numpad.length; i++) {
      numpad[i].addEventListener("click", this.update);
    }
  }

  set_up_operators() {
    /* 
        Setup event listeners for operators
    */

    let operators = document.querySelectorAll(".operator");

    for (var i = 0; i < operators.length; i++) {
      operators[i].addEventListener("click", this.operate);
    }

    let equal = document.getElementById("equal");
    equal.addEventListener("click", this.equal);

    let sign = document.getElementById("sign");
    sign.addEventListener("click", this.toggle_sign);

    let all_clear = document.getElementById("all-clear");
    all_clear.addEventListener("click", this.all_clear);

    let clear = document.getElementById("clear");
    clear.addEventListener("click", this.clear);

    let dot = document.getElementById("dot");
    dot.addEventListener("click", this.add_dot);
  }
}

document.body.onload = new Calculator();
