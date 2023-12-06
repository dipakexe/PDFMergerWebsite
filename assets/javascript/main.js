const form = window.document.querySelectorAll("form")[0];
const file_selector = window.document.querySelectorAll(".file-selector")[0];
const file_selector_button = window.document.querySelectorAll(
  ".file-selector button"
)[0];
const input_pdfs = window.document.querySelectorAll("input[type=file]")[0];
const submit_button = window.document.querySelectorAll(
  "button[type=submit]"
)[0];

const reset_button = window.document.querySelectorAll("button[type=reset]")[0];

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
  /**
   * For now only 100 MB is allowed for now.
   */

  const total_size_in_mb =
    [...input_event.target.files].reduce((acc, file) => acc + file.size, 0) /
    (1024 * 1024);

  if (total_size_in_mb > 100) {
    input_pdfs.value = null;
    form.reset();
  } else {
    updateSelectedFilesInfo(input_event.target.files.length);
  }
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
      alert("Not files are selected.")
      
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

reset_button.onclick = () => {
  form.reset();
  window.location.reload();
};
