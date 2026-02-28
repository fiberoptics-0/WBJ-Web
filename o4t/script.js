const secret = "eat_FIEV2cgtj3Lf7wygUIdsJfl0xgsn4Ht0_2n9UpH"
const structure_id = 1040804972352
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

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function generateContents() {
    refreshTokens();
    results = document.getElementById('results');
    results.innerHTML = '';
    query = document.getElementById('query').value;
    item_id = 0;
    buy_amount = 0;
    sell_amount = 0
    buy_price = 0;
    sell_price = Infinity;
    let response = await fetch('https://esi.evetech.net/markets/structures/'+structure_id, {
        headers: {
            'Authorization': 'Bearer ' + tokens[0]
        }
    })
    data = await response.json();
    for (let i = 0; i < data.length; i++) {
        if (item_id == 0) {
            let item_response = await fetch('https://esi.evetech.net/universe/types/' + data[i].type_id)
            let item_data = await item_response.json();
            if (item_data.name == query) {
                item_id = data[i].type_id;
            }
            else continue;
        }
        if (data[i].type_id == item_id) {
            if (data[i].is_buy_order) {
                buy_amount += data[i].volume_remain;
                buy_price = Math.max(buy_price, data[i].price);
            }
            else {
                sell_amount += data[i].volume_remain;
                sell_price = Math.min(sell_price, data[i].price);
            }
        }
    }
    if (item_id == 0) {
        results.innerHTML = '未找到物品';
    }
    else {
        results.innerHTML = '买单数量：' + buy_amount + '<br>买单价格：' + buy_price + ' isk' + '<br>卖单数量：' + sell_amount + '<br>卖单价格：' + sell_price + ' isk';
    }
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