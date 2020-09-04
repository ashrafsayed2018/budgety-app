// the logic model 

let budgetController = (function () {
  
   // some 
     
})();

// the user interface model 

let UIController = (function () {

    let DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value'
    };

    return {
        getInput : function () {

            return {
                type : document.querySelector(DOMStrings.inputType).value, // the is inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
            }
        }
    } 

})();

// the intermediate controller between the logic model and user interface model

let controller = (function name(budgCtrl,UiCtrl) {

  let add_btn = document.querySelector('.add__btn');

     // making the control add item function 

     var ctrlAddItem = function() {
    
        // 1 - get the field input data

        var inputs = UiCtrl.getInput();
        console.log(inputs)
  
        // 2 - add the item to budget controller
  
        // 3 - add the item to the ui
  
        // 4 - calaculate the budget 
        
        // 5 - display the budget in the ui
  
      }

  // add event when user click the add button

  add_btn.addEventListener('click', ctrlAddItem);

  add_btn.addEventListener('keypress', function(e) {
      let keyCode = e.keyCode;

      if(keyCode === 13 || e.which === 13) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
  });

  // add event when the user click enter key 

  document.addEventListener('keypress', function(e) {

     let keyCode = e.keyCode;
     if(keyCode === 13 || e.which === 13) {
        ctrlAddItem();
     }


  
  })
    
})(budgetController, UIController);