function login(){
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    console.log(email, senha);

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.sucesso) {
        alert("Login realizado!");
        } else {
        alert("Email ou senha inválidos");
        }
  });
}
