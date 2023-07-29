const initApp = () => {
    const colors = [];
    const $cols = document.querySelectorAll('.colors__col');

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
    
    const setRandomColors = ($columns) => {
        $columns.forEach(($col) => {
            const $text = $col.querySelector('.colors__text');
            const $toggleBlockedIcon = $col.querySelector('.colors__lock-icon');
            let isLocked = $toggleBlockedIcon ? $toggleBlockedIcon.classList.contains('lock') : false; 
            const color = gerenerateRandomColor();
    
            if (isLocked) {
                return;
            }
    
            $text.textContent = color;
            $col.style.background = color;
        });
    }
    
    const handleKeydown = (evt) => {
        evt.preventDefault();
        const CODE_SPACE = 32;
        if (evt.keyCode === CODE_SPACE) {
            setRandomColors($cols);
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
            changeBlockStatus($lockBtn, colorHash);
        }
        if ($textBtn) {
            copyToClipboard(evt, $textBtn)
        }
    }
    
    const changeBlockStatus = ($lockBtn, colorHash) => {
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
            colors.push(colorHash);
        }
        $lockBtn.innerHTML = iconTemplate;
    }
    const copyToClipboard = (e, $textHash) => {
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

    setRandomColors($cols);
    
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
}

document.addEventListener('DOMContentLoaded', initApp);
