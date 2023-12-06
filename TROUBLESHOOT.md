## TROUBLESHOOT

### For Ubuntu (If you are using Apache2 server) - (Resolved)

- Apache/php may cause error for larger files more than 30MB. It may also close connection before upploading the file completely causing no file attached when uploading files using POST method.

- You may see the `max Content-Length exceeded` error or reciving empty files in `$_FILES`. I tried to resolve the issue by modifying the default configurations in `php.ini` files of php/apache server.

- Find the `php.ini` files using `<?php phpinfo(); ?>`
- You may need to modify `php.ini` file for both php and apache
- Then modify these default values that may be causing the error.
  - For the backend
    - maximum execution time
    - max memory allowed to allocate by scripts
  - For the frontend form
    - maximum input time
    - max file size allowed
    - max upload files allowed
- you may now restart the server.

- I suggest (If you are using it in local machine)

  - Set the upload files size to 200-300 MB
  - Set the max single file allowed to upload to set 50-100 MB
  - Set the memory allocation limit to 500 MB
  - Set the upload time to 5-10 minuites
  - Set the execution time upto 5 minuites.

- Set these constraints according to your requirements if deploying to production server.
