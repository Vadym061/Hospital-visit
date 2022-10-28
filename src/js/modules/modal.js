import {
  Card
} from './card.js'
import {
  Board
} from './board.js'

export class Modal {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.container;
  }

  render() {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal" tabindex="-1" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${this.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <p class="invalid-message text-center text-danger mt-2 mb-0"></p>
                    <div class="modal-body">
                        ${this.body}
                    </div>
                </div>
            </div>
        </div>
        `);
    this.modal = new bootstrap.Modal('#myModal', {
      keyboard: false
    });
    this.modal.show();
    this.modal._element.addEventListener('hidden.bs.modal', event => event.target.remove());

  }

  close() {
    this.modal.hide();
  }

  invalid() {
    document.querySelector('.invalid-message').innerHTML = 'Недійсний логін або пароль!';
  }
  renederEdit(visit) {

    this.render();
    document.querySelector(".modal-body").innerText = `Внесіть зміни ${visit.doctor}`;
    document.querySelector(".modal-title").innerText = `Карточка паціента ${visit.fullName}`;

    const status = document.createElement('select')
    const statuses = ['Open', 'Close']
    const age = document.createElement('input');

    const topPresure = document.createElement('input');
    const lowPresure = document.createElement('input');


    const diseases = document.createElement('input');
    const bodyIndex = document.createElement('input');

    const date = document.createElement('input');
    statuses.forEach(e => {
      const option = document.createElement('option')
      option.setAttribute('required', true)
      option.innerText = e
      status.append(option)
    })
    const visitReason = document.createElement('input');
    const visitDescription = document.createElement('textarea');
    const visitFullName = document.createElement('input')
    const visitTitle = document.createElement('input')
    const urgentItems = ['low', 'middle', 'high']
    const urgentList = document.createElement('select')
    urgentList.classList.add('modal-area__urgentlist')
    urgentItems.forEach(element => {
      const option = document.createElement('option')
      option.setAttribute('required', true)
      option.innerText = element
      urgentList.append(option)
    })

    visitReason.value = visit.purpose
    visitDescription.value = visit.description
    visitFullName.value = visit.fullName
    visitTitle.value = visit.doctor

    const visitFields = document.createElement('div')
    visitFields.classList.add('modal-area__visit-fields');
    if (visit.doctor === 'Therapist') {
      age.classList.add('modal-area__modalEdit-input')
      age.value = visit.age
      visitFields.append(age)
    }
    if (visit.doctor === 'Dentist') {
      date.classList.add('modal-area__modalEdit-input')
      date.setAttribute('onfocus', `this.type='date'`)
      date.value = visit.dateOfLastVisit
      visitFields.append(date)
    }
    if (visit.doctor === 'Cardiologist') {
      age.classList.add('modal-area__modalEdit-input')
      topPresure.classList.add('modal-area__modalEdit-input')
      lowPresure.classList.add('modal-area__modalEdit-input')
      bodyIndex.classList.add('modal-area__modalEdit-input')
      diseases.classList.add('modal-area__modalEdit-input')
      age.value = visit.age
      topPresure.value = visit.systolicPressure
      lowPresure.value = visit.diastolicPressure
      bodyIndex.value = visit.bmi
      diseases.value = visit.cardiovascularDiseases
      visitFields.append(age, lowPresure,topPresure, bodyIndex, diseases)
    }
    const jktym = [visitReason, visitTitle, visitDescription, visitFullName, urgentList, status]
    jktym.forEach(e => e.classList.add('modal-area__modalEdit-input'))

    visitFields.append(...jktym)
    const saveEdit = document.createElement('button')
    saveEdit.classList.add('modal-area__editvisitbtn')
    saveEdit.innerText = 'Сохранить'
    this.container = document.querySelector(".modal-body");

    this.container.append(visitFields, saveEdit)
    saveEdit.addEventListener('click', () => {
      const bodyCardio = {
        title: visitTitle.value,
        description: visitDescription.value,
        doctor: visit.doctor,
        age: age.value,
        systolicPressure: topPresure.value,
        diastolicPressure: lowPresure.value,
        bmi: bodyIndex.value,
        cardiovascularDiseases: diseases.value,
        urgency: urgentList.value,
        fullName: visitFullName.value,
        purpose: visitReason.value,
        status: status.value
      }
      const bodyDantist = {
        title: visitTitle.value,
        description: visitDescription.value,
        doctor: visit.doctor,
        dateOfLastVisit: date.value,
        urgency: urgentList.value,
        fullName: visitFullName.value,
        purpose: visitReason.value,
        status: status.value
      }

      const bodyTherapist = {
        title: visitTitle.value,
        description: visitDescription.value,
        doctor: visit.doctor,
        age: age.value,
        urgency: urgentList.value,
        fullName: visitFullName.value,
        purpose: visitReason.value,
        status: status.value

      }
      if (visit.doctor === 'Cardiologist') {
        fetch(`https://ajax.test-danit.com/api/v2/cards/${visit.id}`, {
            method: 'PUT',
            body: JSON.stringify(bodyCardio),
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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
            if (data.status === 'Error') {
              alert(data.message)
            } else {
              let a = new Board().clearCards();
              let b = new Board().getCards();
              document.querySelector('.btn-close').click()
            }
          })

      }
      if (visit.doctor === 'Dentist') {

        fetch(`https://ajax.test-danit.com/api/v2/cards/${visit.id}`, {
            method: 'PUT',
            body: JSON.stringify(bodyDantist),
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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
            if (data.status === 'Error') {
              alert(data.message)
            } else {
              let a = new Board().clearCards();
              let b = new Board().getCards();
              document.querySelector('.btn-close').click()
            }
          })
      }
      if (visit.doctor === 'Therapist') {

        fetch(`https://ajax.test-danit.com/api/v2/cards/${visit.id}`, {
            method: 'PUT',
            body: JSON.stringify(bodyTherapist),
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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
            if (data.status === 'Error') {
              alert(data.message)
            } else {

              let a = new Board().clearCards();
              let b = new Board().getCards();
              document.querySelector('.btn-close').click()

            }
          })

      }


    })

  }
}

