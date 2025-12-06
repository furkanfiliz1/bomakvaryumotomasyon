/**
 * Opportunity Table Configuration Helpers
 * Following LeadManagement pattern for table configuration
 *
 * Task requirements for column order:
 * Konu, Oluşturulma Tarihi, Durum Açıklaması, İlgilendiği Ürün, Alıcı, Müşteri Temsilcisi,
 * Statü, Kapanış Tarihi, Satış Senaryosu, Tahmini Kapanış Tarihi, Son Toplantı Tarihi,
 * Tahmini Limit, Tahmini Aylık İşlem Hacmi, Tedarikçi Sayısı, Take Rate, Tahmini Aylık Gelir, Açıklama
 */

import { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers for Opportunity List
 * Using BE field names (PascalCase) directly
 */
export function getOpportunityTableHeaders(): HeadCell[] {
  return [
    {
      id: 'Subject',
      label: 'Konu',
      width: 200,
    },
    {
      id: 'CreatedAt',
      label: 'Oluşturulma Tarihi',
      width: 140,
      type: 'date',
    },
    {
      id: 'StatusDescriptionText',
      label: 'Durum Açıklaması',
      width: 160,
      slot: true, // Custom rendering with chip
    },
    {
      id: 'ProductTypeName',
      label: 'İlgilendiği Ürün',
      width: 150,
    },
    {
      id: 'ReceiverName',
      label: 'Alıcı',
      width: 180,
      slot: true, // Custom rendering to handle receiverId lookup
    },
    {
      id: 'CustomerManagerName',
      label: 'Müşteri Temsilcisi',
      width: 150,
    },
    {
      id: 'WinningStatusDescription',
      label: 'Statü',
      width: 120,
      slot: true, // Custom rendering with chip
    },
    {
      id: 'ClosedDate',
      label: 'Kapanış Tarihi',
      width: 140,
      type: 'date',
    },
    {
      id: 'SalesScenarioDescription',
      label: 'Satış Senaryosu',
      width: 160,
      slot: true, // Custom rendering with chip
    },
    {
      id: 'EstimatedClosingDate',
      label: 'Tahmini Kapanış Tarihi',
      width: 160,
      type: 'date',
    },
    {
      id: 'LastMeetingDate',
      label: 'Son Toplantı Tarihi',
      width: 160,
      type: 'date',
    },
    {
      id: 'EstimatedLimit',
      label: 'Tahmini Limit',
      width: 140,
      type: 'currency',
    },
    {
      id: 'EstimatedMonthlyVolume',
      label: 'Tahmini Aylık İşlem Hacmi',
      width: 180,
      type: 'currency',
    },
    {
      id: 'SupplierCount',
      label: 'Tedarikçi Sayısı',
      width: 130,
    },
    {
      id: 'TakeRate',
      label: 'Take Rate (%)',
      width: 120,
    },
    {
      id: 'EstimatedMonthlyRevenue',
      label: 'Tahmini Aylık Gelir',
      width: 160,
      type: 'currency',
    },
    {
      id: 'Description',
      label: 'Açıklama',
      width: 200,
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 180,
      slot: true, // Custom rendering with buttons
    },
  ];
}
