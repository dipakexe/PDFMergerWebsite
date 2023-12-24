<?php

include('includes/functions.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {



    /**
     * When the form data (PDF files are submitted).
     */


    if (!empty($_FILES['pdfFiles']['name'])) {

        /**
         * Check if the files are not empty. Make sure in the frontend required=true
         * Still if a single file is sent here then it will be sent back without any processing
         */




        $upload_dir = "upload/";

        clean_upload_dir();
        initialize_upload_dir();

        $file_array = [];

        foreach ($_FILES['pdfFiles']['tmp_name'] as $key => $temporary_name) {

            /**
             * For each selected file in upload/ directory:
             * - find the full relative path for the files
             * - make a list of the files
             */

            $file_name = $_FILES['pdfFiles']['name'][$key];
            $upload_file = $upload_dir . basename($file_name);
            move_uploaded_file($temporary_name, $upload_file);
            $file_array[] = $upload_file;
        }


        $all_files_uploaded_sucessfully = true;
        $merged_output_filename = $upload_dir . "merged.pdf";
        $ghostscript_command = "gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile=$merged_output_filename ";

        foreach ($file_array as $file) {

            /**
             * For each file in the file array, add the path to the command
             */


            if (file_exists($file)) {
                $all_files_uploaded_sucessfully &= true;
            } else {
                $all_files_uploaded_sucessfully &= false;
            }


            $ghostscript_command .= "\"" . $file . "\" ";
        }



        if ($all_files_uploaded_sucessfully) {
            error_log("Uploaded files exists in 'uoload/' directory? YES");
        } else {
            error_log("Uploaded files exists in 'uoload/' directory? NO");
            error_log("Close connection and abort...");
        }


        /**
         * Finally execute the command to combine the files 
         */

        $execution_result = shell_exec($ghostscript_command);


        if ($execution_result == null) {
            /**
             * When the command is executed sucessfully, we are ready to send the combined file to the user.
             * These headers tells the client (use's browser) that the file is being sent as an pdf file attachment.
             */

            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="merged.pdf"');

            readfile($merged_output_filename);

            /**
             * The cleanup for the next session. Make sure we delete the preciously used files in the upload/ directory.
             */

            clean_upload_dir();

            exit();
        } else {
            error_log("Something went wrong when executing ghostscript command.");
        }
    } else {
        error_log("Recived an empty request with no attached files.");
    }
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="assets/javascript/main.js" defer></script>
    <link rel="stylesheet" href="assets/css/style.css">
    <title>PDF Merger</title>


</head>

<body>

    <?php include 'templates/header.php'; ?>

    <div class="container">
        <section class="pdf-selector">
            <form action=" /merge" method="post" enctype="multipart/form-data">
                <label for="pdfFiles">Select PDF Files to Merge</label>
                <div class="file-selector">
                    <button>Upload PDFs</button>
                </div>
                <input hidden required type="file" name="pdfFiles[]" id="pdfFiles" multiple accept=".pdf">
                <div class="buttons">
                    <button type="submit">Merge PDFs</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
        </section>
    </div>

    <?php include 'templates/footer.php'; ?>

</body>

</html>