export class ModalLogin extends Modal {
  constructor(email = '', password = '', title = 'Введіть логін і пароль') {
    super(title)
    this.email = email;
    this.password = password;
    this.body = `
        <form id="login-form">
            <div class="mb-3 form-floating">
                <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="name@example.com" required value="${this.email}">
                <label for="inputEmail" class="form-label">Ваш мейл</label>
            </div>
            <div class="mb-3 form-floating">
                <input type="password" class="form-control" id="inputPassword" value="${this.password}" placeholder="password" required autocomplete="on">
                <label for="inputPassword" class="form-label">Ваш пароль</label>
            </div>
            <div class="mb-3 d-flex justify-content-end">
                <button type="submit" id="login-btn" class="btn btn__login ms-3">Вхід</button>
            </div>
        </form>
        `
  }
}


export class ModalCreateVisit extends Modal {
  constructor (title = 'Створити візит') {
      super(title);
      this.body = `
      <form id="newVisitForm" class="g-3 needs-validation" novalidate>
          <div class="mb-2 col-12">
              <select id="selectDoctor" class="form-select" aria-label="Status" name="doctor">
                  <option selected disabled>Виберіть лікаря</option>
                  <option value="Cardiologist">Кардіолог</option>
                  <option value="Dentist">Стоматолог</option>
                  <option value="Therapist">Терапевт</option>
              </select>
          </div>
          <div class="row hidden" id="forAllDoctors">
              <div class="col-md-6 col-sm-12">
                  <div class="mb-2 form-floating">
                      <input type="text" class="form-control" id="visitsPurpose" name="purpose" placeholder="Мета візиту" required>
                      <label for="visitsPurpose" class="form-label">Мета візиту</label>
                      <div class="invalid-feedback">
                          Не може бути порожнім!
                      </div>
                  </div>
                  <div class="mb-2 ">
                      <select id="select-urgency" class="form-select" required aria-label="Urgency" name="urgency">
                          <option value="" selected disabled>Терміновість</option>
                          <option value="high">Високий</option>
                          <option value="middle">Середній</option>
                          <option value="low">Низький</option>
                      </select>
                      <div class="invalid-feedback">Виберіть один варіант</div>
                  </div>
              </div>
              <div class="col-md-6 col-sm-12">
                  <div class="mb-2 form-floating">
                      <textarea class="form-control" id="shortDescription" required name="description" placeholder="Короткий опис візиту" style="height: 104px"></textarea>
                      <label for="shortDescription" class="form-label">Короткий опис візиту</label>
                      <div class="invalid-feedback">
                          Не може бути порожнім!
                      </div>
                  </div>
              </div>
              <div class="col-md-12">
                  <div class="mb-2 form-floating">
                      <input type="text" class="form-control" id="userName" name="fullName" placeholder="Ім'я та прізвище" required>
                      <label for="userName" class="form-label">Ім'я та прізвище</label>
                      <div class="invalid-feedback">
                          Будь-ласка, введіть своє ім'я!
                      </div>
                  </div>
              </div>
          </div>
          <div class="row" id="additional"></div>

          <div class="mb-3 d-flex justify-content-end">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
              <button type="submit" id="create-btn" class="btn__create ms-3 hidden">Створити візит</button>
          </div>
      </form>
      `
  }

