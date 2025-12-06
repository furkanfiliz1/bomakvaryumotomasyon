import { useEffect } from 'react';

interface EnterEventHandleProps {
  onEnterPress: () => void;
}

/**
 * EnterEventHandle Component
 *
 * A component that listens for Enter key press globally and triggers a callback function.
 * Based on the legacy EnterEventHandle.js pattern but adapted for TypeScript.
 *
 * @param onEnterPress - Function to call when Enter key is pressed
 *
 * @example
 * ```tsx
 * <EnterEventHandle onEnterPress={() => handleSearch()} />
 * ```
 */
const EnterEventHandle: React.FC<EnterEventHandleProps> = ({ onEnterPress }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const ENTER_KEY_CODE = 13;

      if (event.keyCode === ENTER_KEY_CODE) {
        onEnterPress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEnterPress]);

  return null;
};

export default EnterEventHandle;
