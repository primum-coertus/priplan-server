const { Redis } = require('ioredis');
const model = require('./model');
const { cacheTodayPlan, cacheUpcomingPlan } = require('./helper');

const redis = new Redis();

module.exports = {
  create: async (req, res) => {
    const title = req.body.title;
    const plan = req.body.plan;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const is_completed = req.body.is_completed;
    const planDocument = {
      title,
      plan,
      start_date,
      end_date,
      is_completed
    };

    try {
      await model.insertMany([planDocument]);
      await cacheTodayPlan(model);
      await cacheUpcomingPlan(model);

      res.json({
        statusCode: 201,
        status: 'success',
        message: 'Plan successfully created',
        data: { ...planDocument }
      });
    } catch (err) {
      res.json({
        statusCode: 500,
        status: 'error',
        type: err.name,
        message: err.message
      });
    }
  },
  getToday: async (req, res) => {
    try {
      const plans = await model.find();

      const today = new Date();
      const todayPlans = plans.filter(plan => {
        const endDate = new Date(plan.end_date);
        return endDate.toLocaleDateString() === today.toLocaleDateString();
      });
      await cacheTodayPlan(model);

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Today plans (${todayPlans.length})`,
        data: todayPlans
      });
    } catch (err) {
      res.json({
        statusCode: 500,
        status: 'error',
        type: err.name,
        message: err.message
      });
    }
  },
  getUpcoming: async (req, res) => {
    try {
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
          return (
            new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
          );
        })
        .slice(0, 4);
      await cacheUpcomingPlan(model);

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Upcoming plans (${upcomingPlans.length})`,
        data: upcomingPlans
      });
    } catch (err) {
      res.json({
        statusCode: 500,
        status: 'error',
        type: err.name,
        message: err.message
      });
    }
  },
  deleteById: async (req, res) => {
    const id = req.params._id;

    try {
      const plan = await model.findByIdAndDelete(id);
      await redis.del('get_today');
      await redis.del('get_upcoming');

      if (!plan) {
        res.json({
          statusCode: 404,
          status: 'error',
          type: 'NotFound',
          message: `Plan with id: ${id} doesn't exists`
        });
      }

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Plan with id: ${id} successfully deleted`,
        data: plan
      });
    } catch (err) {
      let type = err.name;
      let statusCode = 500;
      let message = err.message;

      if (type === 'CastError') {
        statusCode = 404;
        type = 'NotFound';
        message = `Plan with id: ${id} doesn't exists`;
      }

      res.json({
        statusCode,
        status: 'error',
        type,
        message
      });
    }
  },
  toggleIsCompletedById: async (req, res) => {
    const id = req.params._id;

    try {
      const plan = await model.findById(id);

      if (!plan) {
        res.json({
          statusCode: 404,
          status: 'error',
          type: 'NotFound',
          message: `Plan with id: ${id} doesn't exists`
        });
      }

      await model.findByIdAndUpdate(id, {
        $set: {
          is_completed: !plan.is_completed
        }
      });
      await cacheTodayPlan(model);
      await cacheUpcomingPlan(model);

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Plan with id: ${id} successfully updated`,
        data: {
          before: {
            is_completed: plan.is_completed
          },
          after: {
            is_completed: !plan.is_completed
          }
        }
      });
    } catch (err) {
      let type = err.name;
      let statusCode = 500;
      let message = err.message;

      if (type === 'CastError') {
        statusCode = 404;
        type = 'NotFound';
        message = `Plan with id: ${id} doesn't exists`;
      }

      res.json({
        statusCode,
        status: 'error',
        type,
        message
      });
    }
  },
  getRoot: (req, res) => {
    res.json({
      statusCode: 200,
      status: 'success',
      message: 'Welcome to PriPlan API'
    });
  }
};
