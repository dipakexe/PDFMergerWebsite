/**
 * A common selector method
 */


const $ = (selector) => window.document.querySelectorAll(selector);


/**
 * Form Handling
 */


/**
 * Find and select required elements. Report if any form element is missing.
 */

const form = $("form")[0];
const file_selector = $(".file-selector")[0];
const file_selector_button = $(".file-selector button")[0];
const input_pdfs = $("input[type=file]")[0];
const submit_button = $("button[type=submit]")[0];

if (
  (
    form == undefined ||
    file_selector == undefined ||
    file_selector_button == undefined ||
    input_pdfs == undefined ||
    submit_button == undefined
  )
) {
  console.error("Some form elements are missing.");
}

/**
 * Callback for handling click on file selector button. When this button is clicked then the input element gets triggered.
 */

file_selector.onclick = function () {
  input_pdfs.click();
};



function updateSelectedFilesInfo(numFiles) {
  if (numFiles > 0) {
    file_selector_button.textContent = `Selected ${numFiles} file${
      numFiles > 1 ? "s" : ""
    }`;
  } else {
    file_selector_button.textContent = "";
  }
}

input_pdfs.onchange = (input_event) => {
  updateSelectedFilesInfo(input_event.target.files.length);
};

form.onsubmit = (form_event) => {
  form_event.preventDefault();
};

submit_button.onclick = async (submit_button_event) => {
  submit_button_event.preventDefault();

  var inputs = form.querySelectorAll("[required]");

  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].value) {
      // files are not selected
      alert("Not files are selected.");

      form.reportValidity();
      return false;
    }
  }

  var form_data = new FormData(form);
  const response = await fetch("/merge", {
    method: "POST",
    body: form_data,
  });

  /**
   * If the backend finds the input valid and returns ok. Then download the output file.
   */

  if (response.ok) {
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);

    document.body.removeChild(a);
  } else {
    console.error("Failed to merge PDFs you submitted.");
  }
};

/**
 * Reset Button
 */

const reset_button = $("button[type=reset]")[0];

if (reset_button) {
  reset_button.onclick = () => {
    form.reset();
    window.location.reload();
  };
} else {
  console.error("Reset button not found.");
}
