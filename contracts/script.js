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

async function drawTable(num, volume, name, i) {
    let div = document.createElement('div');
    div.className = 'content-page';
    div.style.textAlign = 'center';
    let h2 = document.createElement('h2');
    h2.innerText = name;
    div.appendChild(h2);
    let h3 = document.createElement('h3');
    h3.innerText = '退出登录';
    h3.addEventListener('click', () => {
        remove_account(i);
        window.location.reload();
    });
    div.appendChild(h3);
    let contracts = document.createElement('h2');
    contracts.innerText = '当前合同数：' + num;
    div.appendChild(contracts);
    let totalVolume = document.createElement('h2');
    totalVolume.innerText = '当前合同总体积：' + volume;
    div.appendChild(totalVolume);
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

async function refreshContents() {
    let nodes = document.getElementsByClassName('content-page');
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].remove();
    }
    for (let i = 0; i < account_count; i++) {
        running_times[i] += 600;
        if (running_times[i] >= expire_times[i] - 600) {
            refreshToken(i);
        }
        let parse = parseJwt(tokens[i]);
        let characterId = parse.sub.split(':')[2];
        let response = await fetch('https://esi.evetech.net/characters/' + characterId + '/contracts', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokens[i]
            }
        })
        let contracts = await response.json();
        let num = 0;
        let volume = 0;
        for (let contract of contracts) {
            if(contract.status === 'outstanding' && contract.type === 'item_exchange' && contract.availability === 'personal' && contract.assignee_id.toString() === characterId) {
                num++;
                volume += contract.volume;
            }
        }
        await drawTable(num, volume, parse.name, i);
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

async function initialize() {
    if (!running) {
        await refreshContents();
        setInterval(refreshContents, 600000);
        running = true;
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
        refreshTokens().then(() => {
            initialize()
        });
    } else {
        addReturnButton();
    }
});