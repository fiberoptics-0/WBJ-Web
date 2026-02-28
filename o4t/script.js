const secret = "eat_FIEV2cgtj3Lf7wygUIdsJfl0xgsn4Ht0_2n9UpH"
let tokens = new Array();
let refresh_tokens = new Array();
let running = false;
let expire_times = new Array();
let running_times = new Array();
let account_count = 0;

function remove_account(i) {
    for (let j = i; j < account_count - 1; j++) {
        localStorage.setItem(j, localStorage.getItem(j + 1));
    }
    localStorage.removeItem(account_count - 1);
}

async function drawTable(orders, name, i) {
    let div = document.createElement('div');
    div.className = 'content-page';
    div.style.textAlign = 'center';
    let h2 = document.createElement('h2');
    h2.innerText = name;
    div.appendChild(h2);
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>物品</th><th>收单/卖单</th><th>价格</th><th>剩余量</th><th>星区</th><th>军团订单</th></tr>';
    table.appendChild(thead);
    let tbody = document.createElement('tbody');
    for (let order of orders) {
        let response = await fetch('https://esi.evetech.net/universe/names', {
            method: 'POST',
            headers: {
                'Accept-Language': 'zh',
                'Content-Type': 'application/json'
            },
            body: '[' + order.type_id + ',' + order.region_id + ']'
        })
        let names = await response.json();
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.innerText = names[0].name;
        let td2 = document.createElement('td');
        td2.innerText = order.is_buy_order ? '收单' : '卖单';
        let td3 = document.createElement('td');
        td3.innerText = order.price + ' isk';
        let td4 = document.createElement('td');
        td4.innerText = order.volume_remain + '/' + order.volume_total;
        let td5 = document.createElement('td');
        td5.innerText = names[1].name;
        let td6 = document.createElement('td');
        td6.innerText = order.is_corporation ? '军团' : '非军团';
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    div.appendChild(table);
    document.body.appendChild(div);
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function generateContents() {

}

async function refreshToken(i) {
    const tokenUrl = 'https://login.eveonline.com/v2/oauth/token';
    response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + secret)
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_tokens[i]
        })
    })
    data = await response.json();
    if(data.error) {
        remove_account(i);
        window.location.reload();
    }
    tokens[i] = data.access_token;
    refresh_tokens[i] = data.refresh_token;
    localStorage.setItem(i, data.refresh_token);
    expire_times[i] = data.expires_in;
    running_times[i] = 0;
}

async function refreshTokens() {
    for (let i = 0; i < account_count; i++) {
        await refreshToken(i);
    }
}

redirectUri = 'https://wbj-eve.com';
clientId = '22b40fe6d6da40ae92575a2703b492b5'

window.addEventListener('load', () => {
    while (localStorage.getItem(account_count)) {
        refresh_tokens[account_count] = localStorage.getItem(account_count);
        account_count++;
    }
    if (account_count > 0) {
        refreshTokens();
    } else {
        addReturnButton();
    }
});