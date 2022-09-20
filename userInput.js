window.onload = () => {

    const form = document.forms.graphForm;
    const xErrorContainer = document.getElementById("xError");
    const yErrorContainer = document.getElementById("yError");
    const rErrorContainer = document.getElementById("rError");
    const prevResultsContainer = document.getElementById("prevResults");
    const emptyPrevResults = document.getElementById("emptyPrevResults");

    const pushResults = (results) => {
        if(!results?.length) return;
        prevResultsContainer.innerHTML = "";
        emptyPrevResults.classList.add("hidden");
        results.forEach(({ x, y, r, isHit, currentTime, executionTime }) => {
            const newEntry = document.createElement("tr");

            const xElem = document.createElement("td");
            xElem.textContent = x;
            newEntry.appendChild(xElem);
    
            const yElem = document.createElement("td");
            yElem.textContent = y;
            newEntry.appendChild(yElem);
    
            const rElem = document.createElement("td");
            rElem.textContent = r;
            newEntry.appendChild(rElem);
    
            const timestampElem = document.createElement("td");
            timestampElem.textContent = currentTime;
            newEntry.appendChild(timestampElem);
    
            const executionTimeElem = document.createElement("td");
            executionTimeElem.textContent = `${executionTime} мс`;
            newEntry.appendChild(executionTimeElem);
    
            const isHitElem = document.createElement("td");
            isHitElem.textContent = isHit ? "Есть" : "Нет";
            newEntry.appendChild(isHitElem);
    
            prevResultsContainer.prepend(newEntry);
        })
    };

    const buttonValues = {
        x: undefined,
        r: undefined,
    };

    const handleInputButton = (e) => {
        const { name, value } = e.target;
        if (!name || !value) return;
        e.target.parentNode
            .querySelectorAll("input[type=button]")
            .forEach((input) => input.classList.remove("activeButton"));

        buttonValues[name] = value;

        e.target.classList.add("activeButton");
    };

    document
        .querySelectorAll("input[type='button']")
        .forEach((input) => input.addEventListener("click", handleInputButton));

    const validateButtonNumber = (value, lowerBound, upperBound) => {
        try {
            const num = Number(value);
            return num <= upperBound && num >= lowerBound;
        } catch (e) {
            return false;
        }
    };

    const validateTextNumber = (value, lowerBound, upperBound) => {
        try {
            const num = Number(value);
            return num < upperBound && num > lowerBound;
        } catch (e) {
            return false;
        }
    };

    fetch(".//graphChecker.php", {
        method: "get",
        credentials: 'include'
    })
    .then(data => data.json())
    .then(pushResults)
    .catch((e) => {
        alert("Возникла ошибка при получении результатов");
        console.error(e);
    });

    form.onsubmit = (event) => {
        event.preventDefault();
        const formValues = new FormData(form);

        const x = buttonValues["x"];
        const r = buttonValues["r"];

        const y = formValues.get("y");

        const isXvalid = validateButtonNumber(x, -3, 5);
        const isRvalid = validateButtonNumber(r, 1, 5);

        const isYvalid = validateTextNumber(y, -3, 5);

        if (!isXvalid) {
            xErrorContainer.innerText = "Выберете значение переменной X";
        } else {
            xErrorContainer.innerText = "";
        }
        if (!isYvalid) {
            yErrorContainer.innerText =
                "Введите корректное значение переменной Y (в интервале от -3 до 5 невключительно, разделитель - '.')";
        } else {
            yErrorContainer.innerText = "";
        }
        if (!isRvalid) {
            rErrorContainer.innerText = "Выберете значение переменной R";
        } else {
            rErrorContainer.innerText = "";
        }
        if (!isXvalid || !isYvalid || !isRvalid) return;

        formValues.append("x", x);
        formValues.append("r", r);
        formValues.append("TZ", new Date().getTimezoneOffset());

        fetch("./graphChecker.php", {
            method: "post",
            body: formValues,
            credentials: 'include'
        })
        .then((data) => data.json())
        .then(pushResults)
        .catch((e) => {
            alert("Возникла ошибка при обработке формы");
            console.error(e);
        });
    };
};
