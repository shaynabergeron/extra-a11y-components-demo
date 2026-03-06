/** Nobody make fun of my array of states 😒 */
const dropdownStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const input = document.getElementById("stateDropdownInput");
const button = document.getElementById("stateDropdownToggle");
const listbox = document.getElementById("stateDropdownListbox");
const status = document.getElementById("stateDropdownStatus");
const wrapper = document.querySelector(".component-wrapper");

let filteredItems = [...dropdownStates];
let activeIndex = -1;

/**
 * Announces a message to assistive technology users after a short delay.
 * This allows the message to be read after any existing announcements have been read.
 * @param {string} message - The message to be announced.
 */
function announce(message) {
  status.textContent = "";
  setTimeout(() => {
    status.textContent = message;
  }, 10);
}

/**
 * Opens the suggestion listbox and sets aria-expanded to true.
 * This function is called when the user clicks the browse button.
 */
function openListbox() {
  listbox.hidden = false;
  input.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-label", "Hide state suggestions");
  button.classList.add("open");
}

/**
 * Closes the suggestion listbox and sets aria-expanded to false.
 * This function is called when the user clicks outside the listbox or presses the Escape key.
 */
function closeListbox() {
  listbox.hidden = true;
  input.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Show state suggestions");
  input.setAttribute("aria-activedescendant", "");
  button.classList.remove("open");
}

/**
 * Renders the filtered list of suggestions in the listbox.
 * If no suggestions are available, it renders an empty state message.
 * It also announces the availability of suggestions to assistive technology users.
 */
function renderOptions() {
  listbox.innerHTML = "";

  if (!filteredItems.length) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.setAttribute("role", "presentation");
    empty.textContent = "No suggestions found.";
    listbox.appendChild(empty);
    openListbox();
    announce("No suggestions available.");
    return;
  }

  filteredItems.forEach((item, index) => {
    const option = document.createElement("li");
    option.id = `dropdown-state-option-${index}`;
    option.className =
      "list-group-item list-group-item-action autocomplete-option";
    option.setAttribute("role", "option");
    option.setAttribute(
      "aria-selected",
      index === activeIndex ? "true" : "false",
    );
    option.textContent = item;

    if (index === activeIndex) option.classList.add("active");

    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => selectOption(index));

    listbox.appendChild(option);
  });

  openListbox();
  announce(
    `${filteredItems.length} suggestion${filteredItems.length === 1 ? "" : "s"} available.`,
  );
}

/**
 * Updates the active state of the available options, and also updates the
 * aria-activedescendant attribute of the input field to reflect the currently
 * active option. If there is no active option, the attribute is cleared.
 */
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

/**
 * Filters the list of available options based on the input value.
 * If the input value is empty, the showAllWhenEmpty flag determines whether
 * to show all available options or none at all.
 * If the input value is not empty, the available options are filtered to only
 * include those that contain the input value (case insensitive).
 * If there are no available options after filtering, the suggestions listbox is closed.
 * The active index is reset to -1 after filtering.
 */
function filterItems(value, showAllWhenEmpty = true) {
  const query = value.trim().toLowerCase();
  filteredItems = query
    ? dropdownStates.filter((state) => state.toLowerCase().includes(query))
    : showAllWhenEmpty
      ? [...dropdownStates]
      : [];

  activeIndex = -1;

  if (!filteredItems.length && !query && !showAllWhenEmpty) {
    closeListbox();
    return;
  }

  renderOptions();
}

/**
 * Selects the option at the given index and updates the input value accordingly.
 * The suggestions listbox is closed after selection.
 * If the index is out of range, the function does nothing.
 * @param {number} index - The index of the option to select.
 */
function selectOption(index) {
  if (index < 0 || index >= filteredItems.length) return;
  input.value = filteredItems[index];
  closeListbox();
  announce(`${filteredItems[index]} selected.`);
}

input.addEventListener("input", () => filterItems(input.value, true));

input.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (listbox.hidden) {
        filterItems(input.value, true);
        return;
      }
      if (!filteredItems.length) return;
      activeIndex =
        activeIndex < filteredItems.length - 1 ? activeIndex + 1 : 0;
      updateActiveOption();
      break;
    case "ArrowUp":
      event.preventDefault();
      if (listbox.hidden) {
        filterItems(input.value, true);
        return;
      }
      if (!filteredItems.length) return;
      activeIndex =
        activeIndex > 0 ? activeIndex - 1 : filteredItems.length - 1;
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

button.addEventListener("click", () => {
  if (listbox.hidden) {
    filterItems(input.value, true);
    input.focus();
  } else {
    closeListbox();
    input.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!wrapper.contains(event.target)) closeListbox();
});
