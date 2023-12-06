## TROUBLESHOOT

### For Ubuntu

Apache/php may cause error for larger files more than 1 mb. We need to mention the max-length of content we allowed to upload with POST method. Make sure to set the maximum allowed file size at `php.ini`. Modify the value from 8MB to 0 to disable the rule. Then restart the web server `sudo service apache2 restart`. Use `<?php phpinfo(); ?>` to find the file path for your OS.

This temporary solution may not work for all environments.
