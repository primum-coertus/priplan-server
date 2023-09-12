const model = require('./model');

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
  getAll: async (req, res) => {
    try {
      const result = await model.find();

      res.json({
        statusCode: 200,
        status: 'success',
        message: `All plans (${result.length})`,
        data: result
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
      const result = await model.find();

      const today = new Date();
      const todayResult = result.filter(plan => {
        const endDate = new Date(plan.end_date);
        return endDate.toLocaleDateString() === today.toLocaleDateString();
      });

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Today plans (${todayResult.length})`,
        data: todayResult
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
      const result = await model.find();

      const today = new Date();
      const upComingResult = result
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

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Upcoming plans (${upComingResult.length})`,
        data: upComingResult
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
  getByTitle: async (req, res) => {
    const title = req.params.title;

    try {
      const result = await model.find({ title });

      if (!result || !result.length) {
        res.json({
          statusCode: 404,
          status: 'error',
          type: 'NotFound',
          message: `Plan with title: ${title} doesn't exists`
        });
      }

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Title: ${title}`,
        data: result
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
  getById: async (req, res) => {
    const id = req.params._id;

    try {
      const result = await model.findById(id);

      if (!result) {
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
        message: `Id: ${id}`,
        data: result
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
  deleteById: async (req, res) => {
    const id = req.params._id;

    try {
      const result = await model.findByIdAndDelete(id);

      if (!result) {
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
        data: result
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
  updateById: async (req, res) => {
    const id = req.params._id;

    try {
      const result = await model.findById(id);

      if (!result) {
        res.json({
          statusCode: 404,
          status: 'error',
          type: 'NotFound',
          message: `Plan with id: ${id} doesn't exists`
        });
      }

      const { title, plan, start_date, end_date, is_completed } = req.body;
      const before = {};
      const $set = {};

      if (title) {
        before['title'] = result.title;
        $set['title'] = title;
      }

      if (plan) {
        before['plan'] = result.plan;
        $set['plan'] = plan;
      }

      if (start_date) {
        before['start_date'] = result.start_date;
        $set['start_date'] = start_date;
      }

      if (end_date) {
        before['end_date'] = result.end_date;
        $set['end_date'] = end_date;
      }

      if (is_completed) {
        before['is_completed'] = result.is_completed;
        $set['is_completed'] = is_completed;
      }

      await model.findByIdAndUpdate(id, { $set });

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Plan with id: ${id} successfully updated`,
        data: {
          before,
          after: $set
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
  toggleIsCompletedById: async (req, res) => {
    const id = req.params._id;

    try {
      const result = await model.findById(id);

      if (!result) {
        res.json({
          statusCode: 404,
          status: 'error',
          type: 'NotFound',
          message: `Plan with id: ${id} doesn't exists`
        });
      }

      await model.findByIdAndUpdate(id, {
        $set: {
          is_completed: !result.is_completed
        }
      });

      res.json({
        statusCode: 200,
        status: 'success',
        message: `Plan with id: ${id} successfully updated`,
        data: {
          before: {
            is_completed: result.is_completed
          },
          after: {
            is_completed: !result.is_completed
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
