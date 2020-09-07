// the logic model 

let budgetController = (function () {
  
   // Expense function constructor 

   let Expense = function(id,description,value) {
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   }

   Expense.prototype.calcPercentage = function (totalIncome) {
        
    if(totalIncome >  0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
        this.percentage = -1;
    }
   }

   Expense.prototype.getPercentage = function () {
       return this.percentage;
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
        deleteItem : function (type,id) {
           
            let ids = data.allItems[type].map(function (current) {
                 return current.id
            });

            index = ids.indexOf(id);
            
            if(index !== -1) {

                data.allItems[type].splice(index,1)

            }
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

        // method ot calculate percentage 
        calculatePercentages : function() {
            
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc)
            })
        },
        getPercentages : function () {

           let allPercentages = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
           });

           return allPercentages;
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
        percentageLabel : ".budget__expenses--percentage",
        container : ".container",
        expensePercentageLabel : ".item__percentage",
        dateLabel : ".budget__title--month"

    };

    let formatNumber = function(num,type) {

        // + or - before the number

        // 2 decimil point after the number

        // comma seperation of the thounthands 


        num = Math.abs(num);
        num = num.toFixed(3);

        // splite the decimil and integer number

        let numSplite = num.split('.');

        let int = numSplite[0];

        if(int.length > 3) {
           int =  int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }

        // the sign whether is - or + 

        let sign;

        type === 'exp' ? sign = '-' : sign = "+";
        let decimil = numSplite[1]

        return sign + ' ' + int + '.' + decimil;




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

                html =  `<div class="item clearfix" id="inc-%id%">
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
                    html = `<div class="item clearfix" id="exp-%id%">
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
              newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));


              // insert the html into the dom 

              document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        },
        delListItem : function(selectorID) {

            let el = document.getElementById(selectorID)

            el.parentNode.removeChild(el)

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

            let type;

            obj.budget > 0 ? type = "inc" : type= "exp";

          document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
          document.querySelector(DOMStrings.incomeLabel).textContent =  formatNumber(obj.totalInc,'inc');
          document.querySelector(DOMStrings.expensesLabel).textContent =  formatNumber(obj.totalExp,'exp');

          if(parseInt(obj.percentage) > 0) {
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
          } else {
            document.querySelector(DOMStrings.percentageLabel).textContent = '---';

          }

        },
        displayPercentage : function (budgCtrl) {

            let fields = document.querySelectorAll(DOMStrings.expensePercentageLabel);
            
            for (let i = 0; i < fields.length; i++) {
                if(budgCtrl.getPercentages()[i] > 0) {
                    fields[i].textContent = budgCtrl.getPercentages()[i] + "%";
                } else {
                    fields[i].textContent =  "---";
                }
           
             
              }
        },
        displayMonth : function () {
             let now = new Date();
             let year = now.getFullYear();
             const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
             let month = monthNames[now.getMonth()];
             document.querySelector(DOMStrings.dateLabel).textContent = month + ' ' +  year;
        },
        changeType : function () {
           let fields = document.querySelectorAll(DOMStrings.inputType + ','+ DOMStrings.inputDescription + ','+ DOMStrings.inputValue)


           for (let i = 0; i < fields.length; i++) {
           
                fields[i].classList.toggle('red-focus');
           
          }
          document.querySelector(DOMStrings.addInput).classList.toggle('red')

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

         // update percentages 

         let updatePercentages = function () {

            // 1 - calculate the percentage 

              budgCtrl.calculatePercentages()

            // 2 - read the percentages from the budget controller

            let percentages = budgCtrl.getPercentages();

            console.log(percentages)

            // 3 = update the UI with the new percentages 
            UiCtrl.displayPercentage(budgCtrl)

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

                // 5 - calculate and update the percentages

                updatePercentages();
          };

        // making the control delete item 

        let ctrlDeleteItem = function(e) {
            let itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
            if(itemId) {
             
                // split the item id 
                let splitId = itemId.split('-');
                let type = splitId[0];
                let id = parseInt(splitId[1]);
                
                // delete the item from the data structure

                budgCtrl.deleteItem(type,id);

                // delete the item from ui

                UiCtrl.delListItem(itemId)

                // update and show the budget
                updateBudeget()

                //  calculate and update the percentages

                updatePercentages();
            }
        }


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

        // add event listener on delete butoon 

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        // add event when we change the input type 

        document.querySelector(DOM.inputType).addEventListener('change', UiCtrl.changeType)
     }

     return {
         init : function() {
            setEventListeners ();
            UiCtrl.displayMonth();
         }
     }

   
    
})(budgetController, UIController);

controller.init();
