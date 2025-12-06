/**
 * Edit Ratio Tally Modal
 * Modal for editing existing ratio tally
 * Follows InvoiceScoreRatios pattern exactly
 */

import { Form, Modal, ModalMethods } from '@components';
import { Box } from '@mui/material';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { useSectorRatiosForm } from '../hooks';
import type { Ratio, RatioTally, RatioTallyFormData } from '../sector-ratios.types';
import ModalActions from './ModalActions';

interface EditRatioTallyModalProps {
  ratioList: Ratio[];
  onSubmit: (data: RatioTallyFormData, ratioTally: RatioTally) => Promise<void>;
  isSubmitting: boolean;
}

export interface EditRatioTallyModalMethods {
  open: (ratioTally: RatioTally) => void;
  close: () => void;
}

const EditRatioTallyModal = forwardRef<EditRatioTallyModalMethods, EditRatioTallyModalProps>(
  ({ ratioList, onSubmit, isSubmitting }, ref) => {
    const modalRef = useRef<ModalMethods>(null);
    const ratioTallyRef = useRef<RatioTally | null>(null);
    const { form, schema, resetForm } = useSectorRatiosForm({
      ratioList,
      initialData: ratioTallyRef.current,
      isEdit: true,
    });

    useImperativeHandle(ref, () => ({
      open: (ratioTally: RatioTally) => {
        ratioTallyRef.current = ratioTally;
        resetForm(ratioTally);
        modalRef.current?.open();
      },
      close: () => {
        modalRef.current?.close();
      },
    }));

    const handleSubmit = useCallback(
      async (data: RatioTallyFormData) => {
        if (!ratioTallyRef.current) return;
        await onSubmit(data, ratioTallyRef.current);
        resetForm();
        ratioTallyRef.current = null;
        modalRef.current?.close();
      },
      [onSubmit, resetForm],
    );

    const handleClose = useCallback(() => {
      resetForm();
      ratioTallyRef.current = null;
      modalRef.current?.close();
    }, [resetForm]);

    const renderActions = useCallback(
      () => (
        <ModalActions
          onCancel={handleClose}
          onSubmit={form.handleSubmit(handleSubmit)}
          isSubmitting={isSubmitting}
          submitLabel="Güncelle"
        />
      ),
      [handleClose, form, handleSubmit, isSubmitting],
    );

    const actions = useMemo(() => [{ element: renderActions }], [renderActions]);

    return (
      <Modal
        ref={modalRef}
        title="Sektör Rasyosu Düzenle"
        maxWidth="sm"
        fullWidth={false}
        onClose={handleClose}
        actions={actions}>
        <Box sx={{ minWidth: 400 }}>
          {/* Editable form fields (point, min, max) */}
          <Form form={form} schema={schema} />
        </Box>
      </Modal>
    );
  },
);

EditRatioTallyModal.displayName = 'EditRatioTallyModal';

export default EditRatioTallyModal;
