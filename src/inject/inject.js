/* global chrome */

const hostname = window.location.hostname
let store = {}

chrome.storage.sync.get(null, (obj) => {
  const domain = obj.settings ? obj.settings.domain : null
  if (!domain) {
    console.log(`Email domain is not set. Open chrome-extension://${chrome.runtime.id}/src/options/index.html to set it.`)
  } else {
    store = obj
    onload(domain)
  }
})

const generateAddress = (domain) => {
  if (!domain || !hostname) {
    return null
  }
  const alias = psl.get(hostname)
  const time = Math.floor(Date.now() / 1000).toString(36)

  return `${alias}-${time}@${domain}`
}

const saveAlias = (address) => {
  chrome.storage.sync.set({
    [hostname]: {
      address,
      secure: window.location.protocol === 'https:',
      timestamp: Date.now()
    }
  })
}

const onload = (domain) => {
  const emails = document.querySelectorAll('input[type="email"]')
  const address = generateAddress(domain)
  
  if (emails.length) {
    if (address) {
      emails.forEach((el) => {
        el.value = address
        
        if (el.form) {
          el.form.addEventListener('submit', function() {
            saveAlias(address)
          });
        } else {
          saveAlias(address)
        }
      })
    }
  }
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
      if (request.clipboard) {
        navigator.clipboard.writeText(address)
      }
    }
  );
}
