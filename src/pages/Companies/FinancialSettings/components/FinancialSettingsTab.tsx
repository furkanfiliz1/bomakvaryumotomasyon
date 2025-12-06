import { useErrorListener } from '@hooks';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNotice } from 'src/components/common/NoticeModal/NoticeService';
import { useGetFinancialSettingsQuery, useUpdateFinancialSettingsMutation } from '../../companies.api';
import {
  FinancerDetailModel,
  FinancerRatioAFModel,
  FinancerRatioModel,
  FinancerRatioRCModel,
  FinancerRatioSpotModel,
  FinancerRatioSpotWithoutInvoiceModel,
  FinancerRatioTFSModel,
  FinancerRatioTTKModel,
  FinancialSettingsSaveRequest,
  FinancialSettingsSection,
} from '../financial-settings.types';
import FinancialSettingsSidebar from './FinancialSettingsSidebar';
import ChequeFinanceSettings from './sections/ChequeFinanceSettings';
import CommercialLoanSettings from './sections/CommercialLoanSettings';
import FinanceCompanyFeatures from './sections/FinanceCompanyFeatures';
import InvoiceFinanceSettings from './sections/InvoiceFinanceSettings';
import ReceiverFinanceSettings from './sections/ReceiverFinanceSettings';
import RotativeCreditSettings from './sections/RotativeCreditSettings';
import SpotLoanSettings from './sections/SpotLoanSettings';
import SpotLoanWithoutInvoiceSettings from './sections/SpotLoanWithoutInvoiceSettings';
import SupplierFinanceSettings from './sections/SupplierFinanceSettings';

interface FinancialSettingsTabProps {
  companyId: number;
}

