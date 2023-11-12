let phone;
let btnChecked = false;
let intervalChecked = 0;
let contentText;

document.addEventListener('DOMContentLoaded', function () {
  var modifyButton = document.getElementById('modifyButton');
  function timerMessages(status) {
    if (status) {
      intervalChecked = setInterval(async () => {
        let item = await startProcess();
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: clickSend,
          args: [item.id, item.number, item.message],
        });
      }, 5000);
    } else {
      clearInterval(intervalChecked);
      return;
    }
    function startProcess() {
      return new Promise(async (resolve) => {
        let [message] = await getMessages();
        resolve(message)
      })
    }
    function getMessages() {
      return new Promise((resolve) => {
        fetch('https://back.gdigital.com.br/wpp?status=preparing', {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
        })
          .then(async (response) => {
            let result = await response.json();
            if (!result.length) {
              resolve(false)
            } else {
              resolve(result);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    }

    function startProcess() {
      return new Promise(async (resolve) => {
        let [message] = await getMessages();
        console.log('busquei');
        resolve(message)
      })
    }

    function getMessages() {
      return new Promise((resolve) => {
        fetch('https://back.gdigital.com.br/wpp?status=preparing', {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
        })
          .then(async (response) => {
            let result = await response.json();
            if (!result.length) {
              resolve(false)
            } else {
              resolve(result);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    }
  };


  modifyButton.addEventListener('click', async function () {
    console.log('btn', btnChecked)
    if (!btnChecked) {
      btnChecked = true;
      modifyButton.style.background = 'red';
      modifyButton.innerText = 'Parar'
      timerMessages(true);
    } else {
      modifyButton.style.background = 'green';
      modifyButton.innerText = 'Iniciar'
      btnChecked = false;
      timerMessages(false);
      return;
    }
  });
  async function clickSend(id, number, message) {
    number = await removeCaracters(number);
    console.log(number, message);
    let html = document.querySelector('body');
    let newElement = document.createElement('a');
    newElement.href = `https://wa.me/${number}?text=${message}`;
    html.appendChild(newElement);
    newElement.click();
    newElement.remove();
    let response = await checkBtn();
    console.log('resut message', response);
    if (response) {
      changeMessage(id, response)
    }

    function changeMessage(id, result) {
      fetch(`https://back.gdigital.com.br/wpp/changeStatusMessage?message_id=${id}&status=${result}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYmFjay5nZGlnaXRhbC5jb20uYnIvbG9naW4iLCJpYXQiOjE2OTk4MDgzNzgsImV4cCI6MTcwMTAxNzk3OCwibmJmIjoxNjk5ODA4Mzc4LCJqdGkiOiI1MHNwYUxNQ0N5M2RPYVNuIiwic3ViIjoiMTYzIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.0MkpyPRYAIhR6x3PIongLKlDDZQR0fEAWJzUouWHpxU`,
          'Content-Type': 'application/json'
        },
      })
        .then(async (response) => {
          console.log('Suceeso', await response.json());
        })
        .catch((erro) => {
          console.error('erro', erro);
        });
    }

    function checkBtn() {
      return new Promise((resolve) => {
        let countTentative = 0;
        window.alert = function () { };
        let timer = setInterval(() => {
          let btn = document.querySelector('.tvf2evcx.oq44ahr5.lb5m6g5c.svlsagor.p2rjqpw5.epia9gcq');
          if (btn) {
            btn.click();
            clearInterval(timer);
            resolve('sent')
          } else {
            setTimeout(() => {
              let msgError = document.querySelector('.emrlamx0.aiput80m.h1a80dm5.sta02ykp.g0rxnol2.l7jjieqr.hnx8ox4h.f8jlpxt4.l1l4so3b.le5p0ye3.m2gb0jvt.rfxpxord.gwd8mfxi.mnh9o63b.qmy7ya1v.dcuuyf4k.swfxs4et.bgr8sfoe.a6r886iw.fx1ldmn8.orxa12fk.bkifpc9x.rpz5dbxo.bn27j4ou.oixtjehm.hjo1mxmu.snayiamo.szmswy5k');
              if (msgError) {
                msgError.click()
                resolve('cancelled')
                clearInterval(timer);
              }
            }, 1000);
            countTentative++
            if (countTentative > 20) {
              resolve('sent')
            }
            console.log('Buscando botão');
          }
        }, 10);
      });
    }

    function removeCaracters(number) {
      return new Promise((resolve, reject) => {
        let numeros = number.replace(/\D/g, '');
        if (!/\d+/.test(numeros)) {
          reject(new Error('Número inválido. Não contém dígitos.'));
          return;
        }
        resolve(numeros);
      });
    }

  }

});

