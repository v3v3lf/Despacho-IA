// Background service worker
// Routes messages between popup, main frame, and iframes

var panelWindowId = null;

// Recover panel ID on restart
chrome.storage.local.get(['activePanelId'], function (res) {
  if (res.activePanelId) panelWindowId = res.activePanelId;
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ rules: [], logs: [], lastEvent: null });
});

function setPanelId(id) {
  panelWindowId = id;
  chrome.storage.local.set({ activePanelId: id });
}

// Open popup.html as a standalone window
chrome.action.onClicked.addListener(function () {
  if (panelWindowId !== null) {
    chrome.windows.get(panelWindowId, function (win) {
      if (chrome.runtime.lastError || !win) {
        setPanelId(null);
        openPanel();
      } else {
        chrome.windows.update(panelWindowId, { focused: true });
      }
    });
  } else {
    openPanel();
  }
});

function openPanel() {
  chrome.storage.local.get(['panelBounds'], function (data) {
    var bounds = data.panelBounds || {};
    var opts = {
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      width: bounds.width || 440,
      height: bounds.height || 720,
    };
    if (typeof bounds.left === 'number') opts.left = bounds.left;
    if (typeof bounds.top === 'number') opts.top = bounds.top;

    chrome.windows.create(opts, function (win) {
      setPanelId(win.id);
    });
  });
}

chrome.windows.onBoundsChanged.addListener(function (win) {
  if (win.id === panelWindowId) {
    chrome.storage.local.set({
      panelBounds: {
        left: win.left, top: win.top, width: win.width, height: win.height
      }
    });
  }
});

chrome.windows.onRemoved.addListener(function (windowId) {
  if (windowId === panelWindowId) {
    setPanelId(null);
  }
});

// Robust helper to find the SISP tab
function findSispTab(callback) {
  chrome.tabs.query({ url: '*://sisp.ciasc.sc.gov.br/*' }, function (tabs) {
    if (tabs && tabs.length > 0) {
      // Prioritize active or last focused
      var best = tabs.find(t => t.active) || tabs[0];
      callback(best);
    } else {
      // Ultimate fallback: any active non-panel tab
      chrome.tabs.query({ active: true }, function (all) {
        var filtered = all.filter(t => t.windowId !== panelWindowId);
        callback(filtered.length > 0 ? filtered[0] : (all.length > 0 ? all[0] : null));
      });
    }
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  // Messages FROM content scripts (any frame) -> forward to popup
  if (message.type === 'LOG' || message.type === 'STEP_DONE' || message.type === 'STEP_ERROR') {
    chrome.storage.local.set({ lastEvent: { type: message.type, payload: message, ts: Date.now() } });
    chrome.runtime.sendMessage(message).catch(function () { });
    sendResponse({ ok: true });
    return true;
  }

  // Optimized routing: send to all frames immediately
  if (message.type === 'SEND_TO_FRAME_TYPE') {
    var cmd = message.cmd;
    findSispTab(function (tab) {
      if (!tab) { sendResponse({ ok: false, err: 'no tab' }); return; }
      var tabId = tab.id;

      chrome.webNavigation.getAllFrames({ tabId: tabId }, function (frames) {
        if (!frames || frames.length === 0) {
          // Tab-level broadcast if no frames detected
          chrome.tabs.sendMessage(tabId, cmd, function (r) { chrome.runtime.lastError; });
          sendResponse({ ok: true, broadcast: true });
          return;
        }

        frames.forEach(function (frame) {
          chrome.tabs.sendMessage(tabId, cmd, { frameId: frame.frameId }, function (r) {
            chrome.runtime.lastError;
          });
        });
        sendResponse({ ok: true, sentTo: frames.length });
      });
    });
    return true;
  }

  // Legacy broadcast (kept for compatibility)
  if (message.type === 'BROADCAST_TO_FRAMES') {
    var cmd2 = message.cmd;
    findSispTab(function (tab) {
      if (!tab) { sendResponse({ ok: false }); return; }
      var tabId2 = tab.id;
      chrome.webNavigation.getAllFrames({ tabId: tabId2 }, function (frames) {
        if (!frames) { sendResponse({ ok: false }); return; }
        frames.forEach(function (frame) {
          chrome.tabs.sendMessage(tabId2, cmd2, { frameId: frame.frameId }, function (resp) {
            chrome.runtime.lastError;
          });
        });
        sendResponse({ ok: true, frames: frames.length });
      });
    });
    return true;
  }

  // PING from popup
  if (message.type === 'PING_TAB') {
    findSispTab(function (tab) {
      if (!tab) { sendResponse({ ok: false }); return; }
      chrome.tabs.sendMessage(tab.id, { type: 'PING' }, function (resp) {
        if (chrome.runtime.lastError) { sendResponse({ ok: false }); return; }
        sendResponse({ ok: true });
      });
    });
    return true;
  }
});
