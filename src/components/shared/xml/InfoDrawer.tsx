import { Button, InfoDrawer, InfoDrawerMethods } from '@components';
import { List, ListItem } from '@mui/material';
import { UserTypes } from '@types';
import { FC, useRef } from 'react';

interface Props {
  type: UserTypes.BUYER | UserTypes.SELLER;
}

const FileUploadInfoDrawer: FC<Props> = (props) => {
  const { type } = props;
  const infoDrawer = useRef<InfoDrawerMethods>(null);

  const handleInfoDrawer = () => {
    infoDrawer?.current?.open();
  };

  const InfoList = (
    <List
      sx={{
        listStyleType: 'disc',
        listStylePosition: 'inside',
      }}>
      {type === UserTypes.BUYER && (
        <>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            E-Fatura XML dosyalarınızı yükleyebilirsiniz.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Sadece .xml uzantılı dosyalar kabul edilir.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Dosya boyutu maksimum 10 MB olabilir.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Tek seferde en fazla 50 fatura yükleyebilirsiniz.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Daha önce yüklenmiş faturalar tekrar yüklenemez.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Sistemde kayıtlı olmayan müşterilere ait faturalar yüklenemez.
          </ListItem>
        </>
      )}
      {type === UserTypes.SELLER && (
        <>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            E-Fatura XML dosyalarınızı yükleyebilirsiniz.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Sadece .xml uzantılı dosyalar kabul edilir.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Dosya boyutu maksimum 10 MB olabilir.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Tek seferde en fazla 50 fatura yükleyebilirsiniz.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }} disableGutters>
            Daha önce yüklenmiş faturalar tekrar yüklenemez.
          </ListItem>
        </>
      )}
    </List>
  );
  return (
    <>
      <Button
        id="INFO_TEXT"
        onClick={handleInfoDrawer}
        disableRipple
        sx={{
          textTransform: 'none',
          padding: 0,
          fontSize: 13.5,
          backgroundColor: 'transparent !important',
          '&:hover': {
            opacity: 0.78,
          },
        }}>
        Fatura Yükleme Kuralları
      </Button>
      <InfoDrawer title="Fatura Yükleme Kuralları" ref={infoDrawer}>
        {InfoList}
      </InfoDrawer>
    </>
  );
};

export default FileUploadInfoDrawer;
