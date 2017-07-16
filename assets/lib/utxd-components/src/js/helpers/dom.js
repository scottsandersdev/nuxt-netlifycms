/** Class containing DOM helper functions. */
class DomHelpers {
  /**
   * Walks up the DOM hierarchy returning the first DOM node that matches
   * the class name.
   * @param {Node} el The DOM node to start with.
   * @param {string} className The class name that is being searched for.
   * @return {?Node} The DOM node that matches the class name or null.
   */
  getAncestorByClassName (el, className) {
    while (el && el.classList) {
      if (el.classList.contains(className)) {
        return el;
      }

      el = el.parentNode;
    }

    // Reached the root of the DOM without a match
    return null;
  }
}

const domHelpers = new DomHelpers();

export default domHelpers;
