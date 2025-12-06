/**
 * Enum mappings for FigoScore Pro forms
 * Maps backend data to display names using API responses
 */

// Common enum mapping type for API responses
type EnumOption = { Description: string; Value: string };

// City mapping using backend API data
export const getCityName = (cityId?: string | number, cities: Array<{ Id: number; Name: string }> = []): string => {
  if (!cityId) return 'Veri bekleniyor...';

  const cityInfo = cities.find((city) => city.Id === Number(cityId));
  return cityInfo ? cityInfo.Name : cityId.toString();
};

// Corporation Type mapping using backend enum data
export const getCorporationTypeName = (typeId?: string | number, corporationTypes: EnumOption[] = []): string => {
  if (!typeId) return 'Veri bekleniyor...';

  const corporationType = corporationTypes.find((type) => type.Value === typeId.toString());
  return corporationType ? corporationType.Description : typeId.toString();
};

// Facility Property Status mapping using backend enum data
export const getFacilityPropertyStatusName = (
  statusId?: string | number,
  facilityPropertyStatuses: EnumOption[] = [],
): string => {
  if (!statusId) return 'Veri bekleniyor...';

  const status = facilityPropertyStatuses.find((status) => status.Value === statusId.toString());
  return status ? status.Description : statusId.toString();
};

// Facility Type mapping using backend enum data
export const getFacilityTypeName = (typeId?: string | number, facilityTypes: EnumOption[] = []): string => {
  if (!typeId) return 'Veri bekleniyor...';

  const facilityType = facilityTypes.find((type) => type.Value === typeId.toString());
  return facilityType ? facilityType.Description : typeId.toString();
};

// Payment Method mapping using backend enum data
export const getPaymentMethodName = (methodId?: string | number, paymentMethods: EnumOption[] = []): string => {
  if (!methodId) return 'Veri bekleniyor...';

  const paymentMethod = paymentMethods.find((method) => method.Value === methodId.toString());
  return paymentMethod ? paymentMethod.Description : methodId.toString();
};

// Country mapping using backend enum data
export const getCountryName = (countryId?: string | number, countries: EnumOption[] = []): string => {
  if (!countryId) return 'Veri bekleniyor...';

  const country = countries.find((c) => c.Value === countryId.toString());
  return country ? country.Description : countryId.toString();
};
