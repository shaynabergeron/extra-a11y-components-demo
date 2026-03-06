const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const input = document.getElementById("stateInput");
const listbox = document.getElementById("stateListbox");
const status = document.getElementById("stateStatus");
const wrapper = document.querySelector(".component-wrapper");

let filteredItems = [];
let activeIndex = -1;

function announce(message) {
  status.textContent = "";
  setTimeout(() => { status.textContent = message; }, 10);
}

function openListbox() {
  listbox.hidden = false;
  input.setAttribute("aria-expanded", "true");
}

function closeListbox() {
  listbox.hidden = true;
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-activedescendant", "");
  activeIndex = -1;
}

function renderOptions() {
  listbox.innerHTML = "";

  if (!filteredItems.length) {
    closeListbox();
    announce("No suggestions available.");
    return;
  }

  filteredItems.forEach((item, index) => {
    const option = document.createElement("li");
    option.id = `state-option-${index}`;
    option.className = "list-group-item list-group-item-action autocomplete-option";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
    option.textContent = item;

    if (index === activeIndex) option.classList.add("active");

    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => selectOption(index));

    listbox.appendChild(option);
  });

  openListbox();
  announce(`${filteredItems.length} suggestion${filteredItems.length === 1 ? "" : "s"} available.`);
}

function updateActiveOption() {
  const options = listbox.querySelectorAll('[role="option"]');
  options.forEach((option, index) => {
    const isActive = index === activeIndex;
    option.classList.toggle("active", isActive);
    option.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  if (activeIndex >= 0 && options[activeIndex]) {
    input.setAttribute("aria-activedescendant", options[activeIndex].id);
    options[activeIndex].scrollIntoView({ block: "nearest" });
    announce(filteredItems[activeIndex]);
  } else {
    input.setAttribute("aria-activedescendant", "");
  }
}

function filterItems(value) {
  const query = value.trim().toLowerCase();
  if (!query) {
    filteredItems = [];
    closeListbox();
    return;
  }

  filteredItems = states.filter((state) => state.toLowerCase().includes(query));
  activeIndex = -1;
  renderOptions();
}

function selectOption(index) {
  if (index < 0 || index >= filteredItems.length) return;
  input.value = filteredItems[index];
  closeListbox();
  announce(`${filteredItems[index]} selected.`);
}

input.addEventListener("input", () => filterItems(input.value));

input.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      if (!filteredItems.length) return;
      event.preventDefault();
      if (listbox.hidden) openListbox();
      activeIndex = activeIndex < filteredItems.length - 1 ? activeIndex + 1 : 0;
      updateActiveOption();
      break;
    case "ArrowUp":
      if (!filteredItems.length) return;
      event.preventDefault();
      if (listbox.hidden) openListbox();
      activeIndex = activeIndex > 0 ? activeIndex - 1 : filteredItems.length - 1;
      updateActiveOption();
      break;
    case "Enter":
      if (!listbox.hidden && activeIndex >= 0) {
        event.preventDefault();
        selectOption(activeIndex);
      }
      break;
    case "Escape":
      if (!listbox.hidden) {
        event.preventDefault();
        closeListbox();
        announce("Suggestions closed.");
      }
      break;
    case "Tab":
      closeListbox();
      break;
  }
});

document.addEventListener("click", (event) => {
  if (!wrapper.contains(event.target)) closeListbox();
});
