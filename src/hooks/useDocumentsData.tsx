import {
  DocumentResponseModel,
  GetDocumentsApiArg,
  useDeleteDocumentsByIdMutation,
  useGetDocumentsQuery,
  useLazyGetDocumentsByIdFileQuery,
  useLazyGetDocumentsByIdViewQuery,
} from '@store';
import useErrorListener from './useErrorListener';
import { DocumentLabelID } from '@types';

import checkType, { bufferToBase64 } from '@helpers';
import FileSaver from 'file-saver';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';

import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { isEqual } from 'lodash';
import { useNotice } from '@components';
dayjs.extend(quarterOfYear);

const DOCUMENTS_PULL_INTERVALL = 1000 * 60 * 3; // 3 mins

export const currentYear = (() => {
  const date = new Date();
  return date.getFullYear();
})();

export const currentMonth = (() => {
  return dayjs().month() + 1;
})();

export const currentPeriod = (() => {
  const currentMonth = dayjs().month() + 1;
  if ((currentMonth >= 1 && currentMonth <= 4) || currentMonth === 12) {
    // Aralık -  Ocak - Şubat - Mart - Nisan
    return 1;
  }
  if (currentMonth >= 5 && currentMonth <= 8) {
    // Mayıs - Haziran - Temmuz - Ağustos
    return 2;
  }
  if (currentMonth >= 9 && currentMonth <= 11) {
    // Eylül - Ekim - Kasım
    return 3;
  }

  return 0;
})();

export type DocumentContent = { base64content: string; docName: string; docType: string };

const isFirstQuarter = currentPeriod === 1;
const lastYear = currentYear - 1;

const prevQuarter = {
  year: isFirstQuarter && currentMonth !== 12 ? lastYear : currentYear,
  quarter: isFirstQuarter ? 3 : currentPeriod - 1,
};

export const requiredDocs: DocumentResponseModel[] = [
  {
    LabelId: DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID,
    LabelName: 'Yıllık Beyanname',
    PeriodYear: lastYear,
    PeriodQuarter: null,
  },
  {
    LabelId: DocumentLabelID.GECICI_BEYANNAME_LABEL_ID,
    LabelName: 'Geçici Beyanname',
    PeriodYear: prevQuarter.year,
    PeriodQuarter: prevQuarter.quarter,
  },
  {
    LabelId: DocumentLabelID.MIZAN_LABEL_ID,
    LabelName: 'Mizan',
    PeriodYear: prevQuarter.year,
    PeriodQuarter: prevQuarter.quarter,
  },
  { LabelId: DocumentLabelID.FINDEKS_LABEL_ID, LabelName: 'Findeks Raporu', PeriodQuarter: null, PeriodYear: null },
];

export const requiredDocsForSkor: DocumentResponseModel[] = [
  {
    LabelId: DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID,
    LabelName: 'Yıllık Beyanname',
    PeriodYear: lastYear,
    PeriodQuarter: null,
  },
  {
    LabelId: DocumentLabelID.GECICI_BEYANNAME_LABEL_ID,
    LabelName: 'Geçici Beyanname',
    PeriodYear: prevQuarter.year,
    PeriodQuarter: prevQuarter.quarter,
  },
  {
    LabelId: DocumentLabelID.MIZAN_LABEL_ID,
    LabelName: 'Mizan',
    PeriodYear: prevQuarter.year,
    PeriodQuarter: prevQuarter.quarter,
  },
  {
    LabelId: DocumentLabelID.VERGI_LEVHASI_LABEL_ID,
    LabelName: 'Vergi Levhası',
    PeriodQuarter: null,
    PeriodYear: null,
  },
];

const requiredDocumentIds = requiredDocs.map((d) => d.LabelId);
const requiredSkorDocumentIds = requiredDocsForSkor.map((d) => d.LabelId);

const isDocRequired = (doc: DocumentResponseModel) => !!doc?.LabelId && requiredDocumentIds.includes(doc.LabelId);
const isDocSkorRequired = (doc: DocumentResponseModel) =>
  !!doc?.LabelId && requiredSkorDocumentIds.includes(doc.LabelId);

