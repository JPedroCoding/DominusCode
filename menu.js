let currentStep = 1;
let orderData = {
    size: 'media',
    crust: 'normal',
    flavors: [],
    extras: [],
    drinks: [],
    notes: '',
    isHalfHalf: false
};

const sizeMultipliers = {
    broto: 0.7,
    media: 1,
    grande: 1.3,
    familia: 1.6
};

const sizeLabels = {
    broto: 'Broto (4 fatias)',
    media: 'Média (6 fatias)',
    grande: 'Grande (8 fatias)',
    familia: 'Família (12 fatias)'
};

const crustLabels = {
    normal: 'Massa Normal',
    recheada: 'Borda Recheada (+R$ 8,00)'
};

const pizzaFlavors = [
    { id: 1, name: 'Pepperoni', description: 'Molho, mussarela e pepperoni', price: 45, image: 'https://via.placeholder.com/300x200/E31837/FFFFFF?text=Pepperoni' },
    { id: 2, name: 'Margherita', description: 'Molho, mussarela, tomate e manjericão', price: 40, image: 'https://via.placeholder.com/300x200/10b981/FFFFFF?text=Margherita' },
    { id: 3, name: 'Quatro Queijos', description: 'Mussarela, provolone, gorgonzola e parmesão', price: 48, image: 'https://via.placeholder.com/300x200/f59e0b/FFFFFF?text=4+Queijos' },
    { id: 4, name: 'Calabresa', description: 'Molho, mussarela e calabresa', price: 42, image: 'https://via.placeholder.com/300x200/ef4444/FFFFFF?text=Calabresa' },
    { id: 5, name: 'Frango Catupiry', description: 'Frango desfiado com catupiry', price: 44, image: 'https://via.placeholder.com/300x200/8b5cf6/FFFFFF?text=Frango' },
    { id: 6, name: 'Portuguesa', description: 'Presunto, ovos, cebola e azeitonas', price: 46, image: 'https://via.placeholder.com/300x200/0052A3/FFFFFF?text=Portuguesa' }
];

const availableDrinks = [
    { id: 1, name: 'Coca-Cola', size: '350ml', price: 6 },
    { id: 2, name: 'Coca-Cola', size: '2L', price: 12 },
    { id: 3, name: 'Guaraná', size: '350ml', price: 5 },
    { id: 4, name: 'Guaraná', size: '2L', price: 10 },
    { id: 5, name: 'Suco de Laranja', size: '500ml', price: 8 },
    { id: 6, name: 'Água', size: '500ml', price: 4 }
];


window.onload = function() {
    renderFlavors();
    renderDrinks();
    updateSummary();
    updateButtons();
};

function selectSize(event, size) {
    orderData.size = size;

    document.querySelectorAll('.size-card').forEach(card => {
        card.classList.remove('selected');
    });

    const card = event.target.closest('label').querySelector('.size-card');
    if (card) {
        card.classList.add('selected');
    }

    updateSummary();
}

function selectCrust(event, crust) {
    orderData.crust = crust;

    document.querySelectorAll('.crust-card').forEach(card => {
        card.classList.remove('selected');
    });

    const card = event.target.closest('label').querySelector('.crust-card');
    if (card) {
        card.classList.add('selected');
    }

    updateSummary();
}

function toggleHalfHalf() {
    orderData.isHalfHalf = document.getElementById('halfHalf').checked;
    orderData.flavors = [];
    renderFlavors();
    updateSelectedFlavors();
    updateSummary();
    updateButtons();
}

function selectFlavor(flavor) {
    const maxFlavors = orderData.isHalfHalf ? 2 : 1;
    
    const index = orderData.flavors.findIndex(f => f.id === flavor.id);
    
    if (index > -1) {
     
        orderData.flavors.splice(index, 1);
    } else {
      
        if (orderData.flavors.length < maxFlavors) {
            orderData.flavors.push(flavor);
        }
    }
    
    renderFlavors();
    updateSelectedFlavors();
    updateSummary();
    updateButtons();
}

