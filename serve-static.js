import { exec } from 'child_process';

// Build the project first
exec('npm run build', (error) => {
  if (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
  
  // Then serve the static files
  exec('npx serve dist/public -l 5000', (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
    console.log(stdout);
    console.error(stderr);
  });
});
