let orderData = {};
let paymentMethod = 'pix';

window.onload = function() {
    // Carregar dados do pedido
    const savedOrder = localStorage.getItem('currentOrder');
    if (!savedOrder) {
        alert('Nenhum pedido encontrado!');
        window.location.href = 'menu.html';
        return;
    }
    
    orderData = JSON.parse(savedOrder);
    renderOrderDetails();
    
    // Validar formulário
    document.getElementById('tableName').addEventListener('input', validateForm);
    document.getElementById('tableNumber').addEventListener('input', validateForm);
};

const sizeMultipliers = {
    broto: 0.7,
    media: 1,
    grande: 1.3,
    familia: 1.6
};

const sizeLabels = {
    broto: 'Broto',
    media: 'Média',
    grande: 'Grande',
    familia: 'Família'
};

function calculateTotal() {
    let total = 0;
    
    // Pizza
    if (orderData.flavors && orderData.flavors.length > 0) {
        const avgPrice = orderData.flavors.reduce((sum, f) => sum + f.price, 0) / orderData.flavors.length;
        total += avgPrice * sizeMultipliers[orderData.size];
    }
    
    // Borda recheada
    if (orderData.crust === 'recheada') {
        total += 8;
    }
    
    // Extras
    if (orderData.extras) {
        total += orderData.extras.length * 3;
    }
    
    // Bebidas
    if (orderData.drinks) {
        total += orderData.drinks.reduce((sum, d) => sum + d.price, 0);
    }
    
    return total;
}

function renderOrderDetails() {
    const container = document.getElementById('orderDetails');
    let html = '';
    
    // Pizza
    html += '<div class="detail-section">';
    html += '<strong>Pizza:</strong>';
    html += '<ul class="detail-list">';
    html += `<li>Tamanho: ${sizeLabels[orderData.size]}</li>`;
    html += `<li>Massa: ${orderData.crust === 'normal' ? 'Normal' : 'Borda Recheada'}</li>`;
    html += '<li>Sabor(es):</li>';
    orderData.flavors.forEach(flavor => {
        html += `<li style="padding-left: 20px;">- ${flavor.name}</li>`;
    });
    
    if (orderData.extras && orderData.extras.length > 0) {
        html += '<li>Extras:</li>';
        orderData.extras.forEach(extra => {
            html += `<li style="padding-left: 20px;">- ${extra}</li>`;
        });
    }
    
    if (orderData.notes) {
        html += `<li>Observações: ${orderData.notes}</li>`;
    }
    
    html += '</ul>';
    html += '</div>';
    
    // Bebidas
    if (orderData.drinks && orderData.drinks.length > 0) {
        html += '<div class="detail-section">';
        html += '<strong>Bebidas:</strong>';
        html += '<ul class="detail-list">';
        orderData.drinks.forEach(drink => {
            html += `<li>${drink.name} - ${drink.size} (R$ ${drink.price.toFixed(2)})</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    // Total
    html += '<div class="total-section">';
    html += '<span>Total:</span>';
    html += `<span class="total-price">R$ ${calculateTotal().toFixed(2)}</span>`;
    html += '</div>';
    
    container.innerHTML = html;
}

function selectPayment(method) {
    paymentMethod = method;
    
    // Atualizar UI
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.payment-option').classList.add('selected');
}

function validateForm() {
    const tableName = document.getElementById('tableName').value.trim();
    const tableNumber = document.getElementById('tableNumber').value.trim();
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (tableName && tableNumber) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}

function confirmOrder() {
    const tableName = document.getElementById('tableName').value.trim();
    const tableNumber = document.getElementById('tableNumber').value.trim();
    
    if (!tableName || !tableNumber) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    // Criar pedido final
    const finalOrder = {
        id: 'ORD' + Date.now(),
        tableName: tableName,
        tableNumber: parseInt(tableNumber),
        ...orderData,
        paymentMethod: paymentMethod,
        total: calculateTotal(),
        status: 'received',
        createdAt: new Date().toISOString()
    };
    
    // Mostrar loading
    document.getElementById('loadingModal').classList.remove('hidden');
    
    // Simular processamento
    setTimeout(() => {
        // Salvar pedido
        localStorage.setItem('confirmedOrder', JSON.stringify(finalOrder));
        localStorage.removeItem('currentOrder');
        
        // Redirecionar para status
        window.location.href = 'status.html';
    }, 2000);
}

function goBack() {
    window.location.href = 'menu.html';
}

function logout() {
    if (confirm('Deseja sair? Seu pedido em andamento será perdido.')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}