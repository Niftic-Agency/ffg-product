import { PIcon } from '../organization/icons/PIcon';
import { SORT_OPTIONS } from '../organization/data/sortOptions';

function SortDropdown({ value, onChange }) {
  return (
    <label className="org-sort-native">
      <PIcon.Sort />
      <span className="org-sort-native__label">Sort by:</span>
      <select
        className="org-sort-native__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SORT_OPTIONS.map((o) =>
          <option key={o.id} value={o.id}>{o.label}</option>
        )}
      </select>
      <PIcon.Chevron />
    </label>
  );
}


export { SortDropdown };
