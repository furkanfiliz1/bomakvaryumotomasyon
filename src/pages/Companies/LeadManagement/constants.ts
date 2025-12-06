/**
 * Lead Management Constants
 * Following OperationPricing pattern for enums and constants
 * Enum values from Swagger API specification
 */

// Membership Status (as boolean values for API)
export const MembershipStatus = {
  COMPLETED: true,
  NOT_COMPLETED: false,
} as const;

export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];

export const getMembershipStatusOptions = () => [
  { id: true, name: 'Tamamlandı' },
  { id: false, name: 'Tamamlanmadı' },
];

// Lead Search Result Status (LeadCallResultStatus from API)
// GET /types?EnumName=LeadCallResultStatus returns these values
export enum CallResult {
  POSITIVE = 'Positive',
  UNREACHABLE = 'Unreachable',
  FOLLOW_UP = 'FollowUpContinues',
  ARCHIVE = 'Archive',
  JUNK_DATA = 'TrashData',
  PERSONAL_APPLICATION = 'PersonalApplication',
  NEGATIVE = 'Negative',
  ROUTINE_CALL = 'RoutineCall',
  REQUEST_RECEIVED = 'RequestReceived',
  NO_CONTACT_INFO = 'NoContactInfo',
  PROCESSED = 'ActionTaken',
}

// Lead Status Types (SalesScenario from API)
// GET /types?EnumName=LeadStatusTypes returns these values
export enum SalesScenario {
  POTENTIAL_UNDECIDED = 'PotentialUndecided',
  POTENTIAL_NEWLY_ESTABLISHED = 'PotentialNewlyEstablished',
  POTENTIAL_NO_LONGER_INTERESTED = 'PotentialNoLongerInterested',
  POTENTIAL_WILL_JOIN_LATER = 'PotentialWillJoinLater',
  POTENTIAL_PROBLEM_KKB = 'PotentialProblemKKB',
  SUPPLIER_FINANCE_CUSTOMER = 'SupplierFinanceCustomer',
  POSITIVE_FKF_DIRECTED_TO_SALE = 'PositiveFKFDirectedToSale',
}

// Lead Sales Scenario (LeadSalesScenario from API)
export enum LeadSalesScenarioEnum {
  DEFINITELY_SELLABLE = 1,
  HIGH_PROBABILITY_SELLABLE = 2,
  LOW_PROBABILITY_SELLABLE = 3,
  NOT_SELLABLE = 4,
}
