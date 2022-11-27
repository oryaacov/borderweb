const localStorageDomainsKey = "domains";
let domains = [];

const Init = () => {
    InitAddButton();

    domains = loadDomainsFromLocalData();
    domains.forEach((domain) => addDomainToListComponent(domain));

    updateBackgroundService();
}

const InitAddButton = () => {
    const addButton = document.getElementsByTagName("button")[0];

    addButton.onclick = addDomainOnClickHandler;
}
const loadDomainsFromLocalData = () => {
    const localData = localStorage.getItem(localStorageDomainsKey);

    return localData ? JSON.parse(localData) : [];
}

const addDomainToListComponent = (domain) => {
    const listItem = document.createElement("li");
    const label = document.createElement("label");
    const deleteButton = document.createElement("button");

    label.innerText = domain;

    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    deleteButton.onclick = deleteDomain;

    listItem.appendChild(label);
    listItem.appendChild(deleteButton);

    const domainsComponent = document.getElementById("domains");
    domainsComponent.appendChild(listItem);
}

const addDomainOnClickHandler = () => {
    const taskInput = document.getElementById("new-task");
    if (!taskInput.value.length) {
        return;
    }

    const domain = taskInput.value;
    domains.push(domain);
    setDomainsToLocalStorage(domains);
    updateBackgroundService();

    addDomainToListComponent(domain);
    taskInput.value = "";
};

const removeFromDomains = (domain) => {
    removeItemFromArray(domains, domain)
    setDomainsToLocalStorage(domains);

    updateBackgroundService();
}

const deleteDomain = (e) => {
    const listItem = e.srcElement.parentNode;
    const ul = listItem.parentNode;
    const domain = listItem.querySelector("label").innerText;

    ul.removeChild(listItem);
    removeFromDomains(domain);
}

const setDomainsToLocalStorage = (domains) => {
    localStorage.setItem(localStorageDomainsKey, JSON.stringify(domains));
}

const removeItemFromArray = (arr, item) => {
    const index = arr.indexOf(item);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

const updateBackgroundService = () => {
    chrome.runtime.sendMessage({
        type: "notification", payload: { domains }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    Init();
});
