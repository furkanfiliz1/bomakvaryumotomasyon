# useFilterFormWithUrlSync Hook

Generic hook for filter forms with automatic URL synchronization. Handles both regular fields and async autocomplete fields with ease.

## Features

- ✅ Automatic URL parameter synchronization
- ✅ Async autocomplete field support
- ✅ Type-safe with TypeScript generics
- ✅ Prevents unnecessary re-renders
- ✅ Easy to integrate with existing forms

## Usage

### Basic Example

```typescript
import { useFilterFormWithUrlSync } from '@hooks';

const MyFilterComponent = () => {
  const [filters, setFilters] = useState({});

  const form = useForm<MyFormData>({
    defaultValues: { name: '', email: '' }
  });

  const transformToApiFilters = (formData: MyFormData): MyApiFilters => ({
    name: formData.name,
    email: formData.email,
  });

  const { handleApply, handleReset } = useFilterFormWithUrlSync({
    form,
    onFilterChange: setFilters,
    transformToApiFilters,
  });

  return (
    <form>
      {/* form fields */}
      <button onClick={handleApply}>Apply</button>
      <button onClick={() => handleReset({})}>Reset</button>
    </form>
  );
};
```

### With Async Autocomplete Fields

```typescript
const MyFilterComponent = () => {
  const {
    buyersSearchResults,
    searchBuyers,
    sellersSearchResults,
    searchSellers,
  } = useDropdownData();

  const form = useForm<MyFormData>({
    defaultValues: {
      buyerIdentifier: undefined,
      sellerIdentifier: undefined,
      status: '',
    }
  });

  const transformToApiFilters = (formData: MyFormData): MyApiFilters => {
    const getIdentifier = (value: any) => {
      if (typeof value === 'object' && value?.Identifier) {
        return value.Identifier;
      }
      return value || '';
    };

    return {
      buyerIdentifier: getIdentifier(formData.buyerIdentifier),
      sellerIdentifier: getIdentifier(formData.sellerIdentifier),
      status: formData.status,
    };
  };

  const { handleApply, handleReset } = useFilterFormWithUrlSync({
    form,
    onFilterChange: setFilters,
    transformToApiFilters,
    asyncFields: {
      buyerIdentifier: {
        searchFn: searchBuyers,
        results: buyersSearchResults,
        matchField: 'Identifier',
      },
      sellerIdentifier: {
        searchFn: searchSellers,
        results: sellersSearchResults,
        matchField: 'Identifier',
      },
    },
  });

  return (
    <Form form={form} schema={schema}>
      <button onClick={handleApply}>Search</button>
      <button onClick={() => handleReset({ status: '' })}>Reset</button>
    </Form>
  );
};
```

## Real World Example

See `pages/Pricing/OperationCharge/hooks/useOperationChargeFilters.ts` for a complete implementation with:

- Multiple async autocomplete fields
- Regular select/input fields
- Custom transformation logic
- URL parameter management

## API

### Parameters

| Parameter               | Type                                   | Description                           |
| ----------------------- | -------------------------------------- | ------------------------------------- |
| `form`                  | `UseFormReturn<TFormData>`             | React Hook Form instance              |
| `onFilterChange`        | `(filters: TApiFilters) => void`       | Callback when filters change          |
| `transformToApiFilters` | `(formData: TFormData) => TApiFilters` | Transform form data to API format     |
| `asyncFields`           | `Record<string, AsyncFieldConfig>`     | Configuration for async fields        |
| `updateUrlParams`       | `boolean`                              | Whether to update URL (default: true) |

### Returns

| Property       | Type                      | Description                  |
| -------------- | ------------------------- | ---------------------------- |
| `handleApply`  | `() => TApiFilters`       | Apply filters and update URL |
| `handleReset`  | `(defaultValues) => void` | Reset form and clear URL     |
| `searchParams` | `URLSearchParams`         | Current URL search params    |

## Benefits Over Manual Implementation

### Before (Manual):

- 150+ lines of complex useEffect logic
- Manual URL parameter management
- Race conditions with async data
- Difficult to maintain and reuse

### After (With Hook):

- ~30 lines of clean configuration
- Automatic URL synchronization
- Built-in async data handling
- Reusable across all filter forms

## Migration Guide

To migrate existing filter hooks:

1. Remove manual `useEffect` for URL sync
2. Remove `prevFiltersRef` and `userInteractedRef`
3. Remove manual `searchParams` management
4. Configure `asyncFields` for autocomplete fields
5. Use returned `handleApply` and `handleReset`

See the OperationCharge implementation for a complete migration example.