  render () {
      super.render();

      const form = document.querySelector('#newVisitForm');
      const allDoctorsBlock = form.querySelector('#forAllDoctors');
      const additionalBlock = form.querySelector('#additional');

      const saveBtn = form.querySelector('#create-btn');
      form.addEventListener('change', (e) => {
        e.preventDefault()
          if(e.target === form.querySelector('#selectDoctor')) {
              if(e.target.value === 'Cardiologist') {
                  allDoctorsBlock.classList.remove('hidden');
                  saveBtn.classList.remove('hidden');

                  additionalBlock.innerHTML = `
                      <div class="col-md-6 col-sm-12">
                          <div class="mb-2 form-floating">
                              <input type="number" required class="form-control" name="age" id="age" placeholder="Вік" min="1" max="110">
                              <label for="age" class="form-label">Вік</label>
                              <div class="invalid-feedback">
                                   Введіть свій вік!
                              </div>
                          </div>
                      </div>
                      <div class="col-md-6 col-sm-12">
                          <div class="mb-2 form-floating">
                              <input type="number" required class="form-control" name="bmi" id="bmi" placeholder="Індекс маси тіла" min="1" max="150">
                              <label for="bmi" class="form-label">Індекс маси тіла</label>
                              <div class="invalid-feedback">
                                  Введіть число!
                              </div>
                          </div>
                      </div>
                      <div class="col-12">
                          <div class="input-group mb-2">
                              <span class="input-group-text">Нормальний тиск</span>
                              <input type="number" required id="Systolic" placeholder="Систолічний" name="systolicPressure" class="form-control" min="70" max="170">
                              <input type="number" required id="Diastolic" placeholder="Діастолічний" name="diastolicPressure" class="form-control" min="50" max="110">
                          </div>
                      </div>
                      <div class="col-12">
                          <div class="mb-2 form-floating">
                              <input type="text" required class="form-control" name="cardiovascularDiseases" id="diseases" placeholder="Cardiovascular diseases">
                              <label for="diseases" class="form-label">Серцево-судинні захворювання</label>
                              <div class="invalid-feedback">
                                  Не може бути порожнім!
                              </div>
                          </div>
                      </div>
                  `
              } else if(e.target.value === 'Dentist') {
                  allDoctorsBlock.classList.remove('hidden');
                  saveBtn.classList.remove('hidden');

                  additionalBlock.innerHTML = `
                      <div class="col-12">
                          <div class="mb-2 form-floating">
                              <input type="date" required class="form-control" name="dateOfLastVisit" id="date" placeholder="Дата останнього відвідування">
                              <label for="date" class="form-label">Дата останнього відвідування</label>
                              <div class="invalid-feedback">
                                  Виберіть дату!
                              </div>
                          </div>
                      </div>
                  `
              } else if(e.target.value === 'Therapist') {
                  allDoctorsBlock.classList.remove('hidden');
                  saveBtn.classList.remove('hidden');

                  additionalBlock.innerHTML = `
                  <div class="col-12">
                      <div class="mb-2 form-floating">
                          <input type="number" required class="form-control" name="age" id="age" placeholder="Вік" min="1" max="110">
                          <label for="age" class="form-label">Вік</label>
                          <div class="invalid-feedback">
                              Введіть свій вік
                          </div>
                      </div>
                  </div>
                  `

              }
          }

      })
  }
}
