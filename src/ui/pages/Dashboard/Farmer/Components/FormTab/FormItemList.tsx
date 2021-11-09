import React, { useCallback } from 'react';

// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
//
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import FormItem from './FormItemQuestion';
import FormItemToolbar from './FormItemToolbar';
import * as XLSX from 'xlsx';
import { capitalizeAllWords } from '~utils/Word';
import { FormMade, ColumnAttributes } from '~models/organizationFormAttribute';
// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  height: '100%'
});

// ----------------------------------------------------------------------

type FormItemListProps = {
  formItem: FormMade;
  description_name: string;
};

function FormItemList({ formItem, description_name }: FormItemListProps) {
  const downloadExcel = useCallback((s: any) => {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }, []);

  const saveAs = useCallback((blob: any, fileName: any) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }, []);

  const handleOnDownload = useCallback(() => {
    const sheetName = 'Formulario_productor';
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: sheetName,
      Subject: ''
    };

    wb.SheetNames.push(sheetName);
    const colsWch: any[] = [];
    const wsHeaderName: string[] = [];
    const wsHeader: string[] = formItem?.attributes?.map((head: any) => {
      colsWch.push({ wch: head?.display_name?.length + 5 });
      wsHeaderName.push(head.display_name);
      return head?.display_name;
    });

    const wsData: any[] = formItem?.attributes?.map((value: any) => {
      return capitalizeAllWords(value?.value);
    });

    const ws = XLSX.utils.aoa_to_sheet([wsHeader, ...[wsData]]);
    ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 10 }, ...colsWch];
    wb.Sheets[sheetName] = ws;
    const workBook = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([downloadExcel(workBook)], { type: 'application/octet-stream' }), `${sheetName}.xlsx`);
  }, [downloadExcel, saveAs, formItem]);

  return (
    <RootStyle>
      <FormItemToolbar formName={description_name} formDate={formItem.created_at} handleOnDownload={handleOnDownload} />

      <Divider />

      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': { display: 'flex', flexDirection: 'column' }
        }}>
        {formItem?.attributes?.map((item: ColumnAttributes, index: number) => (
          <React.Fragment key={`item_${index}`}>
            <FormItem varKey={item.display_name} varValue={item.value} varType={item.type} />
          </React.Fragment>
        ))}
      </Scrollbar>
    </RootStyle>
  );
}

export default React.memo(FormItemList);
