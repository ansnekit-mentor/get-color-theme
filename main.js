const initApp = () => {
    console.log(1111);
    let isHashParams = false;

    if (window.location.hash.length > 1) {
        isHashParams = true;
    }

    const gerenerateRandomColor = () => {
        // RGB
        // #FF0000
        // #00FF00
        // #0000FF
        
        const hexCodes = '0123456789ABCDEF';
        let color = '';
        for (let i = 0; i < 6; i++) {
            const randomValue = Math.floor(Math.random() * hexCodes.length);
            color += hexCodes[randomValue];
        }
        return '#' + color;
    };
    
    const setRandomColors = (isHashParams) => {
        const $columns = document.querySelectorAll('.colors__col');
        const colors = isHashParams ? parseFromHashParams() : [];
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
        updateColorsHash(colors)
    }
    
    const handleKeydown = (evt) => {
        evt.preventDefault();
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
            colorHash = document.querySelector('.colors__text').textContent;
        }
        if (targetEl.classList.contains('colors__text')) {
            $textBtn = targetEl;
        }
        if ($lockBtn && colorHash) {
            changeBlockStatus($lockBtn);
        }
        if ($textBtn) {
            copyToClipboard($textBtn);
        }
    }
    
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
    const updateColorsHash = (colors) => {
        if (colors.length === 6) {
            window.location.hash = colors
                .map((color) => color.toString().substring(1))
                .join('-');
        }
        
    };

    const parseFromHashParams = () => {
        return window.location.hash
            .substring(1)
            .split('-')
            .map((color) => '#' + color.toString());
    };

    setRandomColors(isHashParams);
    
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
}

document.addEventListener('DOMContentLoaded', initApp);
