// the logic model 

let budgetController = (function () {
  
   // Expense function constructor 

   let Expense = function(id,description,value) {
       this.id = id;
       this.description = description;
       this.value = value;
   }

    // Income function constructor 

    let Income = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // data object which contain the expenses and incomes and the totals for exps and incs
    
    let data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals: {
            inc : 0,
            exp : 0
        }
    }
    
})();

// the user interface model 

let UIController = (function () {

    let DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        addInput   : '.add__btn'
    };

    return {
        getInput : function () {

            return {
                type : document.querySelector(DOMStrings.inputType).value, // the is inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDomStrings : function () {
           return DOMStrings;  
        }
    } 

})();

// the intermediate controller between the logic model and user interface model

let controller = (function name(budgCtrl,UiCtrl) {

         // making the control add item function 

         let ctrlAddItem = function() {
    
            // 1 - get the field input data
    
            let inputs = UiCtrl.getInput();
      
            // 2 - add the item to budget controller
      
            // 3 - add the item to the ui
      
            // 4 - calaculate the budget 
            
            // 5 - display the budget in the ui
      
          };


     function setEventListeners () {
      

        let DOM = UiCtrl.getDomStrings();

        let add_btn = document.querySelector(DOM.addInput);
         
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
        });
     }

     return {
         init : function() {
            setEventListeners ();
         }
     }

   
    
})(budgetController, UIController);

controller.init();