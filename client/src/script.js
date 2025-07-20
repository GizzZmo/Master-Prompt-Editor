document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const savePromptButton = document.getElementById('savePrompt');
    const clearPromptButton = document.getElementById('clearPrompt');
    const promptList = document.getElementById('promptList');

    let prompts = JSON.parse(localStorage.getItem('prompts')) || [];

    function renderPrompts() {
        promptList.innerHTML = '';
        if (prompts.length === 0) {
            promptList.innerHTML = '<p>No prompts saved yet.</p>';
            return;
        }
        prompts.forEach((promptText, index) => {
            const listItem = document.createElement('li');
            const promptSpan = document.createElement('span');
            promptSpan.textContent = promptText;

            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(promptText)
                    .then(() => {
                        alert('Prompt copied to clipboard!');
                    })
                    .catch(err => {
                        console.error('Failed to copy prompt: ', err);
                    });
            });

            listItem.appendChild(promptSpan);
            listItem.appendChild(copyButton);
            promptList.appendChild(listItem);
        });
    }

    savePromptButton.addEventListener('click', () => {
        const newPrompt = promptInput.value.trim();
        if (newPrompt) {
            prompts.push(newPrompt);
            localStorage.setItem('prompts', JSON.stringify(prompts));
            promptInput.value = '';
            renderPrompts();
        } else {
            alert('Please enter a prompt to save.');
        }
    });

    clearPromptButton.addEventListener('click', () => {
        promptInput.value = '';
    });

    renderPrompts();
});
