<?php

function initialize_upload_dir()
{
    $upload_dir = "upload/";

    if (!file_exists($upload_dir)) {

        /**
         * check if the upload/ directory exists
         * files recived from the user will be temporarily stored there
         */

        mkdir($upload_dir, 0777, true);
    }
}



function delete_all_files_in_dir($directory_path)
{

    if (is_dir($directory_path)) {
        // open if exists
        if ($handle = opendir($directory_path)) {

            while (false !== ($file = readdir($handle))) {

                if ($file != "." && $file != "..") {
                    // exclude . and ..
                    $file_path = $directory_path . $file;

                    if (is_file($file_path)) {
                        // delete the file
                        error_log("Deleting $file_path");
                        unlink($file_path);
                    }
                }
            }

            // close 
            closedir($handle);
        }
    }
}


function clean_upload_dir()
{
    $upload_dir = "upload/";
    /**
     * check if the upload/ directory exists
     * deletes if exists
     */

    delete_all_files_in_dir($upload_dir);
}
