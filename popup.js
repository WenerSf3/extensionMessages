let phone;
let btnChecked = false;
let intervalChecked = 0;
let contentText;

document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'voltaParaExtensao') {
      setTimeout(() => {
        timerMessages(true);
      }, 2000);
    }
  });

  var modifyButton = document.getElementById("modifyButton");
  async function timerMessages(status) {
    console.log("comecei denovo");
    if (status) {
      let item = await startProcess();
      let auth = localStorage.getItem("token");
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: clickSend,
        args: [item.id, item.number, item.message, auth],
      });
    } else {
      return;
    }
    function startProcess() {
      return new Promise(async (resolve) => {
        let [message] = await getMessages();
        resolve(message);
      });
    }
    function getMessages() {
      return new Promise((resolve) => {
        fetch("https://back.gdigital.com.br/wpp?status=preparing", {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
          .then(async (response) => {
            let result = await response.json();
            if (!result.length) {
              resolve(false);
            } else {
              resolve(result);
            }
          })
          .catch(async () => {
            let response = await getMessages();
            resolve(response);
          });
      });
    }

    function startProcess() {
      return new Promise(async (resolve) => {
        let [message] = await getMessages();
        // message.forEach(element => {
        //   let item = document.createElement('p');
        //   item.innerText = `${element.message} => ${element.number}`
        //   document.querySelector('.automation-list').appendChild(item);
        // });
        resolve(message);
      });
    }

    function getMessages() {
      return new Promise((resolve) => {
        fetch("https://back.gdigital.com.br/wpp?status=preparing", {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
          .then(async (response) => {
            let result = await response.json();
            if (!result.length) {
              resolve(false);
            } else {
              resolve(result);
            }
          })
          .catch(async () => {
            let response = await getMessages();
            resolve(response);
          });
      });
    }
  }

  modifyButton.addEventListener("click", async function () {
    console.log("btn", btnChecked);
    if (!btnChecked) {
      btnChecked = true;
      modifyButton.style.background = "red";
      modifyButton.innerText = "Parar";
      timerMessages(true);
    } else {
      modifyButton.style.background = "green";
      modifyButton.innerText = "Iniciar";
      btnChecked = false;
      timerMessages(false);
      return;
    }
  });
  async function clickSend(id, number, message, auth) {
    number = await removeCaracters(number);
    console.log(number, message);

    let html = document.querySelector("body");
    let newElement = document.createElement("a");
    newElement.href = `https://wa.me/${number}?text=${message}`;
    html.appendChild(newElement);

    window.debounceRequest = false;
    window.debounceUrl = false;
    document.addEventListener("DOMSubtreeModified", escutaBodyWrapper);

    newElement.click();

    function aaaaa() {
        console.log('kaosdninauisdnisandonasoidnasodnsajkdnkasndkjsajdnsjkadnkasndkjanskjdnkjsdas');
    }

    function escutaBodyWrapper(e) {
      escutaBody(e, id, auth);
    }

    function escutaBody(e, id, auth) {
      let btnSend = e.target.querySelector('[aria-label="Enviar"]');
      let btnErro = e.target.querySelector(
        ".emrlamx0.aiput80m.h1a80dm5.sta02ykp.g0rxnol2.l7jjieqr.hnx8ox4h.f8jlpxt4.l1l4so3b.le5p0ye3.m2gb0jvt.rfxpxord.gwd8mfxi.mnh9o63b.qmy7ya1v.dcuuyf4k.swfxs4et.bgr8sfoe.a6r886iw.fx1ldmn8.orxa12fk.bkifpc9x.rpz5dbxo.bn27j4ou.oixtjehm.hjo1mxmu.snayiamo.szmswy5y"
      );
      let invalidNumber = e.target.querySelector("button");

      if (btnSend) {
        console.log('acheiiii',e.btnSend);

        let btnSendMessage = e.target.querySelector("._2xy_p._3XKXx > button");
        setTimeout(async() => {
          btnSendMessage.click();
          document.removeEventListener("DOMSubtreeModified", escutaBodyWrapper);
          let resp = await changeMessage(id, "sent", auth);
          if(resp){
            chrome.runtime.sendMessage({ action: 'voltaParaExtensao', dados: 'dados que você quer enviar' });
          }
        }, 100);
      } else if (btnErro) {
        console.log('erroooo',e.target);

        let btnError = e.target.querySelector("button");
        setTimeout(async () => {
          btnError.click();
          document.removeEventListener("DOMSubtreeModified", escutaBodyWrapper);
          let resp = await changeMessage(id, "error", auth);
          if(resp){
            chrome.runtime.sendMessage({ action: 'voltaParaExtensao', dados: 'dados que você quer enviar' });
          }
        }, 100);
      } else if(invalidNumber){
        let item = e.target.querySelector('button');
        setTimeout(async() => {
          item.click();
          document.removeEventListener("DOMSubtreeModified", escutaBodyWrapper);
          let resp = await changeMessage(id, "error", auth);
          if(resp){
            chrome.runtime.sendMessage({ action: 'voltaParaExtensao', dados: 'dados que você quer enviar' });
          }
        }, 100);
      }else{
        return;
      }
      // else {
      //   let textExist = document.querySelector('.selectable-text.copyable-text.iq0m558w.g0rxnol2 > .selectable-text.copyable-text');
      //   if (!window.debounceUrl) {
      //     window.debounceUrl = true;
      //     setTimeout(() => {
      //       if(!textExist){
      //         message.click();
      //       }
      //       window.debounceUrl = false;
      //     }, 1000);
        // }

      function changeMessage(id, result, auth) {
        return new Promise((resultado) => {
          if (!window.debounceRequest) {
            window.debounceRequest = true;
            fetch(
              `https://back.gdigital.com.br/wpp/changeStatusMessage?message_id=${id}&status=${result}`,
              {
                method: "POST",
                headers: {
                  Authorization: auth,
                  "Content-Type": "application/json",
                },
              }
            )
              .then(async () => {
                resultado('sucesso');
              })
              .catch((erro) => {
                resultado('error')
              });
            setTimeout(() => {
              window.debounceRequest = false;
            }, 1000);
          } else {
            return;
          }
        })
      }
    }

    function removeCaracters(number) {
      return new Promise((resolve, reject) => {
        let numeros = number.replace(/\D/g, "");
        if (!/\d+/.test(numeros)) {
          reject(new Error("Número inválido. Não contém dígitos."));
          return;
        }
        resolve(numeros);
      });
    }
  }
});
