const model = require('./model');

module.exports = {
  create: async (req, res) => {
    const getTitle = req.body.title;
    const getPlan = req.body.plan;
    const getStart_date = req.body.start_date;
    const getEnd_date = req.body.end_date;
    const getIs_completed = req.body.is_completed;

    const planDocument = {
      title: getTitle,
      plan: getPlan,
      start_date: getStart_date,
      end_date: getEnd_date,
      is_completed: getIs_completed
    };

    await model.insertMany([planDocument]);
    res.send('berhasil menambahkan rencana');
  },
  getAll: async (req, res) => {
    const result = await model.find();
    res.json(result);
  },
  getByTitle: async (req, res) => {
    const result = await model.find({
      title: req.params.title
    });
    res.json(result);
  },
  getById: async (req, res) => {
    const result = await model.find({
      _id: req.params._id
    });
    res.json(result);
  },
  deleteById: async (req, res) => {
    await model.deleteMany({
      _id: req.params._id
    });
    res.send(`berhasil menghaspus plan ${req.body._id}`);
  },
  updateById: async (req, res) => {
    const updateDocument = {
      $set: {
        title: req.body.title,
        plan: req.body.plan,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        is_completed: req.body.is_completed
      }
    };

    const filter = { _id: req.params._id };

    await model.updateMany(filter, [updateDocument]);
    res.send(`update plan dengan id ${req.params._id} berhasil`);
  },
  getRoot: (req, res) => {
    res.send('Selamat datang di PriPlan API');
  }
};
