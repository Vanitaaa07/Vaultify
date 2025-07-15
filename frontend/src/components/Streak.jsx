export const getStreak = () => {
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('lastVisit');
  let streak = parseInt(localStorage.getItem('streak') || '0');

  if (!lastVisit) {
    localStorage.setItem('lastVisit', today);
    localStorage.setItem('streak', '1');
    return 1;
  }

  const lastDate = new Date(lastVisit).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString(); // 24hr ago

  if (lastDate === today) {
    return streak;
  } else if (lastDate === yesterday) {
    streak += 1;
    localStorage.setItem('streak', streak.toString());
    localStorage.setItem('lastVisit', today);
    return streak;
  } else {
    localStorage.setItem('streak', '1');
    localStorage.setItem('lastVisit', today);
    return 1;
  }
};