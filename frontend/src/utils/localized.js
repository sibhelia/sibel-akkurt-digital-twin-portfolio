/**
 * Returns the localized value of a field from a database object.
 * If the English version (_en) exists and language is 'en', returns it.
 * Otherwise falls back to the Turkish (default) value.
 *
 * @param {Object} item - The database object (e.g., a project, service, etc.)
 * @param {string} field - The field name (e.g., 'title', 'description')
 * @param {string} language - Current language ('tr' or 'en')
 * @returns {string} The localized string
 *
 * Usage:
 *   const { language } = useLanguage();
 *   localized(project, 'title', language) // returns project.title_en if en, else project.title
 */
export function localized(item, field, language) {
  if (!item) return "";
  if (language === "en") {
    const enValue = item[`${field}_en`];
    if (enValue && enValue.trim() !== "") return enValue;
  }
  return item[field] || "";
}
