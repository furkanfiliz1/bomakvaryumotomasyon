import { KeyboardEvent } from 'react';

/**
 * Creates a handler for keyboard events that triggers form submission on Enter key press
 * @param onSubmit - Function to call when Enter key is pressed
 * @returns Keyboard event handler
 *
 * @example
 * ```tsx
 * const handleKeyPress = createEnterKeyHandler(() => {
 *   console.log('Enter pressed!');
 * });
 *
 * // Use in JSX
 * <input onKeyPress={handleKeyPress} />
 * ```
 */
export const createEnterKeyHandler = (onSubmit: () => void) => {
  return (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };
};

/**
 * Hook-like utility for handling Enter key form submission
 * @param submitHandler - Form submit handler function
 * @returns Object with keyboard event handler and submit function
 *
 * @example
 * Usage with React Hook Form and onSubmit prop:
 * ```tsx
 * const handleFormSubmit = form.handleSubmit(handleSearch);
 * const { handleKeyPress } = useEnterKeySubmit(handleFormSubmit);
 *
 * // Use in Form component
 * <Form form={form} schema={schema} onSubmit={handleFormSubmit} onKeyPress={handleKeyPress}>
 * ```
 *
 * @example
 * Usage with direct function call (like OperationPricing):
 * ```tsx
 * const { handleKeyPress } = useEnterKeySubmit(handleSearch);
 *
 * // Use in Form component
 * <Form form={form} schema={schema} onKeyPress={handleKeyPress}>
 *   <Button onClick={handleSearch}>Uygula</Button>
 * </Form>
 * ```
 */
export const useEnterKeySubmit = (submitHandler: () => void) => {
  const handleKeyPress = createEnterKeyHandler(submitHandler);
  return {
    handleKeyPress,
    handleSubmit: submitHandler,
  };
};
