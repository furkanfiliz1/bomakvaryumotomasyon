# Purchases Collection - Example Document

## Firestore Document Structure

```json
{
  "supplierId": "supplier_abc123",
  
  "date": {
    "_seconds": 1733673600,
    "_nanoseconds": 0
  },
  "monthKey": "2024-12",
  "year": 2024,
  
  "items": [
    {
      "fishTypeId": "fish_001",
      "qty": 50,
      "unitPrice": 12.50,
      "lineTotal": 625.00,
      "note": "Neon tetra - orta boy"
    },
    {
      "fishTypeId": "fish_002",
      "qty": 30,
      "unitPrice": 25.00,
      "lineTotal": 750.00
    },
    {
      "fishTypeId": "fish_003",
      "qty": 20,
      "unitPrice": 45.00,
      "lineTotal": 900.00,
      "note": "Diskus balığı - premium"
    }
  ],
  
  "grossTotal": 2275.00,
  "discountAmount": 100.00,
  "netTotal": 2175.00,
  
  "shippingCost": 75.00,
  "totalCostWithShipping": 2250.00,
  
  "notes": "Aralık ayı stoklama - tedarikçi %5 indirim yaptı",
  
  "createdAt": {
    "_seconds": 1733673700,
    "_nanoseconds": 0
  },
  "createdBy": "user_xyz789"
}
```

## Field Descriptions

- **supplierId**: Optional reference to supplier
- **date**: Purchase date as Firestore Timestamp
- **monthKey**: Format "YYYY-MM" for monthly filtering
- **year**: Numeric year for annual reports
- **items**: Array of purchased fish items
  - **fishTypeId**: Reference to fishTypes collection
  - **qty**: Quantity purchased
  - **unitPrice**: Cost per fish in Turkish Lira
  - **lineTotal**: qty × unitPrice
  - **note**: Optional item-specific notes
- **grossTotal**: Sum of all lineTotal values
- **discountAmount**: Discount applied in TL
- **netTotal**: grossTotal - discountAmount
- **shippingCost**: Optional shipping/cargo cost
- **totalCostWithShipping**: netTotal + shippingCost (or 0)
- **notes**: Optional general notes about the purchase
- **createdAt**: Server timestamp when created
- **createdBy**: Optional user ID who created the record
