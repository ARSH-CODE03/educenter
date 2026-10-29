export function success(res, data = {}, message = "Completed", status = 200) {
  return res.status(status).json({ success: true, data, message });
}

export function created(res, data = {}, message = "Created") {
  return success(res, data, message, 201);
}
