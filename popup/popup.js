document.getElementById('save').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: save,
    });
});

document.getElementById('input').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: input,
    });
});

document.getElementById('clear').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: clear,
    });
});

function save() {
    var inputs = document.querySelectorAll('input:not([type=hidden])');
    inputs.forEach((el) => {
        if (!el.name) return;

        let datum = {};
        let key;

        if (el.type == 'checkbox') {
            key = `${el.name}-${el.value}`;
            datum[key] = el.checked;
        } else if (el.type == 'radio') {
            key = `${el.name}-${el.value}`;
            datum[key] = el.checked;
        } else {
            key = el.name;
            datum[key] = el.value;
        }

        chrome.storage.sync.set(datum);
    });

    var textareas = document.querySelectorAll('textarea:not([type=hidden])');
    textareas.forEach((el) => {
        if (!el.name) return;

        let datum = {};
        datum[el.name] = el.value;

        chrome.storage.sync.set(datum);
    });

    var selects = document.querySelectorAll('select:not([type=hidden])');
    selects.forEach((el) => {
        if (!el.name) return;

        let datum = {};
        datum[el.name] = el.value;

        chrome.storage.sync.set(datum);
    });
}

function input() {
    var inputs = document.querySelectorAll('input:not([type=hidden])');
    inputs.forEach((el) => {
        if (!el.name) return;

        let key;

        if (el.type == 'checkbox') {
            key = `${el.name}-${el.value}`;
            chrome.storage.sync.get([key], (data) => {
                if (data[key]) {
                    el.checked = true;
                }
            });
        } else if (el.type == 'radio') {
            key = `${el.name}-${el.value}`;
            chrome.storage.sync.get([key], (data) => {
                if (data[key]) {
                    el.click();
                }
            });
        } else {
            key = el.name;
            chrome.storage.sync.get([key], (data) => {
                if (data[key]) {
                    el.value = data[key];
                }
            });
        }
    });

    var textareas = document.querySelectorAll('textarea:not([type=hidden])');
    textareas.forEach((el) => {
        if (!el.name) return;

        chrome.storage.sync.get([el.name], (data) => {
            if (data[el.name]) {
                el.value = data[el.name];
            }
        });
    });

    var selects = document.querySelectorAll('select:not([type=hidden])');
    selects.forEach((el) => {
        if (!el.name) return;

        chrome.storage.sync.get([el.name], (data) => {
            if (!data[el.name]) return;

            let option = el.querySelector(`option[value='${data[el.name]}']`);
            if (option) option.selected = true;
        });
    });

}

function clear() {
    chrome.storage.sync.clear();
}
