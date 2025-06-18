import * as React from 'react';
import { cn } from '@/lib/utils';

interface ComboBoxProps {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ComboBox = React.forwardRef<HTMLInputElement, ComboBoxProps>(
  ({ value, options, placeholder = '', onChange, className = '' }, ref) => {
    const [inputValue, setInputValue] = React.useState(value || '');
    const [isOpen, setIsOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Filter options based on input
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );

    React.useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    React.useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && listRef.current) {
        const el = listRef.current.children[highlightedIndex] as HTMLElement;
        if (el) el.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsOpen(true);
      setHighlightedIndex(-1);
      onChange(e.target.value);
    };

    const handleOptionClick = (option: string) => {
      setInputValue(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onChange(option);
    };

    const handleInputFocus = () => {
      setIsOpen(true);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTimeout(() => setIsOpen(false), 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          setHighlightedIndex((i) =>
            Math.min(i + 1, filteredOptions.length - 1)
          );
          break;
        case 'ArrowUp':
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          if (isOpen && highlightedIndex >= 0) {
            handleOptionClick(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    const handleClear = () => {
      setInputValue('');
      setIsOpen(false);
      setHighlightedIndex(-1);
      onChange('');
      inputRef.current?.focus();
    };

    return (
      <div className={cn('relative w-full', className)}>
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            'pr-8',
            className
          )}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="combobox-listbox"
        />
        {inputValue && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear"
          >
            ×
          </button>
        )}
        {isOpen && filteredOptions.length > 0 && (
          <ul
            ref={listRef}
            id="combobox-listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-sm text-popover-foreground shadow-md"
            role="listbox"
          >
            {filteredOptions.map((option, idx) => (
              <li
                key={option}
                className={cn(
                  // Match SelectItem styles from select.tsx
                  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
                  idx === highlightedIndex
                    ? 'bg-accent text-accent-foreground'
                    : '',
                  'font-normal focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                )}
                onMouseDown={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                role="option"
                aria-selected={idx === highlightedIndex}
                tabIndex={-1}
              >
                {option}
                {idx === highlightedIndex && (
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    {/* Optionally, you can use a check icon here for selected/highlighted */}
                    <svg
                      className="h-4 w-4 text-accent-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
ComboBox.displayName = 'ComboBox';
