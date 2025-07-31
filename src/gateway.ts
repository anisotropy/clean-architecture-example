/**
 * 게이트웨이
 * - 서버 통신에 대한 인테페이스이다.
 * - 엔티티와 유스케이스에만 의존한다.
 * - 순수함수로 구성되어 있어서 테스트하기 쉽다.
 * - 특정 프레임워크나 라이브러리에 의존하지 않는다.
 */

/**
 * 유스케이스에만 의존한다.
 */
import type { RecipientUpdateFetcher, RecipientUpdateUpdater } from "./useCase";

export type RecipientFetcherApi = (recipientId: string) => Promise<{
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  account_number: string;
}>;

export const recipientFetcher: (
  api: RecipientFetcherApi
) => RecipientUpdateFetcher = (api) => async (params) => {
  try {
    const response = await api(params.recipientId);
    params.onSuccess({
      id: response.id,
      firstName: response.first_name,
      middleName: response.middle_name,
      lastName: response.last_name,
      accountNumber: response.account_number,
    });
  } catch (error) {
    console.error(error);
    params.onError();
  }
};

export type RecipientUpdaterApi = (params: {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  account_number: string;
}) => Promise<void>;

export const recipientUpdater: (
  api: RecipientUpdaterApi
) => RecipientUpdateUpdater = (api) => async (params) => {
  const apiParams = {
    id: params.recipient.id,
    first_name: params.recipient.firstName,
    middle_name: params.recipient.middleName,
    last_name: params.recipient.lastName,
    account_number: params.recipient.accountNumber,
  };
  try {
    await api(apiParams);
    params.onSuccess();
  } catch (error) {
    console.error(error);
    params.onError();
  }
};
