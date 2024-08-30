document.addEventListener("DOMContentLoaded", function() {
    const button1 = document.getElementById('chat');

    const button2 = document.getElementById('stop');

    button1.addEventListener('click', function() {

        button1.classList.add('retro-btn-active');

        // Remove the class after animation ends to reset
        setTimeout(() => {
            button1.classList.remove('retro-btn-active');
        }, 400);

        fetch('/initChat/bob/alice') // Replace with the actual URL for the GET request
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // Do something with the response data
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    button2.addEventListener('click', function() {
        button2.classList.add('retro-btn-active');

        // Remove the class after animation ends to reset
        setTimeout(() => {
            button2.classList.remove('retro-btn-active');
        }, 400);
        fetch('/initChat/stop/bob/alice') // Replace with the actual URL for the GET request
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // Do something with the response data
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
