import "./css/index.css"

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const logo = document.querySelector('.cc-logo span:nth-child(2) img')



function setCardType(type) {
const colors = {
  visa: ["#436D99", "#2D57F2"],
  mastercard: ["#DF6F29", "#C69347"],
  default: ["black", "gray"],
}

ccBgColor01.setAttribute("fill", colors[type][0]);
ccBgColor02.setAttribute("fill", colors[type][1]);
logo.setAttribute('src', `cc-${type}.svg`)
}

globalThis.setCardType = setCardType;


//Security Code
const cvc = document.querySelector('#security-code');
const cvcPatter = {
  mask: "0000"
}
const cvcMask = IMask(cvc, cvcPatter);

//ExpirationDate
const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector('#card-number');
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g, '');
    const foundMask = dynamicMasked.compiledMasks.find(function(item) {
      return number.match(item.regex);
    });

    return foundMask
  },
}
const cardNumberMask = IMask(cardNumber, cardNumberPatter);

const addButton = document.getElementById('add-card');
addButton.addEventListener('click', () => {
  alert('Cartão cadastrado!');
});

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
});

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector('.cc-holder .value');
  
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

cvcMask.on('accept', () => {
  updateCvv(cvcMask.value)
})

function updateCvv(code) {
  const ccSecurity = document.querySelector('.cc-security .value')

  ccSecurity.innerText = code.length === 0 ? 123 : code;
}

cardNumberMask.on('accept', () => {
  const cardType = cardNumberMask.masked.currentMask.cardtype
  setCardType(cardType);
  updateCardNumber(cardNumberMask.value);
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector('.cc-number');

  ccNumber.innerText = number.length === 0 ? '1234 5678 9123 4567' : number;
}

expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value);
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector('.cc-extra .value');

  ccExpiration.innerText = date.length === 0 ? '02/32' : date;
}


