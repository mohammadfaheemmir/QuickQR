import './SegmentedControl.css';

/** Accessible segmented control built on native radio inputs (arrow keys work for free). */
export default function SegmentedControl({ name, legend, hint, options, value, onChange, format = String }) {
  return (
    <fieldset className="segmented">
      <legend className="field-label">
        {legend}
        {hint && <span className="segmented__hint"> {hint}</span>}
      </legend>
      <div className="segmented__track">
        {options.map((option) => {
          const selected = option === value;
          return (
            <label key={option} className={`segmented__option ${selected ? 'is-selected' : ''}`}>
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
              />
              <span>{format(option)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
