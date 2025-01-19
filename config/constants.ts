console.log('Loading environment variables')
export const OPENWEATHERAPIKEY = process.env.OPENWEATHERAPIKEY

if (!OPENWEATHERAPIKEY) {
  console.warn('OPENWEATHERAPIKEY is not defined in environment variables')
} else {
  console.log('OPENWEATHERAPIKEY is defined')
}

// Log all environment variables (be cautious with sensitive data)
console.log('Environment variables:', Object.keys(process.env).reduce((acc, key) => {
  acc[key] = key.toLowerCase().includes('key') ? '[REDACTED]' : process.env[key];
  return acc;
}, {}))

