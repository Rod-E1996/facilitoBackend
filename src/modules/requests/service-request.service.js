const ServiceRequest = require('./service-request.model');

async function listServiceRequests() {
  const requests = await ServiceRequest.find({})
    .populate({ path: 'customer_id', select: '-password' })
    .populate({ path: 'service_id' })
    .sort({ service_request_date: -1 });

  return {
    ok: true,
    status: 200,
    data: requests,
  };
}

module.exports = {
  listServiceRequests,
};
