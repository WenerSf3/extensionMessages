let btnSubmit = document.querySelector('.login-account');
if(localStorage.getItem('token')){
    document.querySelector('.loginn').style.display = 'none';
    document.querySelector('.automation').style.display = 'block';
}
btnSubmit.addEventListener('click' , () => {
    console.log('clicou no login')
    let email = document.querySelector('.email').value;
    let password = document.querySelector('.password').value;

    if(email && password){
        let data = {
            email: email,
            password: password
        }
        fetch('https://back.gdigital.com.br/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(async (response) => {
            let result = await response.json();
            console.log('resukl',result)
            if(result.message == "Unauthorized"){
                alert('Conta invalida')
                return;
            }
            localStorage.setItem('token', `${result.token_type} ${result.token}`)
            document.querySelector('.loginn').style.display = 'none';
            document.querySelector('.automation').style.display = 'block';
          })
          .catch(() => {
            alert('login incorreto')
        });
    }else{
        alert('Preencha os campos')
    }
});