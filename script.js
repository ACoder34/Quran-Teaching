// Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1378371360992264283/x8iN4M5bna18JTN0mN7bMabAgB9MKj5OQBL6Moq6P_ejW7hmuPwkT5Pn14YBuodB6zaN";

function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        religion: document.getElementById('religion').value,
        country: document.getElementById('country').value
    };

    // Basic validation
    if (!formData.name || !formData.age || !formData.religion || !formData.country) {
        alert('Please fill in all fields');
        return;
    }

    // Age validation
    const age = parseInt(formData.age);
    if (age < 5 || age > 120) {
        alert('Please enter a valid age between 5 and 120');
        return;
    }

    // Create Discord message embed
    const timestamp = new Date().toLocaleString();
    const webhookData = {
        username: "Quran Learning Platform",
        embeds: [{
            title: "New Student Registration",
            color: 0x3f51b5, // Blue color matching your theme
            fields: [
                {
                    name: "Name",
                    value: formData.name,
                    inline: true
                },
                {
                    name: "Age",
                    value: formData.age,
                    inline: true
                },
                {
                    name: "Religion",
                    value: formData.religion,
                    inline: true
                },
                {
                    name: "Country",
                    value: formData.country,
                    inline: true
                }
            ],
            footer: {
                text: `Registration Time: ${timestamp}`
            }
        }]
    };

    // Send to Discord
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    })
    .then(response => {
        if (response.ok) {
            alert('Registration successful! We will contact you soon.');
            document.getElementById('userForm').reset();
        } else {
            throw new Error('Failed to submit registration');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your registration. Please try again.');
    });
}

// Form validation
document.getElementById('name').addEventListener('input', function(e) {
    const value = e.target.value;
    if (!/^[A-Za-z\s]*$/.test(value)) {
        e.target.value = value.replace(/[^A-Za-z\s]/g, '');
    }
});

document.getElementById('age').addEventListener('input', function(e) {
    if (e.target.value < 0) {
        e.target.value = 0;
    }
});

// Class availability and video conferencing code
let jitsiAPI = null;

function updateClassStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    const classStartTime = 20 * 60 + 30; // 8:30 PM in minutes
    const classEndTime = 21 * 60; // 9:00 PM in minutes

    const statusElement = document.getElementById('classStatus');
    const joinButton = document.getElementById('joinButton');

    // Check if it's Friday (5) or Sunday (0)
    if (day === 5 || day === 0) {
        statusElement.className = 'class-status status-unavailable';
        statusElement.innerHTML = '<i class="fas fa-times-circle"></i> No class today (Friday/Sunday)';
        joinButton.disabled = true;
        return;
    }

    // Check if within class hours
    if (currentTime >= classStartTime && currentTime <= classEndTime) {
        statusElement.className = 'class-status status-available';
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Class is currently in session';
        joinButton.disabled = false;
    } else if (currentTime < classStartTime) {
        const hoursUntilClass = Math.floor((classStartTime - currentTime) / 60);
        const minutesUntilClass = (classStartTime - currentTime) % 60;
        statusElement.className = 'class-status status-upcoming';
        statusElement.innerHTML = `<i class="fas fa-clock"></i> Class starts in ${hoursUntilClass}h ${minutesUntilClass}m`;
        joinButton.disabled = true;
    } else {
        statusElement.className = 'class-status status-unavailable';
        statusElement.innerHTML = '<i class="fas fa-times-circle"></i> Class has ended for today';
        joinButton.disabled = true;
    }
}

// Update status every minute
updateClassStatus();
setInterval(updateClassStatus, 60000);

document.getElementById('joinButton').addEventListener('click', function() {
    const meetContainer = document.getElementById('meet');
    
    if (meetContainer.style.display === 'none' || meetContainer.style.display === '') {
        // Show the container and initialize Jitsi
        meetContainer.style.display = 'block';
        
        // Generate a unique room name using date
        const today = new Date();
        const roomName = `QuranClass_${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate()}`;
        
        const domain = 'meet.jit.si';
        const options = {
            roomName: roomName,
            width: '100%',
            height: '100%',
            parentNode: meetContainer,
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                    'security'
                ],
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_BACKGROUND: '#3f51b5',
            },
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: true,
            }
        };
        
        // Create the Jitsi Meet API instance
        jitsiAPI = new JitsiMeetExternalAPI(domain, options);
        
        // Update button text
        this.innerHTML = '<i class="fas fa-times"></i> Close Video Call';
    } else {
        // Hide the container and dispose of Jitsi
        meetContainer.style.display = 'none';
        if (jitsiAPI) {
            jitsiAPI.dispose();
            jitsiAPI = null;
        }
        
        // Reset button text
        this.innerHTML = '<i class="fas fa-video"></i> Join Class Now';
    }
}); 