document.addEventListener('DOMContentLoaded', () => {
    const recordButton = document.getElementById('recordButton');
    let mediaRecorder;
    let audioChunks = [];

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendAudioToServer(audioBlob);
            audioChunks = [];
        };

        recordButton.classList.add('blink');
        recordButton.textContent = 'Stop';
    };

    const stopRecording = () => {
        mediaRecorder.stop();
        recordButton.classList.remove('blink');
        recordButton.textContent = 'Record';
    };

    recordButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            stopRecording();
        } else {
            startRecording();
        }
    });

    const sendAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        try {
            const response = await fetch('/initChat/audio', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Server response:', responseData);
        } catch (error) {
            console.error('Error sending audio to server:', error);
        }
    };
});