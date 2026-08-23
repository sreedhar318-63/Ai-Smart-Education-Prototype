/**
 * 90-Day Activity Heatmap Mock Generator
 * 
 * NOTE FOR PROTOTYPE REVIEWS:
 * Since there is no backend or database in this prototype, heatmap historical data is 
 * generated in-memory upon app load. Today's cell updates live as the user completes 
 * topics in their active React state session. Everything resets upon page refresh.
 */

export function generate90DayHeatmapData() {
  const days = [];
  const today = new Date();
  
  // Topic pools for realistic tooltip titles
  const mockTopicsPool = [
    'Component Lifecycles', 'Props & State Intro', 'SQL Aggregations',
    'Pandas Dataframes', 'Custom Hooks', 'Tailwind Layouts',
    'REST API Basics', 'Async/Await Patterns', 'Memoization Trade-offs',
    'Error Boundaries', 'State Reducers', 'Python Data Cleaning'
  ];

  for (let i = 89; i >= 0; i--) {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - i);
    const dateStr = dateObj.toISOString().split('T')[0];
    const isToday = i === 0;

    // Seed realistic activity pattern (more activity in recent weeks, some rest days)
    let count = 0;
    const randomVal = Math.random();

    // 0 = Today (starts at 0, updated live by session)
    if (!isToday) {
      if (i < 14) {
        // Last 2 weeks: active 80% of days
        if (randomVal > 0.2) count = Math.floor(Math.random() * 4) + 1;
      } else if (i < 45) {
        // 2-6 weeks ago: active 60% of days
        if (randomVal > 0.4) count = Math.floor(Math.random() * 3) + 1;
      } else {
        // 6-12 weeks ago: active 40% of days
        if (randomVal > 0.6) count = Math.floor(Math.random() * 3) + 1;
      }
    }

    // Pick 1-3 random topic names if active
    const topicsCovered = [];
    if (count > 0) {
      const numTopics = Math.min(count, 3);
      for (let t = 0; t < numTopics; t++) {
        const randTopic = mockTopicsPool[Math.floor(Math.random() * mockTopicsPool.length)];
        if (!topicsCovered.includes(randTopic)) topicsCovered.push(randTopic);
      }
    }

    // Calculate intensity 0-4
    let intensity = 0;
    if (count === 1) intensity = 1;
    else if (count === 2) intensity = 2;
    else if (count === 3) intensity = 3;
    else if (count >= 4) intensity = 4;

    days.push({
      dateStr,
      formattedDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dayOfWeek: dateObj.getDay(),
      count,
      intensity,
      topicsCovered,
      isToday
    });
  }

  return days;
}

/**
 * Helper to update today's cell in the heatmap array
 */
export function updateTodayHeatmap(heatmapDays, additionalCount, newTopicTitle) {
  return heatmapDays.map(day => {
    if (day.isToday) {
      const newCount = day.count + additionalCount;
      let newIntensity = 0;
      if (newCount === 1) newIntensity = 1;
      else if (newCount === 2) newIntensity = 2;
      else if (newCount === 3) newIntensity = 3;
      else if (newCount >= 4) newIntensity = 4;

      const updatedTopics = [...day.topicsCovered];
      if (newTopicTitle && !updatedTopics.includes(newTopicTitle)) {
        updatedTopics.push(newTopicTitle);
      }

      return {
        ...day,
        count: newCount,
        intensity: newIntensity,
        topicsCovered: updatedTopics
      };
    }
    return day;
  });
}
