export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  console.log(`📥 ${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}`);
  
  // Override res.end to log response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    console.log(`📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    originalEnd.apply(this, args);
  };
  
  next();
};
