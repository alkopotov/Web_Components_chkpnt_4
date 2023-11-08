class ExpenseCalculator extends HTMLElement {

  constructor() {
    super();

    this.wrapper = document.createElement('section');
    this.wrapper.className = 'wrapper';



    this.form = document.createElement('form')
    this.form.action = ''
    this.form.className = 'expense__form'
    
    this.form.onsubmit = (e) => {
      e.preventDefault()
      let newRow = document.createElement('tr')
      newRow.innerHTML = `<td>${this.inputTitle.value}</td><td class="expense__value">${this.formatNumber(this.inputValue.value)}</td>`

      let delButton = document.createElement('td')
      delButton.className = 'delete__button'
      delButton.innerHTML = `<img src="images/delete.png" alt="Delete icon" width="20">`
      delButton.onclick = (e) => {
        newRow.remove()
      }
      newRow.append(delButton)

      this.expenseTableBody.append(newRow)
      
      this.inputTitle.value = null
      this.inputValue.value = null
    }

    this.labelInputTitle = document.createElement('label')
    this.labelInputTitle.textContent = 'Статья расходов'

    this.inputTitle = document.createElement('input')
    this.inputTitle.name = 'title'
    this.inputTitle.type = 'text'
    this.inputTitle.required = true
    this.inputTitle.className = 'input__title'

    this.labelInputValue = document.createElement('label')
    this.labelInputValue.textContent = 'Сумма'

    this.inputValue = document.createElement('input')
    this.inputValue.name = 'value'
    this.inputValue.type = 'number'
    this.inputValue.min = 0;
    this.inputValue.required = true
    this.inputValue.value = null
    this.inputValue.className = 'input__value'


    this.submitButton = document.createElement('input')
    this.submitButton.type = 'submit'
    this.submitButton.value = 'Добавить'
    this.submitButton.className = 'submit__button'



    this.expenseTable = document.createElement('table')

    this.expenseTableHeader = document.createElement('thead')
    this.expenseTableHeader.innerHTML = `<tr>
                                          <th>Статья расходов</th>
                                          <th>Сумма</th>
                                          <th>Удалить</th>
                                        </tr>`
    
    this.expenseTableBody = document.createElement('tbody')

    this.expenseTableFooter = document.createElement('tfoot')
    this.expenseTableFooter.innerHTML = `<tr>
                                          <td>ИТОГО</td>
                                        </tr>`

    this.expenseTableTotal = document.createElement('td')
    this.expenseTableTotal.className = 'expenses__total'
    this.expenseTableFooter.firstElementChild.append(this.expenseTableTotal)
    this.expenseTableFooter.firstElementChild.append(document.createElement('td'))

    this.expenseTable.append(this.expenseTableHeader, this.expenseTableFooter, this.expenseTableBody)

    this.observer = new MutationObserver(mutationRecords => this.renderTable())
    this.observer.observe(this.expenseTableBody, {
      childList: true,
      subtree: true
    })

    this.linkCSS = document.createElement('link')
    this.linkCSS.rel = 'stylesheet'
    this.linkCSS.href = './components/expense-calculator.css'

  }

  renderTable() {
    if (this.expenseTableBody.rows.length) {
      this.expenseTableTotal.textContent = this.formatNumber([...this.expenseTableBody.rows].reduce((sum, current) => {
        return sum + +current.cells[1].textContent.replaceAll(' ', '')
      }, 0))

      this.wrapper.append(this.expenseTable)
    } else {
      this.expenseTable.remove()
    }
   
  }

  formatNumber(num, sep = ' '){
    let intPart = String(Math.floor(num));
    let floatPart = String(num)
    if (floatPart.includes('.')) {
      floatPart = `,${floatPart.slice(floatPart.indexOf('.') + 1)}`
    } else {
      floatPart = '';
    }
    let segmTotal = Math.ceil(intPart.length / 3)
    let firstSegm = intPart.length % 3;
    let result = firstSegm > 0 ? `${intPart.slice(0, firstSegm)}${sep}`:'';
  
    for (let i = 1; i <= segmTotal; i++) {
      result +=`${intPart.slice(firstSegm + 3 * (i - 1), firstSegm + i * 3)}${sep}`;
    }
    result = `${result.trim()}${floatPart}`;
    return result;
  }

  connectedCallback() {
    
    this.labelInputTitle.append(this.inputTitle)
    this.labelInputValue.append(this.inputValue)
    this.form.append(this.labelInputTitle, this.labelInputValue, this.submitButton)
    this.wrapper.append(this.form)
    const shadow = this.attachShadow({mode: 'open'});
    shadow.append(this.linkCSS, this.wrapper)
  }
}
customElements.define('expense-calculator', ExpenseCalculator);
