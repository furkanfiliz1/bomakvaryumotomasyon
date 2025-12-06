import { Form, Modal, ModalMethods } from '@components';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import useInvoiceScoreRatiosForm, { InvoiceScoreRatioFormData } from '../hooks/useInvoiceScoreRatiosForm';
import type { InvoiceScoreMetricDefinition } from '../invoice-score-ratios.types';
import ModalActions from './ModalActions';

interface EditRatioModalProps {
  onSubmit: (data: InvoiceScoreRatioFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface EditRatioModalMethods {
  open: (definition: InvoiceScoreMetricDefinition) => void;
  close: () => void;
}

const EditRatioModal = forwardRef<EditRatioModalMethods, EditRatioModalProps>(({ onSubmit, isSubmitting }, ref) => {
  const modalRef = useRef<ModalMethods>(null);
  const { form, schema } = useInvoiceScoreRatiosForm();

  useImperativeHandle(ref, () => ({
    open: (definition: InvoiceScoreMetricDefinition) => {
      form.reset({
        Min: definition.Min !== null && definition.Min !== undefined ? String(definition.Min) : '',
        Max: definition.Max !== null && definition.Max !== undefined ? String(definition.Max) : '',
        Value: String(definition.Value),
        Percent: String(definition.Percent),
      });
      modalRef.current?.open();
    },
    close: () => {
      modalRef.current?.close();
    },
  }));

  const handleSubmit = useCallback(
    async (data: InvoiceScoreRatioFormData) => {
      await onSubmit(data);
      form.reset();
      modalRef.current?.close();
    },
    [onSubmit, form],
  );

  const handleClose = useCallback(() => {
    form.reset();
    modalRef.current?.close();
  }, [form]);

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
    <Modal ref={modalRef} title="Rasyo Tanımını Düzenle" maxWidth="sm" onClose={handleClose} actions={actions}>
      <Form form={form} schema={schema} />
    </Modal>
  );
});

EditRatioModal.displayName = 'EditRatioModal';

export default EditRatioModal;
