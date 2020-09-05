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
        expenseContainer : ".expenses__list"
    };

    return {
        getInput : function () {

            return {
                type : document.querySelector(DOMStrings.inputType).value, // the is inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
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

            //   let fieldsArray = Array.prototype.slice.call(fields);
            //   fieldsArray.forEach(function (field) {
            //         console.log(field.value);
            //       })

              // second solution
              fields.forEach(function (field) {
                field.value = '';
              })
              fields[0].focus();
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
    
            let input = UiCtrl.getInput();
      
            // 2 - add the item to budget controller
           
            let newItem = budgCtrl.addItem(input.type,input.description,input.value);
      
            // 3 - add the item to the ui
            if(input.value != '' && input.description != '') {
                UiCtrl.addListItem(newItem,input.type);
                UiCtrl.clearFeilds() 
            } else {
                alert ('input description or value is empty')
            }
           
      
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
