function setupCheckboxEnterSupport(container) {
  container.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target && target.matches('input[type="checkbox"]') && event.key === "Enter") {
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
  "React", "Angular", "Vue", "Svelte", "Node.js", "Express",
  "Bootstrap", "Tailwind", "TypeScript", "C#", ".NET", "Python",
  "Playwright", "Cypress", "Eleventy", "Liquid"
];

const filterInput = document.getElementById("techFilterStatic");
const optionsContainer = document.getElementById("techOptionsStatic");
const summary = document.getElementById("techSummaryStatic");
const tags = document.getElementById("techTagsStatic");
const status = document.getElementById("techStatusStatic");

let filteredOptions = [...techOptions];
let selected = new Set();

function announce(message) {
  status.textContent = "";
  setTimeout(() => { status.textContent = message; }, 10);
}

function updateSummary() {
  const selectedArray = Array.from(selected);
  summary.textContent = createSelectionText(selectedArray, "No technologies selected.");
  tags.innerHTML = "";

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
    const safeId = `static-tech-${item.replace(/[^a-z0-9]/gi, "").toLowerCase()}`;
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

setupCheckboxEnterSupport(optionsContainer);
renderOptions();
updateSummary();
