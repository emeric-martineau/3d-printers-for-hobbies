module.exports = {
  error: function(msg) {
    process.stderr.write(`[ERROR] ${msg}\n`)
  },
      
  warning: function(msg) {
    process.stderr.write(`[WARN] ${msg}\n`)
  },
      
  info: function(msg) {
    process.stdout.write(`[INFO] ${msg}\n`)
  }
}
