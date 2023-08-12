let isHashParams = window.location.hash.length > 1;

const parseFromLocationHash = () => {
    return window.location.hash
        .substring(1)
        .split('-')
        .map((color) => '#' + color.toString());
};

let colors = isHashParams ? parseFromLocationHash() : [];

const setLocationHash = (colors) => {
    if (colors.length === 6) {
        window.location.hash = colors
            .map((color) => color.toString().substring(1))
            .join('-');
    }
};

const gerenerateRandomColor = () => {     
    const hexCodes = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        const randomValue = Math.floor(Math.random() * hexCodes.length);
        color += hexCodes[randomValue];
    }
    return '#' + color;
};

const changeBlockStatus = ($lockBtn) => {
    let iconTemplate = `
        <img
            class="colors__lock-icon unlock"
            src="/src/icons/unlock.svg"
            alt="Разблокировано"
            width="30"
            height="30">`;
    
    if ($lockBtn.firstElementChild.classList.contains('unlock')) {
        iconTemplate = `
            <img
                class="colors__lock-icon lock"
                src="/src/icons/lock.svg"
                alt="Заблокировано"
                width="30"
                height="30">`;
    }
    $lockBtn.innerHTML = iconTemplate;
}

const copyToClipboard = ($textHash) => {
    if (!navigator) {
        return;
    }

    navigator.clipboard
        .writeText($textHash.textContent)
        .then(() => {
            createInfoMessage($textHash);
        })
}

const createInfoMessage = ($el) => {
    const div = document.createElement('div');
    div.textContent = 'Скопировано';
    div.className = "info";
    div.id = "info";
    $el.after(div);

    setTimeout(() => {
        const $info = document.getElementById("info");
        $info.parentNode.removeChild($info);
    }, 1500);
}

const setRandomColors = (isHashParams) => {
    const $columns = document.querySelectorAll('.colors__col');
    $columns.forEach(($col, index) => {
        const $text = $col.querySelector('.colors__text');
        const $toggleBlockedIcon = $col.querySelector('.colors__lock-icon');
        let isLocked = $toggleBlockedIcon ? $toggleBlockedIcon.classList.contains('lock') : false; 
        const color = isHashParams ?  colors[index]: gerenerateRandomColor();

        if (isLocked) {
            colors[index] = color;
            return;
        }

        $text.textContent = color;
        $col.style.background = color;
    });
    setLocationHash(colors)
}

const handleKeydown = (evt) => {
    const CODE_SPACE = 32;

    if (evt.keyCode === CODE_SPACE) {
        setRandomColors();
    }
};

const handleClick = (evt) => {
    const targetEl = evt.target;
    let $lockBtn = null;
    let $textBtn = null;
    let colorHash = '';

    if (targetEl.classList.contains('colors__lock-btn') || targetEl.closest('.colors__lock-btn')) {
        $lockBtn = targetEl.closest('.colors__lock-btn')
        $lockBtn.blur();
        colorHash = document.querySelector('.colors__text').textContent;

        if ($lockBtn && colorHash) {
            changeBlockStatus($lockBtn);
        }
    }

    if (targetEl.classList.contains('colors__text')) {
        $textBtn = targetEl;

        if ($textBtn) {
            copyToClipboard($textBtn);
        }
    }
}

setRandomColors(isHashParams);

document.addEventListener('keydown', handleKeydown);
document.addEventListener('click', handleClick);
