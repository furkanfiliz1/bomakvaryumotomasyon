/**
 * Financial Analysis Table Component
 * Displays financial accounts data in table format following legacy ScoreCompanyScore pattern
 */

import { Alert, Box, Typography } from '@mui/material';
import React from 'react';

import type { FinancialAnalysisTableProps } from '../company-score-tab.types';

interface PreparedAccount {
  Name: string;
  Code: string;
  Type: string;
  PeriodYear: number;
  Amount: number;
}

interface YearlySum {
  Type: string;
  Sum: Array<{ PeriodYear: number; Amount: number }>;
}

export const FinancialAnalysisTable: React.FC<FinancialAnalysisTableProps> = ({ financialAnalysisData, loading }) => {
  // Show no data state
  if (!loading && (!financialAnalysisData || financialAnalysisData.length === 0)) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Finansal analiz verileri bulunamadı.
      </Alert>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ mb: 3, p: 3, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Bilanço Tablosu (1000 TL)
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Yükleniyor...</Typography>
        </Box>
      </Box>
    );
  }

  // Legacy getScore function logic - get last 3 years
  const sortedData = financialAnalysisData ? [...financialAnalysisData].sort((a, b) => a.Year - b.Year) : [];
  let periodYears = sortedData.map((item) => item.Year);
  const sortedYears = [...periodYears].sort((a, b) => a - b);
  periodYears = sortedYears.slice(-3); // Legacy: periodYears.sort().slice(-3)

  // Legacy getType function
  const getType = (code: number): string => {
    if (code > 0 && code < 3) return 'A';
    if (code > 2 && code < 6) return 'P';
    if (code === 6) return 'G'; // Only code 6 for income statement, exclude 7
    return '';
  };

  // Legacy prepareBalanceSheet function logic
  const balanceSheet: PreparedAccount[][] = [];
  const yearlySums: YearlySum[] = [
    { Type: 'A', Sum: [] },
    { Type: 'P', Sum: [] },
    { Type: 'G', Sum: [] },
  ];

  // Get all unique account codes from the data (exclude Code 7)
  const allAccountCodes = new Set<string>();
  sortedData.forEach((yearData) => {
    (yearData.Accounts || []).forEach((account) => {
      if (account.Code && account.Name && account.Name.trim() !== '' && !account.Code.startsWith('7')) {
        allAccountCodes.add(account.Code);
      }
    });
  });

  // Process each account code (legacy beyannameTemp.forEach logic)
  const sortedAccountCodes = Array.from(allAccountCodes).sort((a, b) => a.localeCompare(b));
  sortedAccountCodes.forEach((accountCode) => {
    // Legacy merged logic: get accounts for this code from all years
    const merged = sortedData
      .map((d) => d.Accounts || [])
      .map((ac) => ac.filter((acc) => acc.Code === accountCode))
      .flat();

    if (merged.length > 0) {
      const values: PreparedAccount[] = periodYears.map((year) => {
        const yearData = sortedData.find((sd) => sd.Year === year);
        const accountInYear = yearData?.Accounts?.find((acc) => acc.Code === accountCode);

        const v: PreparedAccount = {
          Name: merged[0].Name || '',
          Code: accountCode,
          Type: getType(parseInt(accountCode.substring(0, 1), 10)),
          PeriodYear: year,
          Amount: accountInYear?.Amount ? accountInYear.Amount / 1000 : 0,
        };

        // Legacy yearlySums calculation for single digit codes
        if (accountCode.length === 1) {
          const index = yearlySums.findIndex((y) => y.Type === v.Type);
          if (index >= 0) {
            const yearIndex = yearlySums[index].Sum.findIndex((y) => y.PeriodYear === year);
            if (yearIndex >= 0) {
              yearlySums[index].Sum[yearIndex].Amount += v.Amount;
            } else {
              yearlySums[index].Sum.push({
                PeriodYear: year,
                Amount: v.Amount,
              });
            }
          }
        }

        return v;
      });
      balanceSheet.push(values);
    }
  });

  // Format amount function
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Helper to calculate percentage
  const calculatePercentage = (amount: number, year: number): string => {
    const amountInThousands = amount / 1000;
    const totalActiveAmount =
      yearlySums.find((type) => type.Type === 'A')?.Sum.find((sum) => sum.PeriodYear === year)?.Amount || 0;
    const percentage = totalActiveAmount !== 0 ? ((amountInThousands / totalActiveAmount) * 100).toFixed(2) : '0.00';
    return `${percentage}%`;
  };

  // Legacy ScoreCompanyScoreBalanceSheet render logic
  const renderBalanceSheetAccounts = (type: string, withPercentage = true) => {
    return balanceSheet
      .map((accountGroup, index) => {
        const account = accountGroup[0];
        if (account.Type === type) {
          const isMainCategory = account.Code.length === 1 && account.Code !== '6';
          const isSubCategory = account.Code.length > 1;

          if (isMainCategory) {
            // Legacy: category row with thead-light class
            return (
              <Box component="tr" key={`${account.Code}-${index}`} className="category-row">
                <Box component="td">
                  <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {account.Code}. {account.Name.substring(0, 25)}
                  </Typography>
                </Box>
                {accountGroup.map((d) => (
                  <Box key={d.PeriodYear} component="td">
                    <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>
                      {formatAmount(d.Amount)}
                      {withPercentage && (
                        <Box component="span" sx={{ display: 'block', fontSize: '9px', color: '#6c757d' }}>
                          {calculatePercentage(d.Amount * 1000, d.PeriodYear)}
                        </Box>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          }

          if (isSubCategory) {
            // Legacy: regular account row with sub-cat class for 3+ digit codes
            const className = account.Code.length >= 3 ? 'sub-cat' : '';
            return (
              <Box component="tr" key={`${account.Code}-${index}`} className={className}>
                <Box component="td">
                  <Typography variant="body2" sx={{ fontSize: '12px', paddingLeft: '20px' }}>
                    {account.Code} - {account.Name.substring(0, 25)}
                  </Typography>
                </Box>
                {accountGroup.map((d) => (
                  <Box key={d.PeriodYear} component="td">
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                      {formatAmount(d.Amount)}
                      {withPercentage && (
                        <Box component="span" sx={{ display: 'block', fontSize: '9px', color: '#6c757d' }}>
                          {calculatePercentage(d.Amount * 1000, d.PeriodYear)}
                        </Box>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          }
        }
        return null;
      })
      .filter(Boolean);
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '12px',
    '& th, & td': {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left' as const,
      verticalAlign: 'top' as const,
    },
    '& th': {
      backgroundColor: '#f8f9fa',
      fontWeight: 'bold',
      textAlign: 'left' as const,
    },
    '& .main-category': {
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'left' as const,
    },
    '& .main-total': {
      backgroundColor: '#f8f9fa',
      fontWeight: 'bold',
      textAlign: 'left' as const,
    },
    '& .category-row': {
      backgroundColor: '#e9ecef',
      fontWeight: 'bold',
    },
    '& .thead-light': {
      backgroundColor: '#e9ecef',
      fontWeight: 'bold',
    },
  };
  return (
    <React.Fragment>
      <Box sx={{ mb: 3, p: 3, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Bilanço Tablosu (1000 TL)
        </Typography>

        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* AKTIF Table - Left Side - Legacy renderBalanceSheet logic */}
          <Box sx={{ flex: 1 }}>
            <Box component="table" sx={tableStyle}>
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" className="main-category">
                    AKTİF
                  </Box>
                  {periodYears.map((year) => (
                    <Box key={year} component="th" className="main-total">
                      <div>{year}</div>
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>
                        {formatAmount(
                          yearlySums.find((type) => type.Type === 'A')?.Sum.find((sum) => sum.PeriodYear === year)
                            ?.Amount || 0,
                        )}
                      </div>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">{renderBalanceSheetAccounts('A', true)}</Box>
              <Box component="thead" className="thead-light">
                <Box component="tr">
                  <Box component="th">TOPLAM AKTİF</Box>
                  {periodYears.map((year) => (
                    <Box key={year} component="th">
                      <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {formatAmount(
                          yearlySums.find((type) => type.Type === 'A')?.Sum.find((sum) => sum.PeriodYear === year)
                            ?.Amount || 0,
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* PASİF Table - Right Side - Legacy renderBalanceSheet logic */}
          <Box sx={{ flex: 1 }}>
            <Box component="table" sx={tableStyle}>
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" className="main-category">
                    PASİF
                  </Box>
                  {periodYears.map((year) => (
                    <Box key={year} component="th" className="main-total">
                      <div>{year}</div>
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>
                        {formatAmount(
                          yearlySums.find((type) => type.Type === 'P')?.Sum.find((sum) => sum.PeriodYear === year)
                            ?.Amount || 0,
                        )}
                      </div>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">{renderBalanceSheetAccounts('P', true)}</Box>
              <Box component="thead" className="thead-light">
                <Box component="tr">
                  <Box component="th">TOPLAM PASİF</Box>
                  {periodYears.map((year) => (
                    <Box key={year} component="th">
                      <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {formatAmount(
                          yearlySums.find((type) => type.Type === 'P')?.Sum.find((sum) => sum.PeriodYear === year)
                            ?.Amount || 0,
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Gelir Tablosu - Income Statement - Legacy logic */}
      <Box sx={{ mb: 3, p: 3, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Gelir Tablosu
        </Typography>

        <Box component="table" sx={tableStyle}>
          <Box component="thead" className="thead-dark">
            <Box component="tr">
              <Box component="th" className="main-category">
                GELİR TABLOSU
              </Box>
              {periodYears.map((year) => (
                <Box key={year} component="th" className="main-category">
                  {year}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">{renderBalanceSheetAccounts('G', false)}</Box>

          {/* Net Satışlar - Legacy: Code 60 + Code 61 */}
          <Box component="thead" className="thead-light">
            <Box component="tr">
              <Box component="th">Net Satışlar</Box>
              {periodYears.map((year) => (
                <Box key={year} component="th">
                  <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {(() => {
                      const code60 = balanceSheet
                        .flat()
                        .find((b) => b.Type === 'G' && b.Code === '60' && b.PeriodYear === year);
                      const code61 = balanceSheet
                        .flat()
                        .find((b) => b.Type === 'G' && b.Code === '61' && b.PeriodYear === year);
                      const total = (code60?.Amount || 0) + (code61?.Amount || 0);
                      return formatAmount(total);
                    })()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Satış Maliyeti - Legacy: Code 62 */}
          <Box component="thead" className="thead-light">
            <Box component="tr">
              <Box component="th">Satış Maliyeti</Box>
              {periodYears.map((year) => (
                <Box key={year} component="th">
                  <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {(() => {
                      const code62 = balanceSheet
                        .flat()
                        .find((b) => b.Type === 'G' && b.Code === '62' && b.PeriodYear === year);
                      return formatAmount(code62?.Amount || 0);
                    })()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};
