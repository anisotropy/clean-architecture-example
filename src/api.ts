/**
 * API
 * - 게이트웨이에 대한 '험블 함수'이다.
 * - 비순수함수이기 때문에 테스트하기 어렵다.
 * - 유스케이스, 게이트웨이에 의존적이다.
 */

import type { RecipientFetcherApi, RecipientUpdaterApi } from "./gateway";

const db = {
  recipient: {
    id: "1",
    first_name: "Hodoug",
    last_name: "Joung",
    account_number: "12345678901234",
  },
};

export const recipientFetcherApi: RecipientFetcherApi = (recipientId: string) =>
  new Promise<Awaited<ReturnType<RecipientFetcherApi>>>((resolve) => {
    setTimeout(() => {
      resolve({ ...db.recipient, id: recipientId });
    }, 1000);
  });

export const recipientUpdaterApi: RecipientUpdaterApi = (params) =>
  new Promise((resolve) => {
    setTimeout(() => {
      db.recipient = params;
      resolve();
    }, 1000);
  });
