// FUNCTION TO FETCH THE CURRENT EKADASHIS FILE CONTENT FROM THE SERVER
// AND SHOW THEM TO THE FRONTEND
const fetchEkadashis = () => {
  fetch('/ekadashis')
    .then(res => res.json())
    .then(data => {
      document.querySelector('#existingEkadashis').innerHTML = JSON.stringify(data, null, 2);
    }).
    catch(err => console.error("/ekadashis get request failed: ", err));
}

// FUNCTION TO CHECK IF THE STRING PROVIDED IS A VALID JSON
const isJSON = string => {
  try {
    JSON.parse(string);
  } catch {
    return false;
  }
  return true;
}

// RETURNS FORMATTED JSON STRING
const formatJSON = string => {
  const json = JSON.parse(string);
  return JSON.stringify(json, null, 2);
}

window.addEventListener("load", () => {
  let isEditable = false;

  // FETCH AND SHOW THE CURRENT FILE CONTENT
  fetchEkadashis();

  // SUBMIT THE REQUEST
  document.querySelector("#submit").addEventListener("click", () => {
    document.querySelector("#successOrError").innerHTML = "";
    document.querySelector("#submit").disabled = true;
    document.querySelector("#submit").textContent = "Submitting...";

    let ekadashis = document.querySelector('#newEkadashis').innerHTML;
    const isEkadashisValidJSON = isJSON(ekadashis);
    if (!isEkadashisValidJSON) {
      alert("Please insert valid JSON!");
      document.querySelector("#submit").disabled = false;
      document.querySelector("#submit").textContent = "Submit";
      return;
    }
    ekadashis = JSON.parse(ekadashis);

    const result = confirm("This will override the Ekadashis file permanently. Do you want to go through?");
    if (!result) {
      document.querySelector("#submit").disabled = false;
      document.querySelector("#submit").textContent = "Submit";
      return;
    }

    const password = prompt("Please enter the passphrase:");
    if (password !== "JaySwaminarayan!") {
      alert("Wrong passphrase!");
      document.querySelector("#submit").disabled = false;
      document.querySelector("#submit").textContent = "Submit";
      return;
    }

    fetch('/ekadashis', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ekadashis)
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok === 'true') {
        document.querySelector("#successOrError").innerHTML = "<p class='green'>Ekadashis file has been successfully updated!</p>";
        setTimeout(fetchEkadashis, 500);
      } else {
        document.querySelector("#successOrError").innerHTML = `<p class='red'>Couldn't update the ekadashis file!</p>`;
        console.log(data.message);
      }
    })
    .catch (err => {
      document.querySelector("#successOrError").innerHTML = "<p class='red'>Couldn't update the ekadashis file!</p>";
      console.error('/ekadashis post request failed: ', err);
    });

    document.querySelector("#submit").disabled = false;
    document.querySelector("#submit").textContent = "Submit";
  });

  // HANDLE LOAD CURRENT BUTTON CLICK
  document.querySelector("#loadCurrent").addEventListener("click", () => {
    document.querySelector('#newEkadashis').innerHTML =document.querySelector('#existingEkadashis').innerHTML;
  });

  // HANDLE CLEAR BUTTON CLICK
  document.querySelector("#clear").addEventListener("click", () => {
    document.querySelector('#newEkadashis').innerHTML = "";
  });

  // HANDLE EDIT BUTTON CLICK
  document.querySelector("#edit").addEventListener("click", () => {
    if (isEditable) {
      document.querySelector('#newEkadashis').contentEditable = false;
      isEditable = false;
      document.querySelector("#edit").textContent = "Edit";
      // FORMAT THE JSON IN EDITABLE DIV IF VALID JSON
      const isValidJSON = isJSON(document.querySelector('#newEkadashis').textContent);
      if (!isValidJSON) {
        alert("Invalid JSON!");
        return;
      }
      const json = formatJSON(document.querySelector('#newEkadashis').textContent);
      document.querySelector('#newEkadashis').textContent = json;
    } else {
      document.querySelector('#newEkadashis').contentEditable = true;
      isEditable = true;
      document.querySelector("#edit").textContent = "Plain";
    }
  });
})


