const Business = require('./business.model');

async function listBusinesses() {
  const businesses = await Business.find({})
    .populate({
      path: 'user_id',
      select: '-password',
      populate: { path: 'user_role_id' },
    })
    .sort({ _id: -1 });

  return {
    ok: true,
    status: 200,
    data: businesses,
  };
}

module.exports = {
  listBusinesses,
};
