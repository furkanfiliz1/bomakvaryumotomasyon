import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCompanyRolesQuery, useGetUserRolesQuery, useUpdateUserRolesMutation } from '../companies.api';
import { CompanyRole } from '../companies.types';

interface UseUserPermissionsReturn {
  roles: CompanyRole[];
  loading: boolean;
  error: string | null;
  onAddAll: () => void;
  onRemoveAll: () => void;
  onChangeRole: (roleId: number, checked: boolean) => void;
  savePermissions: () => Promise<void>;
  hasChanges: boolean;
}

export const useUserPermissions = (): UseUserPermissionsReturn => {
  const { companyId, userId } = useParams<{ companyId: string; userId: string }>();
  const [localRoles, setLocalRoles] = useState<CompanyRole[]>([]);
  const [initialSelectedRoles, setInitialSelectedRoles] = useState<number[]>([]);

  const notice = useNotice();

  // Check if we're in edit mode (not 'yeni')
  const isEditMode = userId !== 'yeni' && userId !== undefined;
  const numericUserId = isEditMode ? Number(userId) : 0;

  // API queries
  const {
    data: companyRoles = [],
    isLoading: rolesLoading,
    error: rolesError,
  } = useGetCompanyRolesQuery(
    { companyId: Number(companyId) },
    {
      skip: !companyId || !isEditMode,
      refetchOnMountOrArgChange: true, // Her mount olduğunda fresh data çek
    },
  );

  const {
    data: userRoles = [],
    isLoading: userRolesLoading,
    error: userRolesError,
  } = useGetUserRolesQuery(
    { companyId: Number(companyId), userId: numericUserId },
    {
      skip: !companyId || !isEditMode || numericUserId === 0,
      refetchOnMountOrArgChange: true, // Her mount olduğunda fresh data çek
    },
  );

  const [updateUserRoles, { isLoading: updating, isSuccess, error: updateError }] = useUpdateUserRolesMutation();
  useErrorListener([rolesError, userRolesError, updateError]);
  // Combine data when both queries are ready
  useEffect(() => {
    if (companyRoles.length > 0) {
      const userRoleIds = userRoles.map((role) => role.Id);
      setInitialSelectedRoles(userRoleIds);

      const rolesWithSelection = companyRoles.map((role) => ({
        ...role,
        selected: userRoleIds.includes(role.Id),
      }));

      setLocalRoles(rolesWithSelection);
    }
  }, [companyRoles, userRoles]);

  // Component unmount olduğunda veya userId değiştiğinde local state'i temizle
  useEffect(() => {
    return () => {
      setLocalRoles([]);
      setInitialSelectedRoles([]);
    };
  }, [userId]);

  // Computed values
  const loading = rolesLoading || userRolesLoading || updating;
  const error = rolesError || userRolesError ? 'Yetki bilgileri yüklenirken bir hata oluştu.' : null;

  const currentSelectedRoles = useMemo(
    () => localRoles.filter((role) => role.selected).map((role) => role.Id),
    [localRoles],
  );

  const hasChanges = useMemo(() => {
    const current = currentSelectedRoles.sort();
    const initial = [...initialSelectedRoles].sort();
    return JSON.stringify(current) !== JSON.stringify(initial);
  }, [currentSelectedRoles, initialSelectedRoles]);

  // Handlers
  const onAddAll = () => {
    setLocalRoles((prev) => prev.map((role) => ({ ...role, selected: true })));
  };

  const onRemoveAll = () => {
    setLocalRoles((prev) => prev.map((role) => ({ ...role, selected: false })));
  };

  const onChangeRole = (roleId: number, checked: boolean) => {
    setLocalRoles((prev) => prev.map((role) => (role.Id === roleId ? { ...role, selected: checked } : role)));
  };

  const savePermissions = async (): Promise<void> => {
    if (!companyId || !isEditMode || numericUserId === 0) {
      throw new Error('Geçersiz parametre değerleri');
    }

    try {
      const selectedRoleIds = localRoles.filter((role) => role.selected).map((role) => role.Id);

      await updateUserRoles({
        companyId: Number(companyId),
        userId: numericUserId,
        data: {
          UserId: userId,
          CompanyRoleIds: selectedRoleIds,
        },
      }).unwrap();

      // Update initial state after successful save
      setInitialSelectedRoles(selectedRoleIds);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage = err?.data?.message || err?.message || 'Yetkiler güncellenirken bir hata oluştu';
      console.error('Error updating user permissions:', errorMessage);
      throw error;
    }
  };

  // Handle success notification
  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket bilgileri başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccess, notice]);

  return {
    roles: localRoles,
    loading,
    error,
    onAddAll,
    onRemoveAll,
    onChangeRole,
    savePermissions,
    hasChanges,
  };
};
