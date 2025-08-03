document.addEventListener('DOMContentLoaded', () => {
    const actionList = document.getElementById('action-list');
    
    if (actionList) {
        const actionItems = actionList.querySelectorAll('.action-item');
        const totalTasks = actionItems.length;

        const updateProgress = () => {
            if (totalTasks === 0) {
                localStorage.setItem('mainMissionProgress', 0);
                return;
            };
            const completedTasks = actionList.querySelectorAll('.action-item.completed').length;
            const progress = (completedTasks / totalTasks) * 100;
            localStorage.setItem('mainMissionProgress', progress);

            window.dispatchEvent(new Event('storage'));
        };

        actionList.addEventListener('click', (event) => {
            const actionItem = event.target.closest('.action-item');
            if (actionItem) {
                actionItem.classList.toggle('completed');
                updateProgress();
            }
        });


        updateProgress();
    }
});
