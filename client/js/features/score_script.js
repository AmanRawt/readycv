document.addEventListener('DOMContentLoaded', () => {
    // URL se score nikalna
    const params = new URLSearchParams(window.location.search);
    const score = params.get('score');

    const scoreValueEl = document.getElementById('scoreValue');
    const scoreCircleEl = document.getElementById('scoreCircle');
    const scoreBadgeEl = document.getElementById('scoreBadge');

    if (score && scoreCircleEl) {
        // Score text update karna
        scoreValueEl.textContent = score;

        // Badge ka text aur color score ke hisaab se set karna
        if (score >= 75) {
            scoreBadgeEl.textContent = 'Good!';
            scoreBadgeEl.className = 'score-badge badge-good';
            scoreCircleEl.style.stroke = 'var(--energetic-lime)';
        } else {
            scoreBadgeEl.textContent = 'Average';
            scoreBadgeEl.className = 'score-badge badge-average';
            scoreCircleEl.style.stroke = 'var(--orange-accent)';
        }

        // Circular progress bar ko animate karna
        const radius = scoreCircleEl.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;

        scoreCircleEl.style.strokeDasharray = circumference;
        scoreCircleEl.style.strokeDashoffset = circumference; // Start from 0
        
        // Thode delay ke baad animation shuru karna
        setTimeout(() => {
            scoreCircleEl.style.strokeDashoffset = offset;
        }, 500);
    }
});