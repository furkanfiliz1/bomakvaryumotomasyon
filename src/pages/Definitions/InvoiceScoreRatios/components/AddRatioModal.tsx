import { Form, Modal, ModalMethods } from '@components';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import useInvoiceScoreRatiosForm, { InvoiceScoreRatioFormData } from '../hooks/useInvoiceScoreRatiosForm';
import ModalActions from './ModalActions';

interface AddRatioModalProps {
  onSubmit: (data: InvoiceScoreRatioFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface AddRatioModalMethods {
  open: () => void;
  close: () => void;
}

const AddRatioModal = forwardRef<AddRatioModalMethods, AddRatioModalProps>(({ onSubmit, isSubmitting }, ref) => {
  const modalRef = useRef<ModalMethods>(null);
  const { form, schema } = useInvoiceScoreRatiosForm();

  useImperativeHandle(ref, () => ({
    open: () => {
      form.reset();
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
        submitLabel="Ekle"
      />
    ),
    [handleClose, form, handleSubmit, isSubmitting],
  );

  const actions = useMemo(() => [{ element: renderActions }], [renderActions]);

  return (
    <Modal ref={modalRef} title="Yeni Rasyo Tanımı Ekle" maxWidth="sm" onClose={handleClose} actions={actions}>
      <Form form={form} schema={schema} />
    </Modal>
  );
});

AddRatioModal.displayName = 'AddRatioModal';

export default AddRatioModal;
