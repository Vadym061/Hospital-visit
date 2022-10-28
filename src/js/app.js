import {getToken,sendCard,getCards,getCard} from './modules/request.js';
import {Modal,ModalLogin,ModalCreateVisit} from './modules/modal.js';

import {Board} from './modules/board.js'
import objForm from './modules/obj.js';

const API = 'https://ajax.test-danit.com/api/v2/cards';
let visitsCollection = [];


let entryModal;
let keyToken;
let newVisitModal;


window.addEventListener("load", () => {
  keyToken = localStorage.getItem('token');
  if (keyToken) {
    document.querySelector('#entry-btn').classList.add('hidden');
    document.querySelector('#visit-btn').classList.remove('hidden');
    document.querySelector('#logout-btn').classList.remove('hidden');

    visitsCollection = JSON.parse(localStorage.getItem('allVisits'))
    let board = new Board().init()
    

  }
});

document.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.id === 'entry-btn') {
    entryModal = new ModalLogin();
    entryModal.render();
  } else if (e.target.id === 'login-btn') {
    e.preventDefault();
    let login = document.querySelector('#inputEmail').value;
    let password = document.querySelector('#inputPassword').value;
    if (login.includes('@') && password) {
      await getToken(API, login, password)
        .then(token => {

          if (token && typeof token !== 'object') {
            localStorage.setItem('token', token)
            keyToken = localStorage.getItem('token')
            entryModal.close()
          } else {
            entryModal.invalid();
          }
        })
        .catch(e => console.log(e.message))

    } else {
      entryModal.invalid();
    }

    if (keyToken) {
      document.querySelector('#entry-btn').classList.add('hidden');
      document.querySelector('#visit-btn').classList.remove('hidden');
      document.querySelector('#logout-btn').classList.remove('hidden');
      let board = new Board().init()
      document.querySelector('#sorting-form').classList.remove('hidden');

      await getCards(API, keyToken).then(cardsList => {
          localStorage.setItem('allVisits', JSON.stringify(cardsList))
          visitsCollection = JSON.parse(localStorage.getItem('allVisits'))
      });
    }

  } else if (e.target.id === 'visit-btn') {
    newVisitModal = new ModalCreateVisit();
    newVisitModal.render();
  } else if (e.target.id === 'create-btn') {
    e.preventDefault();
    const forms = document.querySelector('#newVisitForm');
    forms.classList.add('was-validated');
    if(forms.checkValidity()) {

        let form = new FormData(forms)
        let visitData = objForm(form);
        visitData.status = 'Open'
        newVisitModal.close();

        await sendCard(API, keyToken, visitData).then(card => {
            visitsCollection.push(card);
            localStorage['allVisits'] = JSON.stringify(visitsCollection);
      });
      let a = new Board().clearCards();
    let b = new Board().getCards();
  }


  } else if (e.target.id === 'logout-btn') {
    localStorage.clear();
    location.reload()
  } else if (e.target.id === 'showMore') {
    e.target.closest('.visit-card').classList.toggle('card-border-radius')
    e.target.closest('.visit-card').classList.toggle('card-z-index')
  }
})