function renderFlavors() {
    const grid = document.getElementById('flavorsGrid');
    const maxFlavors = orderData.isHalfHalf ? 2 : 1;
    
    grid.innerHTML = pizzaFlavors.map(flavor => {
        const isSelected = orderData.flavors.some(f => f.id === flavor.id);
        const isDisabled = !isSelected && orderData.flavors.length >= maxFlavors;
        
        return `
            <div class="flavor-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
                 onclick="${isDisabled ? '' : `selectFlavor(${JSON.stringify(flavor).replace(/"/g, '&quot;')})`}">
                <img src="${flavor.image}" alt="${flavor.name}" class="flavor-image">
                <div class="flavor-info">
                    <h4>${flavor.name}</h4>
                    <p>${flavor.description}</p>
                    <div class="flavor-footer">
                        <span class="flavor-price">R$ ${flavor.price.toFixed(2)}</span>
                        <span class="flavor-selected-badge ${isSelected ? '' : 'hidden'}">Selecionado</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateSelectedFlavors() {
    const container = document.getElementById('selectedFlavors');
    const badges = document.getElementById('flavorBadges');
    
    if (orderData.flavors.length > 0) {
        container.classList.remove('hidden');
        badges.innerHTML = orderData.flavors.map(flavor => 
            `<span class="flavor-badge" onclick="selectFlavor(${JSON.stringify(flavor).replace(/"/g, '&quot;')})">${flavor.name} ✕</span>`
        ).join('');
    } else {
        container.classList.add('hidden');
    }
}

function toggleExtra(checkbox) {
    const value = checkbox.value;
    
    if (checkbox.checked) {
        orderData.extras.push(value);
    } else {
        orderData.extras = orderData.extras.filter(e => e !== value);
    }
    
    updateSummary();
}

function renderDrinks() {
    const grid = document.getElementById('drinksGrid');
    
    grid.innerHTML = availableDrinks.map(drink => `
        <div class="drink-card">
            <div class="drink-info">
                <h4>${drink.name}</h4>
                <p>${drink.size}</p>
                <p class="drink-price">R$ ${drink.price.toFixed(2)}</p>
            </div>
            <button class="drink-add-btn" onclick="addDrink(${JSON.stringify(drink).replace(/"/g, '&quot;')})">+</button>
        </div>
    `).join('');
}

function addDrink(drink) {
    orderData.drinks.push(drink);
    updateSelectedDrinks();
    updateSummary();
}

function removeDrink(index) {
    orderData.drinks.splice(index, 1);
    updateSelectedDrinks();
    updateSummary();
}

function updateSelectedDrinks() {
    const container = document.getElementById('selectedDrinks');
    const list = document.getElementById('drinksList');
    
    if (orderData.drinks.length > 0) {
        container.classList.remove('hidden');
        list.innerHTML = orderData.drinks.map((drink, index) => `
            <div class="drink-item">
                <span>${drink.name} - ${drink.size}</span>
                <div>
                    <span style="font-weight: bold; margin-right: 15px;">R$ ${drink.price.toFixed(2)}</span>
                    <button class="drink-remove-btn" onclick="removeDrink(${index})">✕</button>
                </div>
            </div>
        `).join('');
    } else {
        container.classList.add('hidden');
    }
}

function calculateTotal() {
    let total = 0;
    
  
    if (orderData.flavors.length > 0) {
        const avgPrice = orderData.flavors.reduce((sum, f) => sum + f.price, 0) / orderData.flavors.length;
        total += avgPrice * sizeMultipliers[orderData.size];
    }
    

    if (orderData.crust === 'recheada') {
        total += 8;
    }
    
   
    total += orderData.extras.length * 3;
    
  
    total += orderData.drinks.reduce((sum, d) => sum + d.price, 0);
    
    return total;
}

function updateSummary() {
    const summary = document.getElementById('summary');
    let html = '';
    
  
    html += `
        <div class="summary-item">
            <strong>Tamanho:</strong>
            <span>${sizeLabels[orderData.size]}</span>
        </div>
    `;
    

    html += `
        <div class="summary-item">
            <strong>Massa:</strong>
            <span>${crustLabels[orderData.crust]}</span>
        </div>
    `;
    
   
    if (orderData.flavors.length > 0) {
        html += `
            <div class="summary-item">
                <strong>Sabor(es):</strong>
                ${orderData.flavors.map(f => `<span>• ${f.name}</span>`).join('')}
            </div>
        `;
    }
    

    if (orderData.extras.length > 0) {
        html += `
            <div class="summary-item">
                <strong>Extras:</strong>
                ${orderData.extras.map(e => `<span>• ${e}</span>`).join('')}
            </div>
        `;
    }
    
  
    if (orderData.drinks.length > 0) {
        html += `
            <div class="summary-item">
                <strong>Bebidas:</strong>
                ${orderData.drinks.map(d => `<span>• ${d.name} (${d.size})</span>`).join('')}
            </div>
        `;
    }
    
    html += '<div class="summary-divider"></div>';
    
 
    html += `
        <div class="summary-total">
            <strong>Total:</strong>
            <span class="price">R$ ${calculateTotal().toFixed(2)}</span>
        </div>
    `;
    
    summary.innerHTML = html;
}

function nextStep() {
    if (currentStep === 5) {
     
        if (orderData.flavors.length === 0) {
            alert('Selecione pelo menos um sabor!');
            return;
        }
        
    
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        window.location.href = 'checkout.html';
    } else {
        currentStep++;
        updateStepDisplay();
        updateButtons();
        updateProgressBar();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateButtons();
        updateProgressBar();
    }
}

function updateStepDisplay() {
    
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.add('hidden');
    });
    
   
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('hidden');
    }
    
  
    const titles = {
        1: 'Escolha o Tamanho',
        2: 'Escolha o Tipo de Massa',
        3: 'Escolha o Sabor',
        4: 'Adicione Extras',
        5: 'Escolha as Bebidas'
    };
    
    const descriptions = {
        1: 'Selecione o tamanho da sua pizza',
        2: 'Escolha entre massa normal ou borda recheada',
        3: orderData.isHalfHalf ? 'Selecione até 2 sabores' : 'Selecione 1 sabor',
        4: 'Personalize sua pizza com ingredientes extras',
        5: 'Adicione bebidas ao seu pedido (opcional)'
    };
    
    document.getElementById('stepTitle').textContent = titles[currentStep];
    document.getElementById('stepDescription').textContent = descriptions[currentStep];
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentStep === 1;
    
    if (currentStep === 5) {
        nextBtn.textContent = 'Ir para Finalização →';
    } else {
        nextBtn.textContent = 'Próximo →';
    }
    
   
    if (currentStep === 3) {
        nextBtn.disabled = orderData.flavors.length === 0;
    } else {
        nextBtn.disabled = false;
    }
}

function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        const stepNum = index + 1;
        const numberEl = step.querySelector('.step-number');
        
        if (stepNum === currentStep) {
            step.classList.add('active');
            numberEl.textContent = stepNum;
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
            numberEl.textContent = '✓';
        } else {
            numberEl.textContent = stepNum;
        }
    });
}

function logout() {
    if (confirm('Deseja sair? Seu pedido em andamento será perdido.')) {
        localStorage.removeItem('userRole');
        localStorage.removeItem('currentOrder');
        window.location.href = 'index.html';
    }
}