import { getRandomNumber, makeWord, randomInteger } from '@helpers';
import template from './template';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { RESPONSE_DATE } from '@constant';

export interface XMLValues {
  ID: string;
  UUID: string;
  BUYER_ID: string;
  SELLER_ID: string;
  paymentDueDate: string;
  issueDate: string;
  payableAmount: number;
  taxInclusiveAmount: number;
  taxExclusiveAmount: number;
  SELLER_NAME: string;
  SELLER_MIDDLE_NAME: string;
  SELLER_FAMILY_NAME: string;
  HASH_CODE: string;
}

export class XML {
  private ID: string;
  private UUID: string;
  private BUYER_ID = '5777777777';
  private SELLER_ID = '5888888888';
  private paymentDueDate: string;
  private issueDate: string;
  private payableAmount: number;
  private taxExclusiveAmount: number;
  private SELLER_NAME: string;
  private SELLER_MIDDLE_NAME: string;
  private SELLER_FAMILY_NAME: string;
  private HASH_CODE: string;

  constructor() {
    const serialNo = makeWord(3);
    const sequenceNo = randomInteger(1000000000000, 9999999999999); // 13 basamaklı sayı
    this.ID = serialNo + sequenceNo;

    this.paymentDueDate = dayjs().add(randomInteger(1, 60), 'day').format(RESPONSE_DATE);
    this.issueDate = dayjs().subtract(randomInteger(1, 20), 'day').format(RESPONSE_DATE);
    this.UUID = Date.now().toString(36) + Math.random().toString(36).substring(2);
    this.HASH_CODE = Date.now().toString(36) + getRandomNumber();

    this.payableAmount = randomInteger(1, 100000) + randomInteger(1, 100) / 100;
    this.taxExclusiveAmount = this.payableAmount;

    this.SELLER_NAME = 'Ahmet';
    this.SELLER_MIDDLE_NAME = 'Mehmet';
    this.SELLER_FAMILY_NAME = 'Ali';
  }

  save() {
    let templateCpy = template;

    templateCpy = templateCpy.replace(new RegExp('{{ID}}', 'gm'), this.ID);
    templateCpy = templateCpy.replace(new RegExp('{{UUID}}', 'gm'), this.UUID);

    templateCpy = templateCpy.replace(new RegExp('{{ISSUE_DATE}}', 'gm'), this.issueDate);
    if (this.paymentDueDate) {
      templateCpy = templateCpy.replace(new RegExp('{{PAYMENT_DUE_DATE}}', 'gm'), this.paymentDueDate);
    } else {
      templateCpy = templateCpy.replace(
        new RegExp('<cbc:PaymentDueDate>{{PAYMENT_DUE_DATE}}</cbc:PaymentDueDate>', 'gm'),
        '',
      );
    }

    templateCpy = templateCpy.replace(new RegExp('{{PayableAmount}}', 'gm'), this.payableAmount.toString());
    templateCpy = templateCpy.replace(new RegExp('{{TaxInclusiveAmount}}', 'gm'), this.payableAmount.toString());
    templateCpy = templateCpy.replace(new RegExp('{{TaxExclusiveAmount}}', 'gm'), this.taxExclusiveAmount.toString());

    templateCpy = templateCpy.replace(new RegExp('{{BUYER_ID}}', 'gm'), this.BUYER_ID);
    templateCpy = templateCpy.replace(new RegExp('{{SELLER_ID}}', 'gm'), this.SELLER_ID);

    templateCpy = templateCpy.replace(new RegExp('{{SELLER_NAME}}', 'gm'), this.SELLER_NAME);
    templateCpy = templateCpy.replace(new RegExp('{{SELLER_MIDDLE_NAME}}', 'gm'), this.SELLER_MIDDLE_NAME);
    templateCpy = templateCpy.replace(new RegExp('{{SELLER_FAMILY_NAME}}', 'gm'), this.SELLER_FAMILY_NAME);
    templateCpy = templateCpy.replace(new RegExp('{{HASH_CODE}}', 'gm'), this.HASH_CODE);

    templateCpy = templateCpy.replace(
      new RegExp('{{COMPANY_TITLE}}', 'gm'),
      `${this.SELLER_NAME} ${this.SELLER_MIDDLE_NAME} ${this.SELLER_FAMILY_NAME}`,
    );

    const blob = new Blob([templateCpy], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(blob, this.ID + '.xml');
  }

  get values(): XMLValues {
    return {
      ID: this.ID,
      UUID: this.UUID,
      BUYER_ID: this.BUYER_ID,
      SELLER_ID: this.SELLER_ID,
      paymentDueDate: this.paymentDueDate,
      issueDate: this.issueDate,
      payableAmount: this.payableAmount,
      taxInclusiveAmount: this.payableAmount,
      taxExclusiveAmount: this.taxExclusiveAmount,
      SELLER_NAME: this.SELLER_NAME,
      SELLER_MIDDLE_NAME: this.SELLER_MIDDLE_NAME,
      HASH_CODE: this.HASH_CODE,
      SELLER_FAMILY_NAME: this.SELLER_FAMILY_NAME,
    };
  }

  set values(values: XMLValues) {
    this.ID = values.ID;
    this.UUID = values.UUID;
    this.BUYER_ID = values.BUYER_ID;
    this.SELLER_ID = values.SELLER_ID;
    this.paymentDueDate = values.paymentDueDate;
    this.issueDate = values.issueDate;
    this.payableAmount = values.payableAmount;
    this.taxExclusiveAmount = values.taxExclusiveAmount;
    this.SELLER_NAME = values.SELLER_NAME;
    this.SELLER_MIDDLE_NAME = values.SELLER_MIDDLE_NAME;
    this.SELLER_FAMILY_NAME = values.SELLER_FAMILY_NAME;
    this.HASH_CODE = values.HASH_CODE;
  }
}
