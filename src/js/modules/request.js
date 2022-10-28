const sendRequest = async (API, point = '', method = 'GET', config) => {
    return await fetch(`${API}${point}`, {
        method,
        ...config
    }).then(response => {
        if(response.ok) {
            if (point === '/login') {
                return response.text();
            } else {
                return method === 'DELETE' ? response : response.json();
            }
        } else {
            return new Error('Something goes wrong');
        }
    })
}


const getToken = (API, email, password) => sendRequest(API, '/login', 'POST',    {
    headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({ email: `${email}`, password: `${password}`})
});


const sendCard = (API, token, cardData) => sendRequest(API, '', 'POST', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
    body: JSON.stringify(cardData)
});


const getCards = (API, token) => sendRequest(API, ...[,,], {
    headers: {
        'Authorization': `Bearer ${token}`
      }
    });

const getCard = (API, token, cardId) => sendRequest(API, `/${cardId}`, ...[,], {
    headers: {
        'Authorization': `Bearer ${token}`
      }
});




export {getToken, sendCard, getCards, getCard};
