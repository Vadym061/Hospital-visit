
import {
  Card
} from "./card.js";


export class Board {
  constructor() {
    this.desk = null;
    this.deskHeader = null;
    this.deskSearchInput = null;
    this.deskStatusFilter = null;
    this.deskPriorityFilter = null;
    this.cards = [];
  }

  init() {
    this.createBord();
    this.renderBoard();
    this.search()
    this.filter()
  }

  createBord() {
    this.desk = document.createElement('div');
    this.cardBlock = document.createElement('div');
    this.desk.classList.add('desk')
    this.cardBlock.classList.add('desk__card-block')
    this.deskHeader = document.createElement('div');
    this.deskHeader.classList.add('desk__desk-header');
    this.deskSearchInput = document.createElement('input');
    this.deskStatusFilter = document.createElement('select')
    this.deskPriorityFilter = document.createElement('select')
    this.deskSearchInput.setAttribute('placeholder', 'Search...')
  }

  renderBoard() {
    const statuses = ['Все', 'Open', 'Close']
    const priorities = ['Все', 'low', 'middle', 'high']
    const prioritiesOption = document.createElement('option');
    statuses.forEach(elem => {
      const statusesOption = document.createElement('option');
      statusesOption.innerText = elem;
      this.deskStatusFilter.append(statusesOption)
    })
    priorities.forEach(elem => {
      const prioritiesOption = document.createElement('option');
      prioritiesOption.innerText = elem;
      this.deskPriorityFilter.append(prioritiesOption)
    })
    document.querySelector('.container').after(this.desk)
    this.deskHeader.append(this.deskSearchInput, this.deskPriorityFilter, this.deskStatusFilter)
    this.desk.append(this.deskHeader, this.cardBlock)
    this.getCards()
  }

  getCards() {
  

    fetch('https://ajax.test-danit.com/api/v2/cards', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          return res;
        } else {
          let error = new Error(res.statusText);
          error.response = res;
          throw error
        }
      })
      .then(res => res.json())
      .then(data => {

        if (data.length < 1) {
          let noCardsText = document.createElement('span')
          noCardsText.classList.add('desk__blank-text')
          noCardsText.innerText = 'Визиты не добавлены'
          this.deskHeader.after(noCardsText)
        } else {
          this.cards.length = 0;
          data.forEach(visit => {
            this.cards.push(visit)
          })
          this.cards.forEach(e => new Card(e).render())
        }
      })
  }


  search() {
    this.deskSearchInput.onkeydown = function(event) {
      if (event.key == 'Enter') {
        this.blur();
      }
    };
    this.deskSearchInput.addEventListener('blur', () => {
      this.clearCards()


      let searchCards = this.cards.filter(item => item.doctor.toLowerCase().includes(this.deskSearchInput.value.toLowerCase()) || item.description.toLowerCase().includes(this.deskSearchInput.value.toLowerCase()))
      if (searchCards.length < 1) {
        if (!document.querySelector('.desk__blank-text')) {
          let noCardsText = document.createElement('span')
          noCardsText.classList.add('desk__blank-text')
          noCardsText.innerText = 'Нет совпадения'
          this.deskHeader.after(noCardsText)
        }
      } else {
        searchCards.forEach(e => new Card(e).render())
        document.querySelector('.desk__blank-text').remove()
      }
    })
  }

  clearCards() {
    document.querySelectorAll('.desk__card').forEach(e => e.remove())
  }
  filter() {
    this.deskStatusFilter.onchange = () => {
      this.clearCards()
      console.log(this.cards);
      let filterCards = this.cards.filter(item => item.status.toLowerCase() === this.deskStatusFilter.value.toLowerCase());
      if (filterCards.length < 1) {
        if (!document.querySelector('.desk__blank-text')) {
          let noCardsText = document.createElement('span')
          noCardsText.classList.add('desk__blank-text')
          noCardsText.innerText = 'Ничего не найдено'
          this.deskHeader.after(noCardsText)
        }
      } else {
        filterCards.forEach(e => new Card(e).render())
        document.querySelector('.desk__blank-text').remove()
      }
      if (this.deskStatusFilter.value === 'Все') {
        this.getCards()
        document.querySelector('.desk__blank-text').remove()
      }
    }
    this.deskPriorityFilter.onchange = () => {
      this.clearCards()
      let priorCards = this.cards.filter(item => item.urgency.toLowerCase() === this.deskPriorityFilter.value.toLowerCase());
      if (priorCards.length < 1) {
        if (!document.querySelector('.desk__blank-text')) {
          let noCardsText = document.createElement('span')
          noCardsText.classList.add('desk__blank-text')
          noCardsText.innerText = 'Ничего не найдено'
          this.deskHeader.after(noCardsText)
        }
      } else {
        priorCards.forEach(e => new Card(e).render())

        document.querySelector('.desk__blank-text').remove()
      }
      if (this.deskPriorityFilter.value === 'Все') {
        this.getCards()
        document.querySelector('.desk__blank-text').remove()
      }
    }
  }

  
}
