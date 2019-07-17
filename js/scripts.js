      //holds data for the app
      const appState ={};

      //sets up the UI
      const uiCanInteract = () => {
        const dataCc = document.querySelector('[data-cc-digits]> input');
        dataCc.addEventListener("blur", detectCardType);
        const dataCf = document.querySelector('[data-cc-info]> input');
        dataCf.addEventListener("blur", validateCardHolderName);
        const cardExp = document.querySelector('[data-cc-info]> input');
        cardExp.addEventListener("blur", validateCardExpiryDate);
        const payBtn = document.querySelector('[data-pay-btn]');
        payBtn.addEventListener("click", validateCardNumber);

       dataCc.focus();
         };


      //format user's bill as a proper currency in their country
      const formatAsMoney=(amount,buyerCountry)=>{

        const country = countries.find(country=>country.country===buyerCountry);
        if(country){
          return amount.toLocaleString('en-'+country.code,{style: 'currency', currency:country.currency});
        }else{
          return amount.toLocaleString(countries[0].code, {style: 'currency', currency: countries[0].currency});
        }

      };

      //displays visa/mastercard logo depending on card number
      const detectCardType = ({target}) => {
        const card = document.querySelector('[data-credit-card]');
        const cardLogo = document.querySelector('[data-card-type]');

        let cardNum = target.value.slice(0,1);

        if(cardNum==='4'){
           card.classList.add('is-visa');
           card.classList.remove('is-mastercard');
           cardLogo.src=supportedCards.visa;
           return 'is-visa';
           }
        else if(cardNum==='5') {
           card.classList.add('is-mastercard');
           card.classList.remove('is-visa');
           cardLogo.src=supportedCards.mastercard;
           return 'is-mastercard';
        }
      };

      //luhn algorithm for credit cards
      const validateWithLuhn = (digits) => {
        return digits.reduceRight((prev, curr, idx) => {
          prev=parseInt(prev, 10);
          if ((idx+1) % 2 !==0){
            curr = (curr * 2).toString().split('').reduce((p,c) => parseInt(p, 10) + parseInt(c, 10));
          }
          return prev + parseInt(curr, 10)
        }) %10 ===0;
      };

      //validation on card number
      const validateCardNumber=()=>{

        const digits = document.querySelector('div[data-cc-digits]');

        const data = [];
        Array.from(digits.childNodes).forEach((item)=>{
          if(item.value){
            const strItem = item.value.toString();
            for(let i =0;i<strItem.length;i++){
              const charItem = strItem.charAt(i);
              data.push(charItem);

            }
          }
        });

        const digitsList = digits.classList;
        if(validateWithLuhn(data)){
          if(digitsList.contains('is-invalid')){
            digitsList.remove('is-invalid')
          }
          return true;

        }else{
          digitsList.add('is-invalid');
          return false;

        }

      };

      //validation on card expiry date
      const expiryDateIsValid = () => {
        (target.value = MM/YY)?"true":"false";
      };
      const validateCardExpiryDate = ({target}) => {
       let results = false;
       if (expiryDateFormatIsValid(target)){
       const cardDate = target.value.split('/');
       const cardMonth = cardDate[0];
       const cardYear = '20'+cardDate[1];
       const date = new Date();
       const expiryDate = new Date();
       const expiryYear = expiryDate.setFullYear(cardYear, cardMonth, 1);

        if(expiryDate < date) {
          results = false;
        }else{
          results = true;
        }
       }
        flagIfInvalid (target, results)
        return results
      };

      //card's expiry date field
      const expiryDateFormatIsValid = (target) => {
       const mm = target.value.split('/')[0];
       const yy = target.value.split('/')[1];
       return /(0?[1-9]|1[012])/.test(mm) && /\d{2}$/.test(yy);
       };

      //mark's input entry as invalid or not
      const flagIfInvalid = (field,isValid) => {
        if (isValid) {
          field.classList.remove("is-invalid");
            }
        else {
          field.classList.add("is-invalid");
        }
      };

      //validation of card holder's name
      const validateCardHolderName = ({ target }) => {
        const { value } = target;
        const isValid = /^[a-zA-Z]{3,30} +[a-zA-Z]{3,30}$/.test(value);
        flagIfInvalid(target, isValid);
        return isValid;
      };

      //display total payment bill through data from API call
      const displayCartTotal = ({results}) => {
        const [data] = results;
        const {'itemsInCart':itemsInCart,'buyerCountry':buyerCountry} = data;

        appState.items = itemsInCart;
        appState.country = buyerCountry;

        appState.bill = itemsInCart.reduce((item,num) => {
          return (item.qty * item.price)+(num.qty * num.price);
        });

        appState.billFormatted = formatAsMoney(appState.bill, appState.country);

        const span = document.querySelector("[data-bill]");
        span.textContent = appState.billFormatted;

        uiCanInteract();
      };

      //use assigned api var to call displayCartTotal data
      const fetchBill = () => {
        const api = "https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c";
        fetch(api)
        .then(response => response.json())
        .then(data => displayCartTotal(data))
        .catch(error => console.log(error));
      };

      const supportedCards = {
        visa, mastercard
      };

      const countries = [
        {
          code: "US",
          currency: "USD",
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          country: 'Ghana'
        }
      ];

      const startApp = () => {
        fetchBill();
      };

      startApp();
