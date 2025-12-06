/**
 * Add Ratio Tally Modal
 * Modal for adding new ratio tally to selected sector
 * Follows InvoiceScoreRatios pattern exactly
 */

import { Form, Modal, ModalMethods } from '@components';
import { Stack } from '@mui/material';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { useSectorRatiosForm } from '../hooks';
import type { Ratio, RatioTallyFormData } from '../sector-ratios.types';
import ModalActions from './ModalActions';

interface AddRatioTallyModalProps {
  ratioList: Ratio[];
  onSubmit: (data: RatioTallyFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface AddRatioTallyModalMethods {
  open: () => void;
  close: () => void;
}

const AddRatioTallyModal = forwardRef<AddRatioTallyModalMethods, AddRatioTallyModalProps>(
  ({ ratioList, onSubmit, isSubmitting }, ref) => {
    const modalRef = useRef<ModalMethods>(null);
    const { form, schema, resetForm } = useSectorRatiosForm({ ratioList, isEdit: false });

    useImperativeHandle(ref, () => ({
      open: () => {
        resetForm();
        modalRef.current?.open();
      },
      close: () => {
        modalRef.current?.close();
      },
    }));

    const handleSubmit = useCallback(
      async (data: RatioTallyFormData) => {
        await onSubmit(data);
        resetForm();
        modalRef.current?.close();
      },
      [onSubmit, resetForm],
    );

    const handleClose = useCallback(() => {
      resetForm();
      modalRef.current?.close();
    }, [resetForm]);

    const renderActions = useCallback(
      () => (
        <ModalActions
          onCancel={handleClose}
          onSubmit={form.handleSubmit(handleSubmit)}
          isSubmitting={isSubmitting}
          submitLabel="Ekle"
        />
      ),
      [handleClose, form, handleSubmit, isSubmitting],
    );

    const actions = useMemo(() => [{ element: renderActions }], [renderActions]);

    return (
      <Modal
        ref={modalRef}
        title="Yeni Sektör Rasyosu Ekle"
        maxWidth="sm"
        fullWidth={false}
        onClose={handleClose}
        actions={actions}>
        <Stack spacing={2} sx={{ minWidth: 400 }}>
          <Form form={form} schema={schema} />
        </Stack>
      </Modal>
    );
  },
);

AddRatioTallyModal.displayName = 'AddRatioTallyModal';

export default AddRatioTallyModal;
