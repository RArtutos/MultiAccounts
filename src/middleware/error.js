export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).send('Service temporarily unavailable');
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).send(err.message);
  }
  
  // Default error response
  res.status(500).send('Internal Server Error');
}

export function notFoundHandler(req, res) {
  res.status(404).send('Not Found');
}