let selectedRole = null;

function selectRole(role) {
    selectedRole = role;
    
    if (role === 'customer') {
        // Cliente entra direto
        showLoading('Acessando área do cliente...');
        setTimeout(() => {
            localStorage.setItem('userRole', 'customer');
            window.location.href = 'menu.html';
        }, 2000);
    } else {
        // Garçom e Cozinha precisam fazer login
        showLoginForm(role);
    }
}

function showLoginForm(role) {
    // Esconder seleção de role
    document.getElementById('roleSelection').classList.add('hidden');
    
    // Mostrar formulário de login
    const loginForm = document.getElementById('loginForm');
    loginForm.classList.remove('hidden');
    
    // Configurar ícone e título baseado no role
    const formIcon = document.getElementById('formIcon');
    const formTitle = document.getElementById('formTitle');
    
    if (role === 'waiter') {
        formIcon.innerHTML = '🍴';
        formIcon.className = 'form-icon waiter';
        formTitle.textContent = 'Login como Garçom';
    } else if (role === 'kitchen') {
        formIcon.innerHTML = '👨‍🍳';
        formIcon.className = 'form-icon kitchen';
        formTitle.textContent = 'Login como Cozinha';
    }
    
    // Limpar campos
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

function backToRoleSelection() {
    // Esconder formulário
    document.getElementById('loginForm').classList.add('hidden');
    
    // Mostrar seleção de role
    document.getElementById('roleSelection').classList.remove('hidden');
    
    selectedRole = null;
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

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

        console.log(data);

        if (data.sucesso) {

            authenticateUser();

        } else {

            alert("Email ou senha inválidos");

        }

    })
    .catch(err => {

        console.error(err);

        alert("Erro ao conectar com o servidor");

    });
}

function authenticateUser() {
    
    document.getElementById('loginForm').classList.add('hidden');
    
   
    const message = selectedRole === 'waiter' 
        ? 'Autenticando como Garçom...' 
        : 'Autenticando como Cozinha...';
    showLoading(message);
    

    setTimeout(() => {
        localStorage.setItem('userRole', selectedRole);
        
        
        if (selectedRole === 'waiter') {
            window.location.href = 'waiter.html';
        } else if (selectedRole === 'kitchen') {
            window.location.href = 'kitchen.html';
        }
    }, 2000);
}

function showLoading(message) {
    document.getElementById('loadingMessage').textContent = message;
    document.getElementById('loadingScreen').classList.remove('hidden');
}

