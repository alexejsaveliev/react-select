import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export type SelectOption = {
  label: string;
  value: number | string;
};

type SingleSelectProps = {
  isMultiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type MultiSelectProps = {
  isMultiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultiSelectProps);

export function Select({ isMultiple, value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;

      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen && highlightedIndex)
            handleSelectValue(options[highlightedIndex]);
          break;

        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }

          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    containerRef.current?.addEventListener("keydown", eventHandler);

    return () => {
      containerRef.current?.removeEventListener("keydown", eventHandler);
    };
  }, [highlightedIndex, isOpen]);

  const handleClearValue = () => {
    isMultiple ? onChange([]) : onChange(undefined);
  };
  const handleSelectValue = (option: SelectOption) => {
    if (isMultiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else if (option !== value) {
      onChange(option);
    }
  };
  const isOptionSelected = (option: SelectOption) => {
    if (isMultiple) {
      return value.includes(option);
    } else {
      return option === value;
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={styles.container}
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
    >
      <span className={styles.value}>
        {isMultiple
          ? value.map((option) => (
              <button
                key={option.value}
                className={styles["option-chip"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectValue(option);
                }}
              >
                {option.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        className={styles["clear-btn"]}
        onClick={(e) => {
          e.stopPropagation();
          handleClearValue();
        }}
      >
        &times;
      </button>
      <div className={styles.divider} />
      <div className={styles.caret} />
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            key={option.value}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${highlightedIndex === index ? styles.higlighted : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectValue(option);
              setIsOpen(false);
            }}
            onMouseOver={() => setHighlightedIndex(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
