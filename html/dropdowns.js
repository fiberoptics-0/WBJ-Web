let extended = [false, false, false, false];

window.addEventListener('load', () => {
    for (let i = 0; i < 4; i++) {
        let tab = document.getElementById('tab-' + i);
        let content = document.getElementById('content-' + i);
        tab.addEventListener('mouseenter', () => {
            content.style.maxHeight = '250px';
        });
        tab.addEventListener('click', () => {
            if(!extended[i]) {
                content.style.maxHeight = '250px';
                for (let j = 0; j < 4; j++) {
                    if (j !== i) {
                        document.getElementById('content-' + j).style.maxHeight = '0';
                        extended[j] = false;
                    }
                }
            } else {
                content.style.maxHeight = '0';
            }
            extended[i] = !extended[i];
        });
        tab.addEventListener('mouseleave', () => {
            content.style.maxHeight = '0';
        });
        content.addEventListener('mouseenter', () => {
            content.style.maxHeight = '250px';
        });
        content.addEventListener('mouseleave', () => {
            content.style.maxHeight = '0';
        });
    }
})