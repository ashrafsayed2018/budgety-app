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

    // calculate total of income or expenses

    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        data.totals[type] = sum;
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
        },
        budget : 0,
        percentage : -1
    }

    return {

        addItem : function(type,des,val) {

            let ID , newItem;

            // create new ID

            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1 ].id + 1;
            } else {
                ID = 0
            }
       

            if(type === "exp") {

                 newItem = new Expense(ID,des,val);

            } else if(type === "inc") {

                 newItem = new Income(ID,des,val);
            }

            // adding the new item to the data object in allItems object 

            data.allItems[type].push(newItem);

            // retrun the new element
            
            return  newItem;
           
        },
        calculateBudget : function () {
            
            // calculate total income and expenses 

            calculateTotal('exp');
            calculateTotal('inc');

            // calculate total budget : income - expenses 

            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income we spent 

            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) + "%";

            } else {
                data.percentage = -1;
            }



        },
        getBudget : function () {

            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },
        testing : function () {
            console.log(data);
        }
    }
    
})();

// the user interface model 

let UIController = (function () {

    let DOMStrings = {

        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        addInput   : '.add__btn',
        incomeContainer : ".income__list",
        expenseContainer : ".expenses__list",
        budgetLabel : ".budget__value",
        incomeLabel : ".budget__income--value",
        expensesLabel : ".budget__expenses--value",
        percentageLabel : ".budget__expenses--percentage"

    };

    return {
        getInput : function () {

            return {
                type : document.querySelector(DOMStrings.inputType).value, // the is inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
          
            }
        },
        addListItem : function (obj,type) {
            let html,newHtml,element;

              // create html string with placeholder text

              if(type === "inc") {

                element = DOMStrings.incomeContainer;

                html =  `<div class="item clearfix" id="income-%id%">
                            <div class="item__description">%description%</div>

                            <div class="right clearfix">
                                <div class="item__value">%value%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn">
                                        <i class="ion-ios-close-outline"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`; 
              } else if(type === "exp"){

                  element = DOMStrings.expenseContainer;
                    html = `<div class="item clearfix" id="expense-%id%">
                                <div class="item__description">%description%</div>

                                <div class="right clearfix">
                                    <div class="item__value">%value%</div>
                                    <div class="item__percentage">20%</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn">
                                            <i class="ion-ios-close-outline"></i>
                                        </button>
                                    </div>
                            </div>
                            </div>`;
              }





              // replace the html string with the actual data

              newHtml = html.replace('%id%',obj.id);
              newHtml = newHtml.replace('%description%', obj.description);
              newHtml = newHtml.replace('%value%', obj.value);


              // insert the html into the dom 

              document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        },
        clearFeilds : function () {

              let fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);

              // first solution 

            // let fieldsArray = Array.prototype.slice.call(fields);
            // fieldsArray.forEach(function (field) {
            //     console.log(field.value);
            //  })

              // second solution
              fields.forEach(function (field) {
                field.value = '';
              })
              fields[0].focus();
        },
        displayBudget : function (obj) {

          document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
          document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
          document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

          if(obj.percentage > 0) {
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
          } else {
            document.querySelector(DOMStrings.percentageLabel).textContent = '---';

          }

        },
        getDomStrings : function () {
           return DOMStrings;  
        }
    } 

})();

// the intermediate controller between the logic model and user interface model

let controller = (function name(budgCtrl,UiCtrl) {


         // update the budget method 

         let updateBudeget = function () {

            // 1 - calaculate the budget 
            budgCtrl.calculateBudget();

            // 2 - return the budget 

            let budget = budgCtrl.getBudget();
            
            // 3 - display the budget on the ui
            UiCtrl.displayBudget(budget)
         }

         // making the control add item function 

         let ctrlAddItem = function() {
    
            // 1 - get the field input data
    
            let input = UiCtrl.getInput();
            
            if(input.value != '' && input.description != '' && !isNaN(input.value)) {


                
            // 2 - add the item to budget controller
           
            let newItem = budgCtrl.addItem(input.type,input.description,input.value);
      
            // 3 - add the item to the ui

                UiCtrl.addListItem(newItem,input.type);
                UiCtrl.clearFeilds() 
          

            // 4 - calculate and update budget

            updateBudeget();
        } else {
            alert ('input description or value is empty')
            console.log(input.value)
      
        }
      
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
