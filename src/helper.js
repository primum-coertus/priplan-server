const { Redis } = require('ioredis');

const redis = new Redis();

const cacheTodayPlan = async model => {
  const plans = await model.find();
  const today = new Date();
  const todayPlans = plans.filter(plan => {
    const endDate = new Date(plan.end_date);
    return endDate.toLocaleDateString() === today.toLocaleDateString();
  });
  const todayResponse = {
    statusCode: 200,
    status: 'success',
    message: `Today plans (${todayPlans.length})`,
    data: todayPlans
  };
  redis.set('get_today', JSON.stringify(todayResponse), 'EX', 3600);
};

const cacheUpcomingPlan = async model => {
  const plans = await model.find();
  const today = new Date();
  const upcomingPlans = plans
    .filter(plan => {
      const endDate = new Date(plan.end_date);
      return (
        endDate.getYear() >= today.getYear() &&
        endDate.getMonth() >= today.getMonth() &&
        endDate.getDate() > today.getDate()
      );
    })
    .sort((a, b) => {
      return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
    })
    .slice(0, 4);
  const upcomingResponse = {
    statusCode: 200,
    status: 'success',
    message: `Upcoming plans (${upcomingPlans.length})`,
    data: upcomingPlans
  };
  redis.set('get_upcoming', JSON.stringify(upcomingResponse), 'EX', 3600);
};

module.exports = {
  cacheTodayPlan,
  cacheUpcomingPlan
};
