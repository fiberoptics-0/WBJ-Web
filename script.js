const secret = "eat_FIEV2cgtj3Lf7wygUIdsJfl0xgsn4Ht0_2n9UpH"
let refresh_tokens = new Array();
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

function requestToken(code) {
    const tokenUrl = 'https://login.eveonline.com/v2/oauth/token';
    fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + secret)
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code
        })
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem(account_count, data.refresh_token);
            window.location.href = redirectUri;
        })
}

async function initialize() {
    let accounts = document.getElementById('accounts');
    for (let i = 0; i < account_count; i++) {
        let response = await fetch('https://login.eveonline.com/v2/oauth/token', {
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
        let data = await response.json();
        if(data.error) {
            remove_account(i);
            window.location.reload();
        }
        let parse = parseJwt(data.access_token);
        let name = parse.name;
        let h2 = document.createElement('h2');
        h2.innerText = name;
        h2.className = 'account';
        h2.addEventListener('click', () => {
            remove_account(i);
            window.location.reload();
        });
        accounts.appendChild(h2);
    }
}

function generateRandomStateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

redirectUri = 'https://wbj-eve.com';
clientId = '22b40fe6d6da40ae92575a2703b492b5'

scope = "esi-markets.read_character_orders.v1 esi-contracts.read_character_contracts.v1"

function createAuthorizationUrl() {
    const state = generateRandomStateString(16);
    const baseUrl = 'https://login.eveonline.com/v2/oauth/authorize';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        state: state
    });
    return `${baseUrl}?${params.toString()}`;
}

let labelColors = ['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'violet'];
let currentColor = 0;

function updateBuybackLabel() {
    let label = document.getElementById('buyback');
    label.style.color=labelColors[currentColor];
    currentColor = (currentColor + 1) % labelColors.length;
    setTimeout(updateBuybackLabel, 500);
}

window.addEventListener('load', () => {
    while (localStorage.getItem(account_count)) {
        refresh_tokens[account_count] = localStorage.getItem(account_count);
        account_count++;
    }
    if (code) {
        requestToken(code);
    } else {
        if (account_count > 0) {
            initialize();
        }
    }
    updateBuybackLabel();
});