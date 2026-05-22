let order = {};
let currentStatus = 1;

window.onload = function() {
    // Carregar pedido confirmado
    const savedOrder = localStorage.getItem('confirmedOrder');
    if (!savedOrder) {
        alert('Nenhum pedido confirmado encontrado!');
        window.location.href = 'index.html';
        return;
    }
    
    order = JSON.parse(savedOrder);
    renderOrderInfo();
    simulateStatusUpdates();
};

const sizeLabels = {
    broto: 'Broto',
    media: 'Média',
    grande: 'Grande',
    familia: 'Família'
};

function renderOrderInfo() {
    // ID do pedido
    document.getElementById('orderId').textContent = order.id;
    
    // Detalhes do pedido
    const container = document.getElementById('orderDetails');
    let html = '';
    
    html += `
        <div class="detail-row">
            <span class="detail-label">Mesa:</span>
            <span class="detail-value">#${order.tableNumber} - ${order.tableName}</span>
        </div>
    `;
    
    html += `
        <div class="detail-row">
            <span class="detail-label">Tamanho:</span>
            <span class="detail-value">${sizeLabels[order.size]}</span>
        </div>
    `;
    
    html += `
        <div class="detail-row">
            <span class="detail-label">Massa:</span>
            <span class="detail-value">${order.crust === 'normal' ? 'Normal' : 'Borda Recheada'}</span>
        </div>
    `;
    
    html += `
        <div class="detail-row">
            <span class="detail-label">Sabores:</span>
            <span class="detail-value">${order.flavors.map(f => f.name).join(', ')}</span>
        </div>
    `;
    
    if (order.extras && order.extras.length > 0) {
        html += `
            <div class="detail-row">
                <span class="detail-label">Extras:</span>
                <span class="detail-value">${order.extras.join(', ')}</span>
            </div>
        `;
    }
    
    if (order.drinks && order.drinks.length > 0) {
        html += `
            <div class="detail-row">
                <span class="detail-label">Bebidas:</span>
                <span class="detail-value">${order.drinks.map(d => `${d.name} (${d.size})`).join(', ')}</span>
            </div>
        `;
    }
    
    const paymentLabels = {
        pix: 'PIX',
        card: 'Cartão',
        cash: 'Dinheiro'
    };
    
    html += `
        <div class="detail-row">
            <span class="detail-label">Pagamento:</span>
            <span class="detail-value">${paymentLabels[order.paymentMethod]}</span>
        </div>
    `;
    
    html += `
        <div class="detail-row total-row">
            <span class="detail-label">Total:</span>
            <span class="detail-value">R$ ${order.total.toFixed(2)}</span>
        </div>
    `;
    
    container.innerHTML = html;
}

function simulateStatusUpdates() {
    // Simular atualização de status a cada 5 segundos
    const interval = setInterval(() => {
        if (currentStatus < 5) {
            currentStatus++;
            updateStatus(currentStatus);
        } else {
            clearInterval(interval);
        }
    }, 5000);
}

function updateStatus(status) {
    for (let i = 2; i <= status; i++) {
        const element = document.getElementById(`status${i}`);
        if (element) {
            element.classList.add('active');
        }
    }
    
    // Atualizar tempo estimado
    const timeElement = document.getElementById('estimatedTime');
    const times = {
        1: '25 minutos',
        2: '20 minutos',
        3: '15 minutos',
        4: '5 minutos',
        5: 'Entregue!'
    };
    timeElement.textContent = times[status];
}

function goHome() {
    localStorage.removeItem('confirmedOrder');
    window.location.href = 'index.html';
}

function newOrder() {
    localStorage.removeItem('confirmedOrder');
    window.location.href = 'menu.html';
}

function logout() {
    if (confirm('Deseja sair?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}