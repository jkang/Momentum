document.addEventListener('DOMContentLoaded', () => {
    const treeElement = document.getElementById('momentum-tree');
    const treeStatusElement = document.getElementById('tree-status');

    function updateTree() {
        if (!treeElement || !treeStatusElement) return;


        const progress = parseFloat(localStorage.getItem('mainMissionProgress')) || 0;

        treeElement.className = 'relative w-32 h-40'; // Reset classes
        
        if (progress === 0) {
            treeElement.classList.add('state-seed');
            treeStatusElement.textContent = '一棵等待萌芽的小树苗。';
        } else if (progress < 40) {
            treeElement.classList.add('state-sapling');
            treeStatusElement.textContent = '你已迈出第一步，小树苗破土而出！';
        } else if (progress < 100) {
            treeElement.classList.add('state-growing');
            treeStatusElement.textContent = '持续的努力让小树茁壮成长。';
        } else { // progress === 100
            treeElement.classList.add('state-flourishing');
            treeStatusElement.textContent = '任务完成，硕果累累！';
        }
    }


    updateTree();



    window.addEventListener('storage', () => {
        updateTree();
    });
});
