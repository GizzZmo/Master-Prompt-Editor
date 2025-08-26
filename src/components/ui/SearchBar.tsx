import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  value?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onClear,
  value: controlledValue,
  className,
}) => {
  const [searchValue, setSearchValue] = useState(controlledValue || '');

  useEffect(() => {
    if (controlledValue !== undefined) {
      setSearchValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchValue);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchValue, onSearch]);

  const handleClear = () => {
    setSearchValue('');
    onClear?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 40px 10px 36px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007bff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ddd';
          }}
          aria-label={placeholder}
        />
        
        {/* Search icon */}
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            pointerEvents: 'none',
          }}
        >
          🔍
        </div>

        {/* Clear button */}
        {searchValue && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Clear search"
            title="Clear search (Esc)"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;