const FinancialSettingsTab: React.FC<FinancialSettingsTabProps> = ({ companyId }) => {
  const [activeSection, setActiveSection] = useState<FinancialSettingsSection>('finance-company-features');

  // API hooks
  const {
    data: financialSettings,
    error,
    isLoading,
  } = useGetFinancialSettingsQuery(
    { companyId },
    {
      skip: !companyId,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [updateFinancialSettings, { isLoading: isSaving, error: saveError, isSuccess }] =
    useUpdateFinancialSettingsMutation();

  useErrorListener([error, saveError]);
  const notice = useNotice();

  // State for all settings sections
  const [financerDetail, setFinancerDetail] = useState<Partial<FinancerDetailModel>>({});
  const [financerRatio, setFinancerRatio] = useState<Partial<FinancerRatioModel>>({});
  const [financerRatioBill, setFinancerRatioBill] = useState<Partial<FinancerRatioModel>>({});
  const [financerRatioTFS, setFinancerRatioTFS] = useState<Partial<FinancerRatioTFSModel>>({});
  const [financerRatioSpot, setFinancerRatioSpot] = useState<Partial<FinancerRatioSpotModel>>({});
  const [financerRatioSpotWithoutInvoice, setFinancerRatioSpotWithoutInvoice] = useState<
    Partial<FinancerRatioSpotWithoutInvoiceModel>
  >({});
  const [financerRatioAF, setFinancerRatioAF] = useState<Partial<FinancerRatioAFModel>>({});
  const [financerRatioTTK, setFinancerRatioTTK] = useState<Partial<FinancerRatioTTKModel>>({});
  const [financerRatioRC, setFinancerRatioRC] = useState<Partial<FinancerRatioRCModel>>({});

  // Currency lists state
  const [currencyTFS, setCurrencyTFS] = useState<number[]>([]);
  const [currencyFF, setCurrencyFF] = useState<number[]>([]);
  const [currencyBill, setCurrencyBill] = useState<number[]>([]);
  const [currencySpot, setCurrencySpot] = useState<number[]>([]);
  const [currencySpotWithoutInvoice, setCurrencySpotWithoutInvoice] = useState<number[]>([]);
  const [currencyAF, setCurrencyAF] = useState<number[]>([]);
  const [currencyTTK, setCurrencyTTK] = useState<number[]>([]);
  const [currencyRC, setCurrencyRC] = useState<number[]>([]);

  // Initialize state from API response
  useEffect(() => {
    if (financialSettings) {
      setFinancerDetail(financialSettings.FinancerDetailResponseModel || {});

      // Get all ratio details from FinancerRatioModel
      const allRatioDetails = financialSettings.FinancerRatioModel?.FinancerRatioInfoDetails || [];

      // Filter ratios by ProductType
      // ProductType: 3 = Invoice Finance (FF), 4 = Cheque Finance (Bill), 6 = Spot Loan, 8 = Spot Without Invoice, 9 = Rotative Credit, 11 = Commercial Loan
      const invoiceFinanceRatios = allRatioDetails.filter((r) => r.ProductType === 3);
      const chequeFinanceRatios = allRatioDetails.filter((r) => r.ProductType === 4);
      const spotLoanRatios = allRatioDetails.filter((r) => r.ProductType === 6);
      const spotWithoutInvoiceRatios = allRatioDetails.filter((r) => r.ProductType === 8);
      const rotativeCreditRatios = allRatioDetails.filter((r) => r.ProductType === 9);
      const commercialLoanRatios = allRatioDetails.filter((r) => r.ProductType === 11);

      setFinancerRatio({
        ...financialSettings.FinancerRatioModel,
        FinancerRatioInfoDetails: invoiceFinanceRatios,
      });

      setFinancerRatioBill({
        ...financialSettings.FinancerRatioModel,
        FinancerRatioInfoDetails: chequeFinanceRatios,
      });

      setFinancerRatioTFS(financialSettings.FinancerRatioTFSModel || {});

      setFinancerRatioSpot({
        ...financialSettings.FinancerRatioSpotModel,
        FinancerRatioInfoDetails: spotLoanRatios,
      });

      setFinancerRatioSpotWithoutInvoice({
        ...financialSettings.FinancerRatioSpotWithoutInvoiceModel,
        FinancerRatioInfoDetails: spotWithoutInvoiceRatios,
      });

      setFinancerRatioAF(financialSettings.FinancerRatioAFModel || {});
      setFinancerRatioTTK({
        ...financialSettings.FinancerRatioTTKModel,
        FinancerRatioInfoDetails: commercialLoanRatios,
      });
      setFinancerRatioRC({
        ...financialSettings.FinancerRatioRCModel,
        FinancerRatioInfoDetails: rotativeCreditRatios,
      });

      setCurrencyTFS(financialSettings.FinancerRatioTFSCurrencyModel?.CurrencyList || []);
      setCurrencyFF(financialSettings.FinancerRatioFFCurrencyModel?.CurrencyList || []);
      setCurrencyBill(financialSettings.FinancerRatioBillCurrencyModel?.CurrencyList || []);
      setCurrencySpot(financialSettings.FinancerRatioSpotCurrencyModel?.CurrencyList || []);
      setCurrencySpotWithoutInvoice(financialSettings.FinancerRatioSpotWithoutInvoiceCurrencyModel?.CurrencyList || []);
      setCurrencyAF(financialSettings.FinancerRatioAFCurrencyModel?.CurrencyList || []);
      setCurrencyTTK(financialSettings.FinancerRatioTTKCurrencyModel?.CurrencyList || []);
      setCurrencyRC(financialSettings.FinancerRatioRCCurrencyModel?.CurrencyList || []);
    }
  }, [financialSettings]);

  const handleSave = async () => {
    try {
      // Combine all ratios from different sections into one array
      const allRatios = [
        ...(financerRatio.FinancerRatioInfoDetails || []), // Invoice Finance (ProductType: 3)
        ...(financerRatioBill.FinancerRatioInfoDetails || []), // Cheque Finance (ProductType: 4)
        ...(financerRatioSpot.FinancerRatioInfoDetails || []), // Spot Loan (ProductType: 6)
        ...(financerRatioSpotWithoutInvoice.FinancerRatioInfoDetails || []), // Spot Without Invoice (ProductType: 8)
        ...(financerRatioTTK.FinancerRatioInfoDetails || []), // Commercial Loan (ProductType: 11)
        ...(financerRatioRC.FinancerRatioInfoDetails || []), // Rotative Credit (ProductType: 9)
      ];

      const saveRequest: FinancialSettingsSaveRequest = {
        FinancerDetailModel: {
          ...financerDetail,
          ProductTypes: financerDetail.ProductTypes || [],
        },
        FinancerRatioModel: {
          ...financerRatio,
          FinancerRatioInfoDetails: allRatios,
        },
        FinancerRatioTFSModel: financerRatioTFS,
        FinancerRatioSpotModel: {
          InvoiceTypes: financerRatioSpot.InvoiceTypes || [],
          IsAutoReturned: financerRatioSpot.IsAutoReturned || false,
          IsManuelCharged: financerRatioSpot.IsManuelCharged || false,
          MarginRatio: financerRatioSpot.MarginRatio,
          MinInvoiceDay: financerRatioSpot.MinInvoiceDay,
          MaxInvoiceDueDayForSpotLoan: financerRatioSpot.MaxInvoiceDueDayForSpotLoan,
          MaxInvoiceDayForSpotLoan: financerRatioSpot.MaxInvoiceDayForSpotLoan,
        },
        FinancerRatioSpotWithoutInvoiceModel: {
          IsAutoReturned: financerRatioSpotWithoutInvoice.IsAutoReturned || false,
          IsManuelCharged: financerRatioSpotWithoutInvoice.IsManuelCharged || false,
          MaxInvoiceDueDayForSpotLoanWithoutInvoice:
            financerRatioSpotWithoutInvoice.MaxInvoiceDueDayForSpotLoanWithoutInvoice,
        },
        FinancerRatioAFModel: financerRatioAF,
        FinancerRatioTTKModel: financerRatioTTK,
        FinancerRatioRCModel: {
          ...financerRatioRC,
          FinancerRatioInfoDetails: financerRatioRC.FinancerRatioInfoDetails || [],
        },
        FinancerRatioTFSCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencyTFS,
          productType: 2,
        },
        FinancerRatioSpotCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencySpot,
          productType: 6,
        },
        FinancerRatioSpotWithoutInvoiceCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencySpotWithoutInvoice,
          productType: 8,
        },
        FinancerRatioFFCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencyFF,
          productType: 3,
        },
        FinancerRatioBillCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencyBill,
          productType: 4,
        },
        FinancerRatioAFCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencyAF,
          productType: 7,
        },
        FinancerRatioRCCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencyRC,
          productType: 9,
        },
        FinancerRatioTTKCurrencyModel: {
          companyId: companyId.toString(),
          currencyList: currencyTTK,
          productType: 11,
        },
      };

      await updateFinancialSettings({
        companyId,
        data: saveRequest,
      }).unwrap();
    } catch (err) {
      console.error('Finansal ayarlar kaydedilirken hata oluştu:', err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        message: 'Finansal ayarlar başarıyla kaydedildi.',
      });
    }
  }, [isSuccess, notice]);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'finance-company-features':
        return <FinanceCompanyFeatures financerDetail={financerDetail} setFinancerDetail={setFinancerDetail} />;
      case 'invoice-finance-settings':
        return (
          <InvoiceFinanceSettings
            financerRatio={financerRatio}
            setFinancerRatio={setFinancerRatio}
            currencyFF={currencyFF}
            setCurrencyFF={setCurrencyFF}
          />
        );
      case 'cheque-finance-settings':
        return (
          <ChequeFinanceSettings
            financerRatio={financerRatioBill}
            setFinancerRatio={setFinancerRatioBill}
            currencyBill={currencyBill}
            setCurrencyBill={setCurrencyBill}
          />
        );
      case 'supplier-finance-settings':
        return (
          <SupplierFinanceSettings
            financerRatioTFS={financerRatioTFS}
            setFinancerRatioTFS={setFinancerRatioTFS}
            currencyTFS={currencyTFS}
            setCurrencyTFS={setCurrencyTFS}
          />
        );
      case 'spot-loan-settings':
        return (
          <SpotLoanSettings
            financerRatioSpot={financerRatioSpot}
            setFinancerRatioSpot={setFinancerRatioSpot}
            currencySpot={currencySpot}
            setCurrencySpot={setCurrencySpot}
          />
        );
      case 'spot-loan-without-invoice-settings':
        return (
          <SpotLoanWithoutInvoiceSettings
            financerRatioSpotWithoutInvoice={financerRatioSpotWithoutInvoice}
            setFinancerRatioSpotWithoutInvoice={setFinancerRatioSpotWithoutInvoice}
            currencySpotWithoutInvoice={currencySpotWithoutInvoice}
            setCurrencySpotWithoutInvoice={setCurrencySpotWithoutInvoice}
          />
        );
      case 'receiver-finance-settings':
        return (
          <ReceiverFinanceSettings
            financerRatioAF={financerRatioAF}
            setFinancerRatioAF={setFinancerRatioAF}
            currencyAF={currencyAF}
            setCurrencyAF={setCurrencyAF}
          />
        );
      case 'commercial-loan-settings':
        return (
          <CommercialLoanSettings
            financerRatioTTK={financerRatioTTK}
            setFinancerRatioTTK={setFinancerRatioTTK}
            currencyTTK={currencyTTK}
            setCurrencyTTK={setCurrencyTTK}
          />
        );
      case 'rotative-credit-settings':
        return (
          <RotativeCreditSettings
            financerRatioRC={financerRatioRC}
            setFinancerRatioRC={setFinancerRatioRC}
            currencyRC={currencyRC}
            setCurrencyRC={setCurrencyRC}
          />
        );
      default:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Bölüm Seçiniz
            </Typography>
            <Typography>Lütfen sol menüden bir bölüm seçiniz.</Typography>
          </Box>
        );
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FinancialSettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 1, height: '100%' }}>{renderSectionContent()}</Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Box>
    </>
  );
};

export default FinancialSettingsTab;
