document.addEventListener("DOMContentLoaded", function() {
    const liveFeedContainer = document.getElementById('live-feed');

    var bleepSource = new EventSource('/initChat/bleeps');

    bleepSource.onmessage = (event) => {
        var data = JSON.parse(event.data);
        handleBleep(data);
    };

    function handleBleep(data) {
        // Create a new div element
        const newPost = document.createElement('div');
        newPost.className = 'post';
        newPost.innerHTML = `<span class="bleeper"> ${data.avatar}</span> posted:<br> ${data.message}`;
        liveFeedContainer.prepend(newPost);
    }
    
});
