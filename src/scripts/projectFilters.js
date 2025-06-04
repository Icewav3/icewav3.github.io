/**
 * Project Filtering System
 * Handles client-side filtering and sorting of project cards
 */

class ProjectFilter {
  constructor() {
    this.projectsGrid = document.getElementById("projects-grid");
    this.filterControls = document.getElementById("filter-controls");
    this.sortSelect = document.getElementById("sort-select");
    this.clearButton = document.getElementById("clear-filters");
    this.tagCheckboxes = document.querySelectorAll(".tag-checkbox");
    this.tagButtons = document.querySelectorAll(".tag-filter");

    this.activeTags = new Set();

    this.init();
  }

  init() {
    if (!this.projectsGrid) return;

    // Show filter controls since JS is enabled
    if (this.filterControls) {
      this.filterControls.style.display = "flex";
    }

    // Bind event listeners
    this.sortSelect?.addEventListener("change", () => this.applyFilters());
    this.clearButton?.addEventListener("click", () => this.clearAllFilters());

    // Handle tag button clicks (entire button is clickable)
    this.tagButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // If the checkbox was clicked directly, let it handle the change naturally
        if (e.target.type === "checkbox") {
          // Don't prevent default - let the checkbox work normally
          return;
        }

        // If anywhere else on the button was clicked, toggle the checkbox
        e.preventDefault();
        const checkbox = button.querySelector(".tag-checkbox");
        const newState = !checkbox.checked;

        // Update checkbox state
        checkbox.checked = newState;

        // Trigger our toggle logic
        this.toggleTag(checkbox.value, newState);
      });

      // Handle keyboard accessibility
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const checkbox = button.querySelector(".tag-checkbox");
          checkbox.checked = !checkbox.checked;
          this.toggleTag(checkbox.value, checkbox.checked);
        }
      });
    });

    // Handle direct checkbox changes (for accessibility and direct clicks)
    this.tagCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        // Don't prevent default - let the checkbox work normally
        this.toggleTag(e.target.value, e.target.checked);
      });
    });

    // Apply initial sort
    this.applyFilters();
  }

  toggleTag(tag, isActive) {
    if (isActive) {
      this.activeTags.add(tag);
    } else {
      this.activeTags.delete(tag);
    }

    // Update visual state
    const tagButton = document.querySelector(`.tag-filter[data-tag="${tag}"]`);
    if (tagButton) {
      tagButton.classList.toggle("active", isActive);
      tagButton.setAttribute("aria-pressed", isActive.toString());
    }

    this.applyFilters();
  }

  clearAllFilters() {
    // Clear tag selections
    this.activeTags.clear();
    this.tagCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    this.tagButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });

    // Reset sort to default
    if (this.sortSelect) {
      this.sortSelect.value = "date-desc";
    }

    this.applyFilters();
  }

  applyFilters() {
    // Store current scroll position
    const scrollPosition = window.scrollY;

    const cards = Array.from(this.projectsGrid.children);
    const sortValue = this.sortSelect?.value || "date-desc";

    // Filter cards based on active tags
    cards.forEach((card) => {
      const cardTags = card.dataset.tags ? card.dataset.tags.split(",") : [];
      const shouldShow =
        this.activeTags.size === 0 ||
        [...this.activeTags].some((tag) => cardTags.includes(tag));

      card.style.display = shouldShow ? "block" : "none";
    });

    // Get visible cards and sort them
    const visibleCards = cards.filter((card) => card.style.display !== "none");
    this.sortCards(visibleCards, sortValue);

    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();

    // Build the new order in the fragment
    visibleCards.forEach((card) => {
      fragment.appendChild(card);
    });

    // Add any hidden cards back to maintain DOM structure
    cards.forEach((card) => {
      if (card.style.display === "none") {
        fragment.appendChild(card);
      }
    });

    // Replace all children at once (more efficient)
    this.projectsGrid.innerHTML = "";
    this.projectsGrid.appendChild(fragment);

    // Restore scroll position
    window.scrollTo(0, scrollPosition);

    // Update results count
    this.updateResultsCount(visibleCards.length, cards.length);
  }

  sortCards(cards, sortValue) {
    const parseDate = (dateString) => {
      const parsedDate = new Date(dateString);
      return isNaN(parsedDate) ? new Date(0) : parsedDate;
    };

    cards.sort((a, b) => {
      switch (sortValue) {
        case "date-asc":
          return parseDate(a.dataset.date) - parseDate(b.dataset.date);
        case "date-desc":
          return parseDate(b.dataset.date) - parseDate(a.dataset.date);
        case "title-asc":
          return a.dataset.title.localeCompare(b.dataset.title);
        case "title-desc":
          return b.dataset.title.localeCompare(a.dataset.title);
        default:
          return 0;
      }
    });
  }

  updateResultsCount(visible, total) {
    let resultsElement = document.getElementById("results-count");

    if (!resultsElement) {
      resultsElement = document.createElement("div");
      resultsElement.id = "results-count";
      resultsElement.className = "results-count";
      this.projectsGrid.parentNode.insertBefore(
        resultsElement,
        this.projectsGrid,
      );
    }

    if (visible === total) {
      resultsElement.textContent = `Showing all ${total} projects`;
    } else {
      resultsElement.textContent = `Showing ${visible} of ${total} projects`;
    }

    // Add some styling
    resultsElement.style.cssText = `
            color: var(--tertiary-text-color);
            font-size: var(--font-size-sm);
            margin-bottom: 1rem;
            text-align: center;
        `;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProjectFilter();
});