const useDocumentsData = (getDocumentsApiArg: GetDocumentsApiArg) => {
  const notice = useNotice();

  const [documentContent, setDocumentContent] = useState<DocumentContent | null>(null);
  const docResponse = useGetDocumentsQuery(getDocumentsApiArg, { pollingInterval: DOCUMENTS_PULL_INTERVALL });
  const [_deleteDocument, { data: _deleteResponse, error: _deleteError, isLoading: _isDeleteDocumentLoading }] =
    useDeleteDocumentsByIdMutation();
  const [
    _getDocumentsById,
    { isLoading: _isGetDocumentByIdLoading, isFetching: _isGetDocumentByFetching, error: _getDocumentByIdError },
  ] = useLazyGetDocumentsByIdFileQuery();
  const [_getAbf, { isLoading: _isABFLoading, isFetching: _isABFFetching, error: _getABFError }] =
    useLazyGetDocumentsByIdViewQuery();
  const { error, data, refetch, isLoading: isDocumentsLoading, isFetching: isDocumentsFetching } = docResponse;
  useErrorListener([error, _getDocumentByIdError, _deleteError, _getABFError]);

  const isTouched = useRef<boolean>(false);
  const initialDocs = useRef<DocumentResponseModel[] | null>(null);

  useEffect(() => {
    if (!data) return;

    if (!initialDocs.current) {
      initialDocs.current = data;
      return;
    }
    isTouched.current = !isEqual(initialDocs.current, data);
  }, [data]);

  useEffect(() => {
    if (_deleteResponse) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Belge başarıyla silindi',
        buttonTitle: 'Tamam',
      });
      refetch();
    }
  }, [_deleteResponse, notice, refetch]);

  const handleDownloadDocument = async (doc: DocumentResponseModel, fileName?: string) => {
    const { docName, base64content, docType } = await getDocumentContent(doc);
    FileSaver.saveAs(`data:${checkType(docType)};base64,${base64content}`, `${fileName || docName}.${docType}`);
  };

  const getDocumentContent = async (doc: DocumentResponseModel) => {
    if (!doc.Id) throw Error('document with no ID !!');
    const isABF = doc.LabelId === DocumentLabelID.ABF_LABEL_ID;

    const { data } = isABF ? await _getAbf(doc.Id) : await _getDocumentsById(doc.Id);

    const base64content = bufferToBase64((data as Buffer) || []);
    const docName = doc.LabelName ? doc.LabelName : doc.LabelDescription ? doc.LabelDescription : 'Doküman';

    const docType = isABF ? 'pdf' : doc.Type || '';

    const docContent: DocumentContent = { base64content, docName, docType };
    setDocumentContent(docContent);

    return docContent;
  };

  const handleDeleteDocument = async (doc: DocumentResponseModel) => {
    if (!doc.Id) throw Error('document with no ID !!');
    notice({
      type: 'confirm',
      variant: 'error',
      catchOnCancel: true,
      title: 'Uyarı',
      message: 'Bu belgeyi silmek istediğinizden emin misiniz?',
      buttonTitle: 'Sil',
      icon: 'trash-01',
    }).then(() => {
      _deleteDocument(doc?.Id ?? 0);
    });
  };

  const isUploaded = useCallback(
    (doc: DocumentResponseModel) => {
      return !!data?.find(
        (d) => d.LabelId === doc.LabelId && doc.PeriodQuarter === d.PeriodQuarter && d.PeriodYear === doc.PeriodYear,
      );
    },
    [data],
  );

  const notRequiredDocList = useMemo(() => {
    return data?.filter((doc) => !isDocRequired(doc));
  }, [data]);

  const notUploadedRequiredDocs = requiredDocs.filter((doc) => !isUploaded(doc));
  const notUploadedRequiredSkorDocs = requiredDocsForSkor.filter((doc) => !isUploaded(doc));

  const requiredDocList = useMemo(() => {
    const uploadedRequiredDocs = data?.filter((doc) => isUploaded(doc) && isDocRequired(doc)) || [];
    return [...notUploadedRequiredDocs, ...uploadedRequiredDocs];
  }, [data, isUploaded, notUploadedRequiredDocs]);

  const requiredSkorDocList = useMemo(() => {
    const uploadedRequiredDocsSkor = data?.filter((doc) => isUploaded(doc) && isDocSkorRequired(doc)) || [];
    return [...notUploadedRequiredSkorDocs, ...uploadedRequiredDocsSkor];
  }, [data, isUploaded, notUploadedRequiredSkorDocs]);

  const requiredDocListForLatestPeriod = useMemo(() => {
    return requiredSkorDocList.filter((doc) => {
      if (doc.LabelId === DocumentLabelID.VERGI_LEVHASI_LABEL_ID) return true;
      if (doc.PeriodYear === lastYear && doc.PeriodQuarter === null) return true;
      if (doc.PeriodYear === prevQuarter.year && doc.PeriodQuarter === prevQuarter.quarter) return true;
      return false;
    });
  }, [requiredSkorDocList]);

  const notUploadedRequiredDocsLatestPeriod = requiredDocListForLatestPeriod.filter((doc) => !isUploaded(doc));
  const uploadedRequiredDocsLatestPeriod =
    requiredDocListForLatestPeriod?.filter((doc) => isUploaded(doc) && isDocSkorRequired(doc)) || [];

  const isLoading = isDocumentsLoading || _isGetDocumentByIdLoading || _isDeleteDocumentLoading || _isABFLoading;
  const isFetching = _isGetDocumentByFetching || isDocumentsFetching || _isABFFetching;

  return {
    isTouched: isTouched,
    ...docResponse,
    documentContent,
    getDocumentContent,
    isLoading,
    isFetching,
    handleDownloadDocument,
    handleDeleteDocument,
    requiredDocList,
    notRequiredDocList,
    notUploadedRequiredDocs,
    requiredDocListForLatestPeriod,
    notUploadedRequiredDocsLatestPeriod,
    uploadedRequiredDocsLatestPeriod,
  };
};

export default useDocumentsData;
