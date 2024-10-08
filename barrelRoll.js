document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input');
    const body = document.body;

    function checkSpecialCommands(event) {
        const inputValue = event.target.value.toLowerCase();

        if (inputValue === 'do a barrel roll') {
            body.classList.add('barrelRoll');
            setTimeout(() => {
                body.classList.remove('barrelRoll');
            }, 2000);
        }

        if (inputValue === 'do fall') {
            body.classList.add('doFall');

            setTimeout(() => {
                body.classList.remove('doFall');
                body.classList.add('comeBackUp');
            }, 2000);

            setTimeout(() => {
                body.classList.remove('comeBackUp');
            }, 5000); // 2s for fall + 3s for comeback
        }
    }

    inputs.forEach((input) => {
        input.addEventListener('input', checkSpecialCommands);
    });
});
