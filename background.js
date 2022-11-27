const localStorageDomainKey = "domains";
let domains = [];

const init = async () => {
  const localData = await chrome.storage.local.get([localStorageDomainKey]);
  console.log(`loaded domains from storage ${JSON.stringify(localData)}`);

  domains = localData[localStorageDomainKey] ?? [];

  chrome.tabs.onUpdated.addListener(handleTabsUpdate);
  chrome.runtime.onMessage.addListener(handleMessage);
};

const handleTabsUpdate = (tabId, changeInfo, tab) => {
  const domain = extractDomain(tab.url);
  if (isTargetDomain(domain)) {
    sendFunctionToActiveTab(tabId);
  }
};

const handleMessage = (request, sender, sendResponse) => {
  if (request.type == "worktimer-notification") {
    chrome.notifications.create(
      "worktimer-notification",
      request.options,
      () => {}
    );
  }

  domains = request.payload.domains;
  setDomainsToStorage(domains);

  sendResponse();
};

const sendFunctionToActiveTab = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    function: addFrameDocumentBody,
  });
};

const addFrameDocumentBody = () => {
  document.body.style.borderStyle = "solid";
  document.body.style.borderColor = "red";
  document.body.style.borderWidth = "10px";
};

const isTargetDomain = (domain) => {
  const isProdDomain = domains.some((prodDomain) =>
    domain.includes(prodDomain)
  );

  return isProdDomain;
};

const extractDomain = (domain) => {
  domain = domain.replace(/(https?:\/\/)?(www.)?/i, "");

  if (domain.indexOf("/") !== -1) {
    return domain.split("/")[0];
  }

  return domain;
};

const setDomainsToStorage = async (domains) => {
  console.log(`setting domains ${domains}`);
  await chrome.storage.local.set({ [localStorageDomainKey]: domains });
};

init();
