const ServiceCategory = require('./service-category.model');

async function listServiceCategories() {
  const categories = await ServiceCategory.find({}).sort({ service_category_name: 1 });

  return {
    ok: true,
    status: 200,
    data: categories,
  };
}

module.exports = {
  listServiceCategories,
};
