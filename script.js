document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Získání elementů ---
    const claimButton = document.getElementById('claim-button');
    
    // Modální okna
    const successModal = document.getElementById('success-modal');
    const failureModal = document.getElementById('failure-modal');
    const encourageModal = document.getElementById('encourage-modal');

    // Tlačítka
    const showEncourageBtn = document.getElementById('show-encourage-modal-btn');
    const closeEncourageBtn = document.getElementById('close-encourage-modal-btn');

    // Elementy bodů
    const currentPointsElement = document.getElementById('current-points');
    const currentExtraPointsElement = document.getElementById('current-extra-points');

    // Kontejner pro padající obrázky
    const fallingContainer = document.querySelector('.falling-images-container');


    // --- 2. Konstanty pro ověření ---
    const REQUIRED_POINTS = 15;
    const REQUIRED_EXTRA_POINTS = 5;


    // --- 3. Funkce pro správu modálních oken ---

    /** Zobrazí modální okno. */
    function showModal(modalElement) {
        modalElement.classList.remove('hidden');
        modalElement.classList.add('visible');
    }

    /** Skryje modální okno. */
    function hideModal(modalElement) {
        modalElement.classList.remove('visible');
        setTimeout(() => {
            modalElement.classList.add('hidden');
        }, 500); 
    }

    /**
     * NEJROBUSTNĚJŠÍ FUNKCE: Přečte obsah elementu a extrahuje POUZE číslice.
     * Tímto se zajistí, že i text jako "  16 bodů" nebo "Asi curka nic"
     * se převede na "16" nebo prázdný řetězec, který parseInt spolehlivě zpracuje.
     */
    function getPointsValue(element) {
        // Získá text
        const text = element.textContent;
        // Extrahujeme POUZE číslice (0-9) z celého textu.
        const numericString = text.replace(/[^0-9]/g, '');
        
        // Převede na celé číslo (parseInt). Pokud je řetězec prázdný (nic nenašlo), 
        // parseInt ho převede na 0 (nebo bychom použili ternární operátor, ale pro bezpečnost použijeme 0)
        const value = parseInt(numericString, 10);
        
        // Vrací hodnotu. Pokud se náhodou vrátí NaN (Not a Number), vrátí 0.
        return isNaN(value) ? 0 : value;
    }


    // --- 4. Logika pro tlačítko "Získat produkt nyní!" ---
    claimButton.addEventListener('click', () => {
        
        // Použití nejpřísnější funkce pro získání číselné hodnoty
        const userPoints = getPointsValue(currentPointsElement);
        const userExtraPoints = getPointsValue(currentExtraPointsElement);
        
        // Zde doporučuji zkontrolovat v prohlížeči (stiskněte F12 -> Console)
        // jestli se zobrazují správné hodnoty, které JS načetl.
        console.log('--- Kontrola bodů ---');
        console.log(`Načtené Body (userPoints): ${userPoints}`);
        console.log(`Načtené Extra body (userExtraPoints): ${userExtraPoints}`);
        console.log(`Požadované Body: ${REQUIRED_POINTS}, Požadované Extra Body: ${REQUIRED_EXTRA_POINTS}`);
        console.log('---------------------');


        // Ověření splnění podmínek (>= 15 bodů AND >= 5 extra bodů)
        if (userPoints >= REQUIRED_POINTS && userExtraPoints >= REQUIRED_EXTRA_POINTS) {
            // Podmínky splněny
            showModal(successModal);
        } else {
            // Podmínky nesplněny
            showModal(failureModal);
        }
    });


    // --- 5. Logika pro přechody mezi modály ---

    // Z failure-modal do encourage-modal
    showEncourageBtn.addEventListener('click', () => {
        hideModal(failureModal);
        showModal(encourageModal);
    });

    // Z encourage-modal zpět na stránku
    closeEncourageBtn.addEventListener('click', () => {
        hideModal(encourageModal);
    });
    
    // Umožnění zavření kliknutím mimo modál
    [successModal, failureModal, encourageModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });


    // --- 6. Speciální efekt: Padající obrázky ---
    const fallingImages = ["pad1.png", "pad2.png", "pad3.png", "pad4.png"];

    function createFallingImage() {
        const image = document.createElement('div');
        image.classList.add('falling-image');
        const imgSrc = fallingImages[Math.floor(Math.random() * fallingImages.length)];
        image.style.backgroundImage = `url('${imgSrc}')`;
        const startX = Math.random() * window.innerWidth;
        image.style.left = `${startX}px`;
        const animationDuration = Math.random() * 10 + 5; 
        image.style.animationDuration = `${animationDuration}s`;
        const animationDelay = Math.random() * 5; 
        image.style.animationDelay = `${animationDelay}s`;
        const size = Math.random() * 30 + 30;
        image.style.width = `${size}px`;
        image.style.height = `${size}px`;
        fallingContainer.appendChild(image);
        image.addEventListener('animationend', () => {
            image.remove();
        });
    }

    function startFallingEffect() {
        const maxSimultaneous = 3; 
        setInterval(() => {
            const count = Math.ceil(Math.random() * maxSimultaneous);
            for (let i = 0; i < count; i++) {
                setTimeout(createFallingImage, Math.random() * 500); 
            }
        }, Math.random() * 9000 + 1000);
    }

    startFallingEffect();
});