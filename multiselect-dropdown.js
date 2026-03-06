function setupCheckboxEnterSupport(container) {
  container.addEventListener("keydown", (event) => {
    const target = event.target;
    if (
      target &&
      target.matches('input[type="checkbox"]') &&
      event.key === "Enter"
    ) {
      event.preventDefault();
      target.checked = !target.checked;
      target.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

function createSelectionText(selectedArray, emptyText) {
  if (!selectedArray.length) return emptyText;
  return `${selectedArray.length} selected: ${selectedArray.join(", ")}`;
}

const techOptions = [
  "React",
  "Angular",
  "Vue",
  "Svelte",
  "Node.js",
  "Express",
  "Bootstrap",
  "Tailwind",
  "TypeScript",
  "C#",
  ".NET",
  "Python",
  "Playwright",
  "Cypress",
  "Eleventy",
  "Liquid",
];

const trigger = document.getElementById("techDropdownTrigger");
const tagContainer = document.getElementById("techDropdownTagsInline");
const panel = document.getElementById("techDropdownPanel");
const filterInput = document.getElementById("techDropdownFilter");
const optionsContainer = document.getElementById("techDropdownOptions");
const summary = document.getElementById("techDropdownSummary");
const tags = document.getElementById("techDropdownTags");
const status = document.getElementById("techDropdownStatus");
const clearButton = document.getElementById("techDropdownClear");
const doneButton = document.getElementById("techDropdownDone");
const wrapper = document.querySelector(".component-wrapper");

let filteredOptions = [...techOptions];
let selected = new Set();

function announce(message) {
  status.textContent = "";
  setTimeout(() => {
    status.textContent = message;
  }, 10);
}

const selectedCount = selectedArray.length;
const accessibleLabel = selectedCount
  ? `Select technologies, ${selectedCount} selected`
  : "Select technologies, none selected";

trigger.setAttribute("aria-label", accessibleLabel);

function openPanel() {
  panel.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  setTimeout(() => filterInput.focus(), 0);
}

function closePanel(focusTrigger = true) {
  panel.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  if (focusTrigger) trigger.focus();
}

function updateSummary() {
  const selectedArray = Array.from(selected);
  summary.textContent = createSelectionText(
    selectedArray,
    "No technologies selected.",
  );
  tags.innerHTML = "";
  tagContainer.innerHTML = "";

  if (!selectedArray.length) {
    const placeholder = document.createElement("span");
    placeholder.className = "placeholder-text";
    placeholder.textContent = "Select technologies";
    tagContainer.appendChild(placeholder);
  } else {
    selectedArray.slice(0, 2).forEach((item) => {
      const inlineTag = document.createElement("span");
      inlineTag.className = "inline-tag";
      inlineTag.textContent = item;
      tagContainer.appendChild(inlineTag);
    });

    if (selectedArray.length > 2) {
      const more = document.createElement("span");
      more.className = "inline-tag";
      more.textContent = `+${selectedArray.length - 2} more`;
      tagContainer.appendChild(more);
    }
  }

  selectedArray.forEach((item) => {
    const badge = document.createElement("span");
    badge.className = "badge selection-badge";
    badge.textContent = item;
    tags.appendChild(badge);
  });
}

function renderOptions() {
  optionsContainer.innerHTML = "";

  if (!filteredOptions.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No options found.";
    optionsContainer.appendChild(empty);
    return;
  }

  filteredOptions.forEach((item) => {
    const safeId = `dropdown-tech-${item.replace(/[^a-z0-9]/gi, "").toLowerCase()}`;
    const row = document.createElement("div");
    row.className = "multiselect-option";

    const checkbox = document.createElement("input");
    checkbox.className = "form-check-input";
    checkbox.type = "checkbox";
    checkbox.id = safeId;
    checkbox.checked = selected.has(item);

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = safeId;
    label.textContent = item;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selected.add(item);
        announce(`${item} selected.`);
      } else {
        selected.delete(item);
        announce(`${item} removed.`);
      }
      updateSummary();
    });

    row.appendChild(checkbox);
    row.appendChild(label);
    optionsContainer.appendChild(row);
  });
}

filterInput.addEventListener("input", () => {
  const query = filterInput.value.trim().toLowerCase();
  filteredOptions = query
    ? techOptions.filter((item) => item.toLowerCase().includes(query))
    : [...techOptions];
  renderOptions();
});

trigger.addEventListener("click", () => {
  if (panel.hidden) openPanel();
  else closePanel();
});

clearButton.addEventListener("click", () => {
  selected.clear();
  renderOptions();
  updateSummary();
  announce("All selections cleared.");
});

doneButton.addEventListener("click", () => {
  closePanel();
});

panel.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closePanel();
    announce("Dropdown closed.");
  }
});

document.addEventListener("click", (event) => {
  if (!wrapper.contains(event.target) && !panel.hidden) closePanel(false);
});

setupCheckboxEnterSupport(optionsContainer);
renderOptions();
updateSummary();
