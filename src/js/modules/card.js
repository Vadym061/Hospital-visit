
import {
  Modal
} from "./modal.js";


export class Card {
  constructor(visit,title) {
    this.btnDelete = document.createElement('button');
    this.btnEdit = document.createElement('button');
    this.btnMore = document.createElement('button');
    this.cardBody = document.createElement('div')
    this.visit = visit;
    this.id = visit.id
    this.cardsInfo = [];
  }

  render() {

    this.cardBody.classList.add('desk__card')
    this.btnEdit.innerText = 'Изменить'
    this.btnMore.innerText = 'Детально'
    this.btnDelete.innerText = 'x'
    this.btnEdit.classList.add('btn', 'btn-card', 'btn-edit')
    this.btnMore.classList.add('btn', 'btn-card')
    this.btnDelete.classList.add('btn', 'btn-card', 'btn-delete')
    const title = document.createElement('h4')
    const description = document.createElement('span')
    const fullName = document.createElement('span')
    const urgency = document.createElement('span')
    const visitReason = document.createElement('span')
    const status = document.createElement('span')
    status.innerText = `Статус: ${this.visit.status}`
    title.innerText = this.visit.doctor
    description.innerText = `Краткое описание: ${this.visit.description}`
    fullName.innerText = `Полное имя: ${this.visit.fullName}`
    urgency.innerText = `Срочность: ${this.visit.urgency}`
    visitReason.innerText = `Причина последнего визита: ${this.visit.purpose}`
    this.cardsInfo.push(title, description, fullName, urgency, visitReason, status, this.btnMore, this.btnEdit, this.btnDelete);
    this.cardBody.append(...this.cardsInfo)
    document.querySelector('.desk__card-block').append(this.cardBody)
    this.btnDelete.addEventListener('click', this.deleteCard.bind(this))
    this.btnMore.addEventListener('click', () => {
      if (!document.querySelector('.doctorblock')) {
        this.showMore()
        this.btnMore.innerText = 'Скрыть'
      } else {
        this.btnMore.innerText = 'Детально'
        document.querySelector('.doctorblock').remove()
      }

    })
    this.btnEdit.addEventListener('click', () => {
      this.editCard()
    })


  }

  showMore() {
    const doctorBlock = document.createElement('div')
    doctorBlock.classList.add('doctorblock')
    this.cardBody.append(doctorBlock)
    if (this.visit.doctor === 'Therapist') {
      const age = document.createElement('span');
      age.innerText = `Возраст: ${this.visit.age} лет`
      doctorBlock.append(age);

    }
    if (this.visit.doctor === 'Dentist') {
      const date = document.createElement('span');
      date.innerText = `Дата последнего визита: ${this.visit.dateOfLastVisit}`
      doctorBlock.append(date);

    }
    if (this.visit.doctor === 'Cardiologist') {
      const age = document.createElement('span');
      const blood = document.createElement('span');
      const bodyIndex = document.createElement('span');
      const diseases = document.createElement('span');
      age.innerText = `Возраст: ${this.visit.age} лет`
      blood.innerText = ` Давление: ${this.visit.systolicPressure} / ${this.visit.diastolicPressure} `
      bodyIndex.innerText = `Индекс тела: ${this.visit.bmi}`
      diseases.innerText = `Болезни ВСД: ${this.visit.cardiovascularDiseases}`
      doctorBlock.append(age, blood, bodyIndex, diseases);

    }
  }

  deleteCard() {
    fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
        method: 'DELETE',
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
      .then(res => {

        if (res.status === 200) {
          this.cardBody.remove()
          this.btnDelete.removeEventListener('click', this.deleteCard)
        }
      })
  }

  editCard() {

    let newForm = new Modal().renederEdit(this.visit);
    
  }
}
